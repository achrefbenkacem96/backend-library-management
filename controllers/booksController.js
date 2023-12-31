// controllers/booksController.js
const Book = require('../models/book');

const booksController = {
  getAllBooks: async (req, res) => {
    try {
      const books = await Book.find();
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des livres.' });
    }
  },

  addBook: async (req, res) => {
    const { title, author, year, isbn } = req.body;

    try {
      const existingBook = await Book.findOne({ isbn });
      if (existingBook) {
        return res.status(400).json({ message: 'Un livre avec cet ISBN existe déjà.' });
      }

      const newBook = new Book({ title, author, year, isbn });
      await newBook.save();

      res.status(201).json({ message: 'Livre ajouté avec succès.', book: newBook });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur est survenue lors de l\'ajout du livre.' });
    }
  },

  updateBook: async (req, res) => {
    const { bookId } = req.params;
    console.log("🚀 ~ file: booksController.js:35 ~ updateBook: ~ bookId:", bookId)
    const { title, author, year, isbn } = req.body;

    try {
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé.' });
      }

      book.title = title || book.title;
      book.author = author || book.author;
      book.year = year || book.year;
      book.isbn = isbn || book.isbn;

      await book.save();

      res.json({ message: 'Livre mis à jour avec succès.', book });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la mise à jour du livre.' });
    }
  },

  deleteBook: async (req, res) => {
    const { bookId } = req.params;

    try {
        
      const book = await Book.findByIdAndDelete(bookId);

 
      res.json({ message: 'Livre supprimé avec succès.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du livre.' });
    }
  },
};

module.exports = booksController;
