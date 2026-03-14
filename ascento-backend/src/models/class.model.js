'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true,
  },
  domainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Domain',
    required: [true, 'domainId is required'],
    index: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
});

classSchema.plugin(auditFieldsPlugin);
classSchema.index({ name: 1, domainId: 1 }, { unique: true });

module.exports = mongoose.models.Class || mongoose.model('Class', classSchema);