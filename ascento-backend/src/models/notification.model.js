'use strict';

const mongoose = require('mongoose');
const { randomUUID } = require('crypto');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const notificationSchema = new mongoose.Schema({
  notificationId: {
    type: String,
    default: () => `NOTIF-${Date.now().toString(36)}-${randomUUID().slice(0, 8)}`,
    unique: true,
    index: true,
    immutable: true,
  },
  title: {
    type: String,
    required: [true, 'title is required'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'message is required'],
    trim: true,
  },
  targetType: {
    type: String,
    enum: ['student', 'teacher', 'class', 'broadcast'],
    required: [true, 'targetType is required'],
    index: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    index: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'createdBy is required'],
    index: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
    index: true,
  },
});

notificationSchema.plugin(auditFieldsPlugin);
notificationSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
