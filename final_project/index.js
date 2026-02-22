const express = require("express");
const session = require("express-session");
const jwt = require("jsonwebtoken");

const generalRouter = require("./router/general");
const regd_users = require("./router/auth_users").authenticated;

const app = express();

app.use(express.json());

// Session middleware
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

// JWT Authentication Middleware
app.use("/customer/auth/*", function (req, res, next) {
  if (req.session.authorization) {
    let token = req.session.authorization.accessToken;

    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

// Routes
app.use("/", generalRouter);
app.use("/customer", regd_users);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
