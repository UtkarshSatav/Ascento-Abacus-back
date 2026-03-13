const mongoose = require('mongoose');

const DomainSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    code: {
      type: String,
      required: true,
      unique: true,
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
