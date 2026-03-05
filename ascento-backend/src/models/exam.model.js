const mongoose = require('mongoose');
const { EXAM_TYPES } = require('../config/constants');

const ExamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    examType: { type: String, required: true, enum: Object.values(EXAM_TYPES), index: true },
    domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true, index: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
    section: { type: String, trim: true },
    examDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null }
  },
  {
    timestamps: true,
    collection: 'exams'
  }
);

ExamSchema.index({ classId: 1, examType: 1, examDate: 1 });

module.exports = mongoose.model('Exam', ExamSchema);
