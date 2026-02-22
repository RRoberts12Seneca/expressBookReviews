const express = require('express');
const jwt = require('jsonwebtoken');

let users = []; // Registered users
let books = require("./booksdb").books;

const regd_users = express.Router();

// Task 6: Register
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.some(u => u.username === username)) {
        return res.status(409).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Task 7: Login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign({ username }, "access_secret_key", { expiresIn: "1h" });
    req.session.authorization = { accessToken, username };
    res.status(200).json({ message: "User logged in successfully", accessToken });
});

// Task 8: Add/Modify review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
    if (!books[isbn].reviews) books[isbn].reviews = {};

    books[isbn].reviews[username] = review;
    res.status(200).json({ message: "Review added/updated", reviews: books[isbn].reviews });
});

// Task 9: Delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!books[isbn] || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review by this user for this book" });
    }

    delete books[isbn].reviews[username];
    res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
