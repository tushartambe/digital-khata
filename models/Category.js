const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  type: {type: String, required: true},
  name: {type: String, required: true},
  emoji: {type: String},
  createdAt: {type: Date}
});

module.exports = mongoose.model('Category', CategorySchema);