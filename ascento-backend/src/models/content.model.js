const mongoose = require('mongoose');
const { CONTENT_TYPES } = require('../config/constants');

const FileSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true },
    publicId: { type: String, trim: true }
  },
  { _id: false }
);

const ContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    contentType: { type: String, enum: Object.values(CONTENT_TYPES), required: true, index: true },
    domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true, index: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null, index: true },
    file: FileSchema,
    videoLink: { type: String, trim: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true, index: true },
    isPublished: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    collection: 'contents'
  }
);

ContentSchema.index({ domainId: 1, classId: 1, contentType: 1, createdAt: -1 });

module.exports = mongoose.model('Content', ContentSchema);
