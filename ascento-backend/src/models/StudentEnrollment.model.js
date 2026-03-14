'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const studentEnrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'studentId is required'],
    index: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'classId is required'],
    index: true,
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: [true, 'sectionId is required'],
    index: true,
  },
  academicYear: {
    type: String,
    required: [true, 'academicYear is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
});

studentEnrollmentSchema.plugin(auditFieldsPlugin);
studentEnrollmentSchema.index({ studentId: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.models.StudentEnrollment || mongoose.model('StudentEnrollment', studentEnrollmentSchema);