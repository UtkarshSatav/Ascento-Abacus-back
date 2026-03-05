const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  isbn: { type: String, index: true },
  copies: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
