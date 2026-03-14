'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Section name is required'],
    trim: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'classId is required'],
    index: true,
  },
});

sectionSchema.plugin(auditFieldsPlugin);
sectionSchema.index({ name: 1, classId: 1 }, { unique: true });

module.exports = mongoose.models.Section || mongoose.model('Section', sectionSchema);