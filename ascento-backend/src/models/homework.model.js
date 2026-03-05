const mongoose = require('mongoose');

const HomeworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  class: { type: Number, required: true },
  section: { type: String },
  dueDate: { type: Date },
  attachments: [{ type: String }],
  submissions: [{ studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, submittedAt: Date, file: String }]
}, { timestamps: true });

module.exports = mongoose.model('Homework', HomeworkSchema);
