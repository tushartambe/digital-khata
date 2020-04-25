const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const {internalServerError, invalidUserError} = require("../utils/utils");
const secret = 'mysecretsshhh'; //take it from env

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

const getTransactions = (req, res) => {
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
}

const getCategories = (req, res) => {
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
};

const addTransaction = (req, res) => {
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
};

const addCategory = (req, res) => {
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
};

const updateTransaction = (req, res) => {
  const {
    id,
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
      Transaction.findById(id, (err, transaction) => {
        if (err) {
          internalServerError(res, "Unable to get transactions");
        } else {
          transaction.amount = amount;
          transaction.date = new Date(date);
          transaction.type = type;
          transaction.category = category;
          transaction.description = description;
          transaction.save((err) => {
            if (err) {
              internalServerError(res, "Unable to get transactions");
            } else {
              res.sendStatus(200);
            }
          });
        }
      });
      // res.sendStatus(200);
    }
  });
};

const deleteTransaction = (req, res) => {
  const {email, id} = req.body;

  User.findOne({email}, function (err, user) {
    if (err) {
      internalServerError(res);
    } else if (!user) {
      invalidUserError(res);
    } else {
      Transaction.remove({_id: id}, (err, transaction) => {
        if (err) {
          internalServerError(res, "Unable to remove transactions");
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
};

const deleteCategory = (req, res) => {
  const {email, id} = req.body;

  User.findOne({email}, function (err, user) {
    if (err) {
      internalServerError(res);
    } else if (!user) {
      invalidUserError(res);
    } else {
      Category.remove({_id: id}, (err, category) => {
        if (err) {
          internalServerError(res, "Unable to remove category");
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
};

module.exports = {
  getInitialUserData,
  getTransactions,
  getCategories,
  addTransaction,
  addCategory,
  updateTransaction,
  deleteTransaction,
  deleteCategory
};