const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const app = express();
const bodyParser = require("body-parser");
var cors = require('cors')
const Book = require('./models/bookschema');

const db = config.get('mongoURI');

const port = 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose
    .connect(db, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


app.post('/books/addbook', (req, res) => {
    const newBook = new Book({
        name: req.body.name,
        author: req.body.author,
        price: req.body.price,
        imgurl: req.body.imgurl
    })

    newBook.save()
        .then(item => console.log("Added"))
        .catch(err => console.log(err));
});


app.get('/books/list', async (req, res) => {
    await Book.find({}, (err, books) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!books.length) {
            return res
                .status(404)
                .json({ success: false, error: `books not found` })
        }
        return res.status(200).json({ success: true, data: books })
    }).catch(err => console.log(err))
});

app.delete('/books/deletebook/:id', async (req, res) => {  
    await Book.findOneAndDelete({ _id: req.params.id }, (err, book) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!book) {
            return res
                .status(404)
                .json({ success: false, error: `book not found` })
        }

        return res.status(200).json({ success: true, data: book })
    }).catch(err => console.log(err))
  })

  app.get('/books/edit/:id', async (req, res) => {  
    await Book.findOne({ _id: req.params.id }, (err, book) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!book) {
            return res
                .status(404)
                .json({ success: false, error: `book not found` })
        }
        return res.status(200).json({ success: true, data: book })
    }).catch(err => console.log(err))
  })

  app.put('/books/update/book/:id', (req, res) => {  
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Book.findOne({ _id: req.params.id }, (err, book) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'book not found!',
            })
        }
        book.name = body.name
        book.author = body.author
        book.price = body.price
        book.imgurl = body.imgurl
        book
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: book._id,
                    message: 'book updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'book not updated!',
                })
            })
    })
  })


app.listen(port, () => console.log(`Server started on port: http://localhost:${port}`));

