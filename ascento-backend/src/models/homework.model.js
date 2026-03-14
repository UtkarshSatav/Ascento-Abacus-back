'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const homeworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
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
  dueDate: {
    type: Date,
    required: [true, 'dueDate is required'],
    index: true,
  },
  attachments: {
    type: [String],
    default: [],
  },
});

homeworkSchema.plugin(auditFieldsPlugin);
homeworkSchema.index({ classId: 1, sectionId: 1, dueDate: 1 });

module.exports = mongoose.models.Homework || mongoose.model('Homework', homeworkSchema);