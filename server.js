const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Transaction = require('./models/Transaction');
const withAuth = require('./middleware');
const {internalServerError, invalidUserError, logger} = require("./Utils/utils");
const secret = 'mysecretsshhh'; //take it from env

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

// app.use(express.static(path.join(__dirname, 'public')));
//
// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.post('/api/authenticate', function (req, res) {
  const {email, password} = req.body;
  User.findOne({email}, function (err, user) {
    if (err) {
      internalServerError(res, "Unable to find user");
    } else if (!user) {
      invalidUserError(res);
    } else {
      user.isCorrectPassword(password, function (err, same) {
        if (err) {
          internalServerError(res, "Password mis-matched");
        } else if (!same) {
          invalidUserError(res);
        } else {
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

app.post("/api/logout", function (req, res) {
  res.clearCookie("token");
  return res.sendStatus(200);
});

app.post('/api/add-category', function (req, res) {
  const {type, name, emoji, email} = req.body;
  User.findOne({email}, function (err, user) {
    if (err) {
      internalServerError(res);
    } else if (!user) {
      invalidUserError(res);
    } else {
      Category.create({
        name: name,
        type: type,
        emoji: emoji,
        user: user
      });
      res.sendStatus(200);
    }
  });
});

app.post('/api/add-transaction', function (req, res) {
  const {
    email,
    amount,
    date,
    type,
    category,
    description
  } = req.body;

  User.findOne({email}, function (err, user) {
    if (err) {
      internalServerError(res);
    } else if (!user) {
      invalidUserError(res);
    } else {
      Transaction.create({
        amount: amount,
        date: new Date(date),
        type: type,
        category: category,
        description: description,
        user: user
      });
      res.sendStatus(200);
    }
  });
});

const getInitialUserData = (req, res) => {
  const date = new Date();
  const startDate = new Date(date.setDate(date.getDate() - 10));
  const endDate = new Date();
  let {email} = req.body;

  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;

  if (!token) {
    invalidUserError(res);
  } else {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        return invalidUserError(res);
      } else {
        email = decoded.email;
        User.findOne({email}, function (err, user) {
          if (err) {
            internalServerError(res);
          } else if (!user) {
            invalidUserError(res);
          } else {
            Category.find({user: user._id}, function (err, category) {
              if (!err) {
                Transaction.find({
                  user: user._id,
                  date: {$gte: startDate, $lte: endDate}
                }, function (err, transaction) {
                  if (!err) {
                    res.status(200).json({email, name: user.name, transactions: transaction, categories: category});
                  } else {
                    internalServerError(res, "unable to get transactions");
                  }
                })
              } else {
                internalServerError(res, "Unable to get categories");
              }
            })
          }
        });
      }
    });
  }
};

app.post("/api/get-initial-data", function (req, res) {
  getInitialUserData(req, res);
});

app.post("/api/get-transactions", function (req, res) {
  const {email, startDate, endDate} = req.body;
  User.findOne({email}, function (err, user) {
    if (err) {
      internalServerError(res);
    } else if (!user) {
      invalidUserError(res);
    } else {
      Transaction.find({
        user: user._id,
        date: {$gte: startDate, $lte: endDate}
      }, function (err, transactions) {
        if (!err) {
          res.status(200).json({email, name: user.name, transactions: transactions});
        } else {
          internalServerError(res, "Unable to get transactions");
        }
      })
    }
  });
});

app.post("/api/get-categories", function (req, res) {
  const {email} = req.body;
  User.findOne({email}, function (err, user) {
    if (err) {
      internalServerError(res);
    } else if (!user) {
      invalidUserError(res);
    } else {
      Category.find({
        user: user._id
      }, function (err, categories) {
        if (!err) {
          res.status(200).json({email, name: user.name, categories});
        } else {
          internalServerError(res, "Unable to get categories");
        }
      })
    }
  });
});

app.get('/checkToken', withAuth, function (req, res) {
  res.sendStatus(200);
});