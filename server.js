const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');

const withAuth = require('./middleware');
const secret = 'mysecretsshhh'; //take it from env

const app = express();
const port = 8080;

const logger = function (req, res, next) {
  console.log("URL:", req.url);
  console.log("Method:", req.method);
  console.log("Body:", req.body);
  console.log("Cookie:", req.cookies);
  console.log("-------------------------------------------------------------");
  next();
};

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger);

const mongo_uri = 'mongodb://localhost/digi-khata';
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
      console.log(err);
      res.status(500).send("Error registering new user please try again.");
    } else {
      res.status(200).send("Registration successful");
    }
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/authenticate', function (req, res) {
  const {email, password} = req.body;
  User.findOne({email}, function (err, user) {
    if (err) {
      console.error(err);
      res.status(500)
        .json({
          error: 'Internal error please try again'
        });
    } else if (!user) {
      res.status(401)
        .json({
          error: 'Incorrect email or password'
        });
    } else {
      user.isCorrectPassword(password, function (err, same) {
        if (err) {
          res.status(500)
            .json({
              error: 'Internal error please try again'
            });
        } else if (!same) {
          res.status(401)
            .json({
              error: 'Incorrect email or password'
            });
        } else {
          // Issue token
          const payload = {email};
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          res.status(200).cookie('token', token, {httpOnly: true}).json({name: "Tushar"});
        }
      });
    }
  });
});

app.get('/checkToken', withAuth, function (req, res) {
  res.sendStatus(200);
});