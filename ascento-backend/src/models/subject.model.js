const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema(
  {
    domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true, index: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null }
  },
  {
    timestamps: true,
    collection: 'subjects'
  }
);

SubjectSchema.index({ classId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Subject', SubjectSchema);
