'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const academicYearSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Academic year name is required'],
    trim: true,
    unique: true,
  },
  startDate: {
    type: Date,
    required: [true, 'startDate is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'endDate is required'],
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
  },
});

academicYearSchema.plugin(auditFieldsPlugin);

module.exports = mongoose.models.AcademicYear || mongoose.model('AcademicYear', academicYearSchema);