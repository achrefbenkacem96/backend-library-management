// routes/borrow.js
const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');

router.post('/:bookId', borrowController.borrowBook);
router.put('/:bookId/return', borrowController.returnBook);
router.get('/borrowed-books', borrowController.getBorrowedBooks);

module.exports = router;