const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date },
  paid: { type: Boolean, default: false },
  paidAt: { type: Date },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Fee', FeeSchema);
