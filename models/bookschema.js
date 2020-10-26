const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BookSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  author: {
    type: String,
  },
  price: {
    type: Number,
  },
  imgurl: {
    type: String,
  }
});
module.exports = Item = mongoose.model('books', BookSchema);