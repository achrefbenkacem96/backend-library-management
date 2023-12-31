const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  isbn: { type: String, required: true, unique: true },
  borrowed: { type: Boolean, default: false },
  borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null },
  borrowDate: { type: Date, default: null },
  returnDate: { type: Date, default: null },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;