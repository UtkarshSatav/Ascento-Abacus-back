'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const timetableSchema = new mongoose.Schema({
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
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'subjectId is required'],
    index: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: [true, 'teacherId is required'],
    index: true,
  },
  academicYearId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: [true, 'academicYearId is required'],
    index: true,
  },
  dayOfWeek: {
    type: String,
    required: [true, 'dayOfWeek is required'],
    trim: true,
    lowercase: true,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  },
  periodNumber: {
    type: Number,
    required: [true, 'periodNumber is required'],
    min: [1, 'periodNumber must be at least 1'],
  },
  startTime: {
    type: String,
    required: [true, 'startTime is required'],
    trim: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'startTime must be in HH:mm format'],
  },
  endTime: {
    type: String,
    required: [true, 'endTime is required'],
    trim: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'endTime must be in HH:mm format'],
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
});

timetableSchema.plugin(auditFieldsPlugin);

timetableSchema.index(
  { classId: 1, sectionId: 1, academicYearId: 1, dayOfWeek: 1, periodNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'active' },
  },
);

timetableSchema.index(
  { teacherId: 1, academicYearId: 1, dayOfWeek: 1, periodNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'active' },
  },
);

module.exports = mongoose.models.Timetable || mongoose.model('Timetable', timetableSchema);