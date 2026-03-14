'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const attendanceSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: [true, 'date is required'],
    index: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    required: [true, 'status is required'],
  },
});

attendanceSchema.plugin(auditFieldsPlugin);
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);