'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const enquirySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'fullName is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    lowercase: true,
    trim: true,
    index: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'phoneNumber is required'],
    trim: true,
    index: true,
  },
  classInterested: {
    type: String,
    required: [true, 'classInterested is required'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'message is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'closed'],
    default: 'new',
    index: true,
  },
});

enquirySchema.plugin(auditFieldsPlugin);
enquirySchema.index({ email: 1, phoneNumber: 1, createdAt: -1 });

module.exports = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);
