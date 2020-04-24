const {addCategory, addTransaction, getCategories, getInitialUserData, getTransactions} = require("./handlers/handlers");
const {authenticate, logout} = require("./handlers/user");

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require('mongoose');
const User = require('./models/User');
const withAuth = require('./middleware');
const {internalServerError, logger} = require("./utils/utils");

const app = express();
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger);

const mongo_uri = process.env.MONGODB_URI || 'mongodb://@ds143511.mlab.com:43511/heroku_ttclx5b8';
mongoose.connect(mongo_uri, {useNewUrlParser: true}, function (err) {
  if (err) {
    throw err;
  } else {
    console.log(`Successfully connected to ${mongo_uri}`);
  }
});

app.post('/api/signup', function (req, res) {
  const {name, email, password} = req.body;
  const user = new User({name, email, password});
  user.save(function (err) {
    if (err) {
      internalServerError(res, "Error registering new user");
    } else {
      res.status(200).send("Registration successful");
    }
  });
});

app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/client/build/index.html");
});

app.post('/api/authenticate', authenticate);

app.post('/api/add-category', addCategory);
app.post('/api/add-transaction', addTransaction);
app.post("/api/get-initial-data", getInitialUserData);
app.post("/api/get-transactions", getTransactions);
app.post("/api/get-categories", getCategories);

app.post("/api/logout", logout);

app.get('/checkToken', withAuth, function (req, res) {
  res.sendStatus(200);
});