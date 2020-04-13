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

const createCategory = function (userId, category) {
  return Category.create(category).then(docImage => {
    return User.findByIdAndUpdate(
      userId,
      {
        $push: {
          categories: {
            _id: docImage._id,
            name: docImage.name,
            type: docImage.type,
            emoji: docImage.emoji,
            createdAt: docImage.createdAt
          }
        }
      },
      {new: true, useFindAndModify: false}
    );
  });
};

app.post('/api/add-category', function (req, res) {
  const {type, name, emoji, email} = req.body;
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
      createCategory(user._id, {
        name: name,
        type: type,
        emoji: emoji,
        createdAt: Date.now()
      });
      res.sendStatus(200);
    }
  });
});

const createTransaction = function (userId, transaction) {
  return Transaction.create(transaction).then(docImage => {
    return User.findByIdAndUpdate(
      userId,
      {
        $push: {
          transactions: {
            _id: docImage._id,
            amount: docImage.amount,
            date: docImage.date,
            type: docImage.type,
            category: docImage.category,
            description: docImage.description,
            createdAt: docImage.createdAt
          }
        }
      },
      {new: true, useFindAndModify: false}
    );
  });
};

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
      createTransaction(user._id, {
        amount: amount,
        date: new Date(date),
        type: type,
        category: category,
        description: description,
        createdAt: Date.now()
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
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
        return;
      } else {
        email = decoded.email;

        User.aggregate([
          {$match: {email: email}},
          {
            "$project": {
              "email": "$email",
              "name": "$name",
              "categories": "$categories",
              "transactions": {
                "$filter": {
                  "input": "$transactions",
                  "as": "transaction",
                  "cond": {
                    "$and": [
                      {"$gte": ["$$transaction.date", startDate]},
                      {"$lte": ["$$transaction.date", endDate]}
                    ]
                  }
                }
              }
            }
          }
        ]).exec((err, data) => {
          if (err) throw err;
          const e = email;
          let name = data[0].name;
          let transactions = data[0].transactions;
          let categories = data[0].categories;
          if (!data[0]) {
            name = "User";
            transactions = [];
            categories = [];
          }
          res.status(200).json({email: e, name: name, transactions: transactions, categories: categories});
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
  User.aggregate([
    {$match: {email: email}},
    {
      "$project": {
        "email": "$email",
        "name": "$name",
        "transactions": {
          "$filter": {
            "input": "$transactions",
            "as": "transaction",
            "cond": {
              "$and": [
                {"$gte": ["$$transaction.date", new Date(startDate)]},
                {"$lte": ["$$transaction.date", new Date(endDate)]}
              ]
            }
          }
        }
      }
    }
  ]).exec((err, data) => {
    if (err) throw err;
    const e = email;
    const name = data[0].name || "User";
    const transactions = data[0].transactions || [];
    res.status(200).json({email: e, name: name, transactions: transactions});
  });
});


app.post("/api/get-categories", function (req, res) {
  const {email} = req.body;
  User.aggregate([
    {$match: {email: email}},
    {
      "$project": {
        "email": "$email",
        "name": "$name",
        "categories": "$categories"
      }
    }
  ]).exec((err, data) => {
    if (err) throw err;
    const e = email;
    const name = data[0].name || "User";
    const categories = data[0].categories || [];
    res.status(200).json({email: e, name: name, categories: categories});
  });
});
app.get('/checkToken', withAuth, function (req, res) {
  res.sendStatus(200);
});