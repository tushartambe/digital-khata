const express = require("express");
const mongoose = require('mongoose');
const User = require('./models/User');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const withAuth = require('./middleware');

const {
  deleteTransaction,
  addCategory,
  addTransaction,
  getCategories,
  getInitialUserData,
  getTransactions,
  deleteCategory,
  updateTransaction
} = require("./handlers/handlers");

const {
  authenticate,
  logout,
  extractUserDetails
} = require("./handlers/user");

const {
  internalServerError,
  logger
} = require("./utils/utils");

const app = express();
const port = process.env.PORT || 8080;
const mongo_uri = process.env.MONGODB_URI || 'mongodb://@ds143511.mlab.com:43511/heroku_ttclx5b8';

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

mongoose.connect(mongo_uri, { useNewUrlParser: true }, function (err) {
  if (err) {
    throw err;
  } else {
    console.log(`Successfully connected to ${mongo_uri}`);
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger);

app.post('/api/signup', function (req, res) {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  user.save(function (err) {
    if (err) {
      internalServerError(res, "Error registering new user");
    } else {
      res.status(200).send("Registration successful");
    }
  });
});

app.use(express.static("client/build"));

app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/client/build/index.html");
});

app.post('/api/authenticate', extractUserDetails, authenticate);

app.use(withAuth);
app.use(extractUserDetails);

app.post('/api/add-category', addCategory);
app.post('/api/add-transaction', addTransaction);
app.post("/api/get-initial-data", getInitialUserData);
app.post("/api/get-transactions", getTransactions);
app.post("/api/get-categories", getCategories);
app.post("/api/update-transaction", updateTransaction);
app.post("/api/delete-transaction", deleteTransaction);
app.post("/api/delete-category", deleteCategory);
app.post("/api/logout", logout);
app.get('/checkToken', function (req, res) {
  res.sendStatus(200);
});