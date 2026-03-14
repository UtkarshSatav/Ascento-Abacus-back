'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const markSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'studentId is required'],
    index: true,
  },
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
  marksObtained: {
    type: Number,
    required: [true, 'marksObtained is required'],
    min: [0, 'marksObtained cannot be negative'],
  },
  remarks: {
    type: String,
    trim: true,
    default: '',
  },
  enteredByTeacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: [true, 'enteredByTeacherId is required'],
    index: true,
  },
});

markSchema.plugin(auditFieldsPlugin);
markSchema.index({ studentId: 1, examId: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.models.Mark || mongoose.model('Mark', markSchema);