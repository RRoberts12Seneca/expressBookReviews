const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("../booksdb");

const regd_users = express.Router();
const users = [];

// Register
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (users.find(u => u.username === username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.json({ message: "User successfully registered. Now you can login." });
});

// Login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, "access", { expiresIn: "1h" });

    req.session.authorization = {
        accessToken: token,
        username: username
    };

    return res.json({ message: "Login successful!" });
});

// Add or update review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    books[isbn].reviews[username] = review;

    return res.json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});

// Delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!books[isbn] || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    delete books[isbn].reviews[username];

    return res.json({
        message: `Review for ISBN ${isbn} deleted`
    });
});

module.exports = { authenticated: regd_users, users };
