// routes/books.js
const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');

router.get('/', booksController.getAllBooks);
router.post('/', booksController.addBook);
router.put('/:bookId', booksController.updateBook);
router.delete('/:bookId', booksController.deleteBook);

module.exports = router;