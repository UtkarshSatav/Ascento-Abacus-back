'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const examSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: [true, 'examName is required'],
    trim: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'classId is required'],
    index: true,
  },
  academicYearId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: [true, 'academicYearId is required'],
    index: true,
  },
  examStartDate: {
    type: Date,
    required: [true, 'examStartDate is required'],
  },
  examEndDate: {
    type: Date,
    required: [true, 'examEndDate is required'],
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    trim: true,
    default: 'active',
  },
});

examSchema.plugin(auditFieldsPlugin);
examSchema.index({ classId: 1, academicYearId: 1, examName: 1, examStartDate: 1 }, { unique: true });

module.exports = mongoose.models.Exam || mongoose.model('Exam', examSchema);