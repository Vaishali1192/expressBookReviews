const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!users.includes(username)) {
            users.push({ username: username, password: password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(409).json({ message: "Username already exists" });
        }
    }

    return res.status(400).json({ message: "Username and password are required" });
});

// Get the book list available in the shop

// Get the book list using async/await
public_users.get('/', async (req, res) => {
    try {
        const bookList = await Promise.resolve(books);
        return res.status(200).json(bookList);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});


// Get book details based on ISBN

 // Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;

        // Retrieve the book details asynchronously
        const book = await Promise.resolve(books[isbn]);

        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({
                message: "Book not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving book details"
        });
    }
});

  
// Get book details based on author

 // Get book details based on author using async/await
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;

        // Retrieve matching books asynchronously
        const matchingBooks = await Promise.resolve(
            Object.keys(books)
                .filter(key =>
                    books[key].author.toLowerCase() === author.toLowerCase()
                )
                .map(key => books[key])
        );

        return res.status(200).json(matchingBooks);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books by author"
        });
    }
});


// Get all books based on title

 // Get book details based on title using async/await
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;

        const matchingBooks = await Promise.resolve(
            Object.keys(books)
                .filter(key =>
                    books[key].title.toLowerCase() === title.toLowerCase()
                )
                .map(key => books[key])
        );

        return res.status(200).json(matchingBooks);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books by title"
        });
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
