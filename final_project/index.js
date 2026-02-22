const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const generalRouter = require("./router/general");
const regd_users = require("./router/auth_users").authenticated;

app.use(bodyParser.json());

// Route files
app.use("/", generalRouter);
app.use("/customer/auth", regd_users);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));