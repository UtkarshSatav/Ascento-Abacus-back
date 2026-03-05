const mongoose = require('mongoose');

const StudentBulkDataSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: String },
  marks: { type: Number },
  attendance: { type: Number },
  feedback: { type: String },
  assignmentStatus: { type: String, enum: ['pending', 'submitted', 'graded'] },
  performanceRating: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model('StudentBulkData', StudentBulkDataSchema);
