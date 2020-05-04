const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const {internalServerError} = require("../utils/utils");

const getInitialUserData = (req, res) => {
  const date = new Date();
  const startDate = new Date(date.setDate(date.getDate() - 10));
  const endDate = new Date();
  let {email, user} = req.body;
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
  });
};

const getTransactions = (req, res) => {
  const {user, email, startDate, endDate} = req.body;

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
};

const getCategories = (req, res) => {
  const {email, user} = req.body;
  Category.find({
    user: user._id
  }, function (err, categories) {
    if (!err) {
      res.status(200).json({email, name: user.name, categories});
    } else {
      internalServerError(res, "Unable to get categories");
    }
  });
};

const addTransaction = (req, res) => {
  const {
    user,
    amount,
    date,
    type,
    category,
    description
  } = req.body;

  Transaction.create({
    amount: amount,
    date: new Date(date),
    type: type,
    category: category,
    description: description,
    user: user
  });
  res.sendStatus(200);
};

const addCategory = (req, res) => {
  const {type, name, emoji, user} = req.body;
  Category.create({
    name: name,
    type: type,
    emoji: emoji,
    user: user
  });
  res.sendStatus(200);
};

const updateTransaction = (req, res) => {
  const {
    id,
    amount,
    date,
    type,
    category,
    description
  } = req.body;

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
};

const deleteTransaction = (req, res) => {
  const {id} = req.body;
  Transaction.remove({_id: id}, (err, transaction) => {
    if (err) {
      internalServerError(res, "Unable to remove transactions");
    } else {
      res.sendStatus(200);
    }
  });
};

const deleteCategory = (req, res) => {
  const {id} = req.body;
  Category.remove({_id: id}, (err, category) => {
    if (err) {
      internalServerError(res, "Unable to remove category");
    } else {
      res.sendStatus(200);
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