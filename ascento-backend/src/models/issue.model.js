const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  issuedAt: { type: Date, default: Date.now },
  dueAt: { type: Date },
  returnedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Issue', IssueSchema);
