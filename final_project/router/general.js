const express = require('express');
const axios = require('axios');
let books = require("./booksdb").books;

const public_users = express.Router();

// Task 1: Get all books
public_users.get('/', (req, res) => {
    res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn], null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Task 3: Get books by author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();
    let result = {};
    Object.keys(books).forEach(isbn => {
        if (books[isbn].author.toLowerCase() === author) {
            result[isbn] = books[isbn];
        }
    });
    if (Object.keys(result).length > 0) {
        res.send(JSON.stringify(result, null, 4));
    } else {
        res.status(404).json({ message: "No books found for this author" });
    }
});

// Task 4: Get books by title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    let result = {};
    Object.keys(books).forEach(isbn => {
        if (books[isbn].title.toLowerCase() === title) {
            result[isbn] = books[isbn];
        }
    });
    if (Object.keys(result).length > 0) {
        res.send(JSON.stringify(result, null, 4));
    } else {
        res.status(404).json({ message: "No books found with this title" });
    }
});

// Task 5: Get reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn] && books[isbn].reviews) {
        res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        res.status(404).json({ message: "No reviews found for this book." });
    }
});

// Tasks 10–13: Async-Await Examples using Axios
public_users.get('/async', async (req, res) => {
    try {
        const response = await axios.get("http://localhost:5000/");
        res.send(response.data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports.general = public_users;
