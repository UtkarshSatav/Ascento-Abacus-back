const mongoose = require('mongoose');

const SubjectWiseSchema = new mongoose.Schema(
  {
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    subjectName: { type: String, required: true, trim: true },
    obtainedMarks: { type: Number, required: true },
    totalMarks: { type: Number, required: true }
  },
  { _id: false }
);

const ResultSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true, index: true },
    subjectWise: [SubjectWiseSchema],
    totalObtained: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    grade: { type: String, required: true },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    publishedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    collection: 'results'
  }
);

ResultSchema.index({ studentId: 1, examId: 1 }, { unique: true });

module.exports = mongoose.model('Result', ResultSchema);
