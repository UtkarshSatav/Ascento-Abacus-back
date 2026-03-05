const mongoose = require('mongoose');
const { DOMAIN_CODES } = require('../config/constants');

const DomainSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    code: {
      type: String,
      required: true,
      unique: true,
      enum: Object.values(DOMAIN_CODES),
      index: true
    },
    description: { type: String, trim: true }
  },
  {
    timestamps: true,
    collection: 'domains'
  }
);

module.exports = mongoose.model('Domain', DomainSchema);
