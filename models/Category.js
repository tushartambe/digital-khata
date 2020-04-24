const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  type: {type: String, required: true},
  name: {type: String, required: true},
  emoji: {type: String},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Category', CategorySchema);