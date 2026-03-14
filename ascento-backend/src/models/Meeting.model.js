'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'title is required'],
    trim: true,
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
  meetingLink: {
    type: String,
    required: [true, 'meetingLink is required'],
    trim: true,
  },
  meetingDate: {
    type: Date,
    required: [true, 'meetingDate is required'],
    index: true,
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
  description: {
    type: String,
    trim: true,
    default: '',
  },
});

meetingSchema.plugin(auditFieldsPlugin);
meetingSchema.index({ classId: 1, meetingDate: 1, startTime: 1 });

module.exports = mongoose.models.Meeting || mongoose.model('Meeting', meetingSchema);
