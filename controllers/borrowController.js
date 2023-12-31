// controllers/borrowController.js
const Book = require('../models/book');
const Member = require('../models/Member');

const borrowController = {
    borrowBook: async (req, res) => {
        const { bookId } = req.params;
        const { memberId, returnDate } = req.body;
    
        try {
          // Check if the book is already borrowed
          const book = await Book.findById(bookId);
          if (book.borrowed) {
            return res.status(400).json({ message: 'The book is already borrowed.' });
          }
    
          // Check if the member exists
          const member = await Member.findById(memberId);
          if (!member) {
            return res.status(404).json({ message: 'Member not found.' });
          }
    
          // Validate return date if provided
          if (returnDate) {
            const today = new Date();
            const returnDateObj = new Date(returnDate);
    
            // Ensure the return date is in the future
            if (returnDateObj <= today) {
              return res.status(400).json({ message: 'Return date must be in the future.' });
            }
          }
    
          // Calculate the expected return date if not provided
          const expectedReturnDate = returnDate ? new Date(returnDate) : new Date();
          expectedReturnDate.setDate(expectedReturnDate.getDate() + 14);
    
          // Mark the book as borrowed and associate it with the member
          book.borrowed = true;
          book.borrower = member._id;
          book.borrowDate = new Date();
          book.expectedReturnDate = expectedReturnDate;
    
          await book.save();
    
          // Add the borrowed book to the member's list
          console.log("🚀 ~ file: borrowController.js:48 ~ borrowBook: ~ book._id.toString():", book._id.toString())
          member.borrowedBooks.push(book._id.toString());
          await member.save();
    
          res.json({
            message: 'Borrow successful.',
            book,
            member,
            expectedReturnDate,
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'An error occurred during borrowing.' });
        }
      },

  returnBook: async (req, res) => {
    const { bookId } = req.params;

    try {
      // Vérifiez si le livre est emprunté
      const book = await Book.findById(bookId);
      if (!book.borrowed) {
        return res.status(400).json({ message: 'Le livre n\'est pas emprunté.' });
      }

      // Marquez le livre comme rendu et retirez-le de la liste du membre
      book.borrowed = false;
      book.borrower = null;
      book.returnDate = new Date();
      await book.save();

      const member = await Member.findById(book.borrower);
      if (member) {
        member.borrowedBooks = member.borrowedBooks.filter(b => b.toString() !== book._id.toString());
        await member.save();
      }

      res.json({ message: 'Retour du livre réussi.', book, member });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur est survenue lors du retour du livre.' });
    }
  },
  getBorrowedBooks: async (req, res) => {
    try {
      // Récupérez tous les livres empruntés
      const borrowedBooks = await Book.find({ borrowed: true }).populate('borrower');

      // Filtrer les informations pour obtenir uniquement ce dont vous avez besoin
      const borrowedBooksInfo = borrowedBooks.map(book => ({
        title: book.title,
        borrower: book.borrower.name, // Supposons que le modèle Member a un champ 'name'
        returnDate: book.returnDate,
        _id: book._id,
      }));

      res.json(borrowedBooksInfo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des livres empruntés.' });
    }
  },
};

module.exports = borrowController;
