const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  amount: {type: Number, required: true},
  date: {type: Date, required: true},
  type: {type: String, required: true},
  category: {type: String, required: true},
  description: {type: String},
  createdAt: {type: Date}
});

module.exports = mongoose.model('Transaction', TransactionSchema)