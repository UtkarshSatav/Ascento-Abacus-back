const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema(
  {
    domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true, index: true },
    className: { type: String, required: true, trim: true },
    standardNumber: { type: Number, min: 1, max: 12, default: null },
    section: { type: String, trim: true, default: 'A' },
    homeroomTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null }
  },
  {
    timestamps: true,
    collection: 'classes'
  }
);

ClassSchema.index({ domainId: 1, className: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Class', ClassSchema);
