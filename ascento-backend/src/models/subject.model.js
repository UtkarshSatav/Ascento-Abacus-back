'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true,
  },
  code: {
    type: String,
    required: [true, 'Subject code is required'],
    trim: true,
    uppercase: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'classId is required'],
    index: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
});

subjectSchema.plugin(auditFieldsPlugin);
subjectSchema.index({ name: 1, classId: 1 }, { unique: true });

module.exports = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);