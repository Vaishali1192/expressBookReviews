const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(
        user => user.username === username && user.password === password
    );
}

//only registered users can login

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const accessToken = jwt.sign(
        { username },
        "access",
        { expiresIn: "1h" }
    );

    // Save authentication details in the session
    req.session.authorization = {
        accessToken,
        username
    };

    return res.status(200).json({
        message: "Login successful"
    });
});



/**
 * Add or update a book review
 */
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Check if the user is logged in
    if (!req.session || !req.session.authorization) {
        return res.status(403).json({
            message: "User not logged in"
        });
    }

    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    // Check if a review was provided
    if (!review || !review.trim()) {
        return res.status(400).json({
            message: "Review is required"
        });
    }

    // Add the review or update the existing review for this user
    books[isbn].reviews[username] = review.trim();

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});


/**
 * Delete a book review
 */
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Check if the user is logged in
    if (!req.session || !req.session.authorization) {
        return res.status(403).json({
            message: "User not logged in"
        });
    }

    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    // Check if this user has a review for the book
    if (!Object.prototype.hasOwnProperty.call(books[isbn].reviews, username)) {
        return res.status(404).json({
            message: "No review found for this user"
        });
    }

    // Delete only the logged-in user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully",
        reviews: books[isbn].reviews
    });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
