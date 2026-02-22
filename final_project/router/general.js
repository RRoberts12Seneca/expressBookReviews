// general.js
// Routes accessible to general users (no authentication required)

const express = require('express');
const axios = require('axios'); // For making async HTTP requests if needed
const books = require('./booksdb.js'); // Preloaded book data

const public_users = express.Router();

// Helper function: simulate async fetch of books
const getBooksAsync = async () => {
    // Normally you would fetch from a database or external API
    return new Promise((resolve, reject) => {
        try {
            resolve(books);
        } catch (err) {
            reject(err);
        }
    });
};

// Route 1: Get all books
public_users.get('/', async (req, res) => {
    try {
        const allBooks = await getBooksAsync();
        res.status(200).json(allBooks);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books", error: error.message });
    }
});

// Route 2: Get book details by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const allBooks = await getBooksAsync();

        if (allBooks[isbn]) {
            res.status(200).json(allBooks[isbn]);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving book", error: error.message });
    }
});

// Route 3: Get books by author
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const allBooks = await getBooksAsync();

        // Filter books by author
        const filteredBooks = Object.keys(allBooks)
            .filter(key => allBooks[key].author === author)
            .reduce((obj, key) => {
                obj[key] = allBooks[key];
                return obj;
            }, {});

        if (Object.keys(filteredBooks).length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            res.status(404).json({ message: "No books found for this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books by author", error: error.message });
    }
});

// Route 4: Get books by title
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const allBooks = await getBooksAsync();

        // Filter books by title
        const filteredBooks = Object.keys(allBooks)
            .filter(key => allBooks[key].title === title)
            .reduce((obj, key) => {
                obj[key] = allBooks[key];
                return obj;
            }, {});

        if (Object.keys(filteredBooks).length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books by title", error: error.message });
    }
});

module.exports.general = public_users;
