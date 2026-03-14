'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const reminderSchema = new mongoose.Schema({
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
  targetType: {
    type: String,
    enum: ['student', 'class', 'teacher'],
    required: [true, 'targetType is required'],
    index: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'targetId is required'],
    index: true,
  },
  reminderDate: {
    type: Date,
    required: [true, 'reminderDate is required'],
    index: true,
  },
});

reminderSchema.plugin(auditFieldsPlugin);
reminderSchema.index({ targetType: 1, targetId: 1, reminderDate: 1 });

module.exports = mongoose.models.Reminder || mongoose.model('Reminder', reminderSchema);
