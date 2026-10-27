
const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const users = require('./auth_users.js').users;

const public_users = express.Router();
const BOOKS_API = 'http://127.0.0.1:5000/internal/books';

// Register a user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    if (users.some(user => user.username === username)) {
        return res.status(409).json({
            message: 'Username already exists'
        });
    }

    users.push({ username, password });

    return res.status(200).json({
        message: 'User successfully registered. Now you can login'
    });
});

// Task 1 and Task 10: Get all books using Axios
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get(BOOKS_API);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving books'
        });
    }
});

// Task 2 and Task 11: Get book by ISBN using Axios
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get(BOOKS_API);
        const book = response.data[req.params.isbn];

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving book details'
        });
    }
});

// Task 3 and Task 12: Get books by author using Axios
public_users.get('/author/:author', async (req, res) => {
    try {
        const response = await axios.get(BOOKS_API);
        const author = req.params.author.toLowerCase();

        const matchingBooks = Object.values(response.data).filter(
            book => book.author.toLowerCase() === author
        );

        return res.status(200).json(matchingBooks);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving books by author'
        });
    }
});

// Task 4 and Task 13: Get books by title using Axios
public_users.get('/title/:title', async (req, res) => {
    try {
        const response = await axios.get(BOOKS_API);
        const title = req.params.title.toLowerCase();

        const matchingBooks = Object.values(response.data).filter(
            book => book.title.toLowerCase() === title
        );

        return res.status(200).json(matchingBooks);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving books by title'
        });
    }
});

// Task 5: Get reviews by ISBN
public_users.get('/review/:isbn', (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
