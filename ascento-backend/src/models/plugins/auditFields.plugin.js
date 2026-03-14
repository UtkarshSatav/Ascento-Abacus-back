'use strict';

const mongoose = require('mongoose');

/**
 * Mongoose plugin — adds audit fields to every schema that uses it.
 *
 * Adds:
 *   createdBy  {ObjectId|null}  — user who created the document
 *   updatedBy  {ObjectId|null}  — user who last modified the document
 *
 * Also enables automatic `createdAt` / `updatedAt` timestamps.
 *
 * Usage:
 *   schema.plugin(auditFieldsPlugin);
 */
const auditFieldsPlugin = (schema) => {
  schema.add({
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  });

  // Enable Mongoose-managed createdAt + updatedAt
  schema.set('timestamps', true);
};

module.exports = auditFieldsPlugin;
