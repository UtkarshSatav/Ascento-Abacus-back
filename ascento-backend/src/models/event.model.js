'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const eventSchema = new mongoose.Schema({
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
  eventDate: {
    type: Date,
    required: [true, 'eventDate is required'],
    index: true,
  },
  location: {
    type: String,
    trim: true,
    default: '',
  },
  attachments: {
    type: [String],
    default: [],
  },
});

eventSchema.plugin(auditFieldsPlugin);
eventSchema.index({ eventDate: 1, title: 1 });

module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema);
