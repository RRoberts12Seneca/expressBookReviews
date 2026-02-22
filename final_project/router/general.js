const express = require("express");
const axios = require("axios"); // Required for async requests
const books = require("./booksdb"); // from router/general.js
const general = express.Router();

// Get all books
general.get("/", (req, res) => {
    res.json(books);
});

// Get book by ISBN
general.get("/isbn/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.json({ [isbn]: books[isbn] });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Get books by author
general.get("/author/:author", async (req, res) => {
    try {
        const author = decodeURIComponent(req.params.author);
        const filtered = {};
        for (const isbn in books) {
            if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
                filtered[isbn] = books[isbn];
            }
        }
        if (Object.keys(filtered).length === 0)
            return res.status(404).json({ message: "Author not found" });
        res.json(filtered);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get books by title
general.get("/title/:title", async (req, res) => {
    try {
        const title = decodeURIComponent(req.params.title);
        const filtered = {};
        for (const isbn in books) {
            if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
                filtered[isbn] = books[isbn];
            }
        }
        if (Object.keys(filtered).length === 0)
            return res.status(404).json({ message: "Title not found" });
        res.json(filtered);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = general;