'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const examSubjectSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'examId is required'],
    index: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'subjectId is required'],
    index: true,
  },
  totalMarks: {
    type: Number,
    required: [true, 'totalMarks is required'],
    min: [1, 'totalMarks must be at least 1'],
  },
  passingMarks: {
    type: Number,
    required: [true, 'passingMarks is required'],
    min: [0, 'passingMarks cannot be negative'],
  },
  examDate: {
    type: Date,
    required: [true, 'examDate is required'],
  },
  startTime: {
    type: String,
    required: [true, 'startTime is required'],
    trim: true,
  },
  endTime: {
    type: String,
    required: [true, 'endTime is required'],
    trim: true,
  },
});

examSubjectSchema.plugin(auditFieldsPlugin);
examSubjectSchema.index({ examId: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.models.ExamSubject || mongoose.model('ExamSubject', examSubjectSchema);