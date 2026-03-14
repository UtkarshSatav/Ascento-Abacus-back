'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const domainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Domain name is required'],
    trim: true,
  },
  code: {
    type: String,
    required: [true, 'Domain code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
});

domainSchema.plugin(auditFieldsPlugin);

module.exports = mongoose.models.Domain || mongoose.model('Domain', domainSchema);
