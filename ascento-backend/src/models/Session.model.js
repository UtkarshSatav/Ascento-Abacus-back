'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

/**
 * Session / SessionKey document.
 *
 * One session document is created per login.
 * Setting isActive = false invalidates the session (logout / forced revocation).
 * expiresAt mirrors the refresh-token lifetime so the DB can be pruned.
 */
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'userModel',
    index: true,
  },
  userModel: {
    type: String,
    required: true,
    enum: ['Admin', 'Teacher', 'Student', 'Parent'],
  },
  sessionKey: {
    type: String,
    required: true,
    unique: true,   // unique already creates an index
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'teacher', 'student', 'parent'],
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    // index declared below as TTL index — do not add index:true here too
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
});

sessionSchema.plugin(auditFieldsPlugin);

// Auto-remove expired sessions from the collection (MongoDB TTL index)
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Session', sessionSchema);
