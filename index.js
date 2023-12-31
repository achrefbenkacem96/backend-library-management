// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const booksRouter = require('./routes/books');
const membersRouter = require('./routes/members');
const borrowRouter = require('./routes/borrow'); // Nouveau router pour les emprunts

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/books', booksRouter);
app.use('/members', membersRouter);
app.use('/borrow', borrowRouter);  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
