const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session middleware for authenticated users
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
  })
);

// JWT session-based authentication
app.use("/customer/auth/*", (req, res, next) => {
  if (req.session.authorization && req.session.authorization.accessToken) {
    try {
      const token = req.session.authorization.accessToken;
      jwt.verify(token, "access_secret_key");
      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid Token" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized: No Token Provided" });
  }
});

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));