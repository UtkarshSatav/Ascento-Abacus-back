const mongoose = require('mongoose');

const AssignmentAttachmentSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    url: { type: String, trim: true },
    publicId: { type: String, trim: true }
  },
  { _id: false }
);

const AssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true, index: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true, index: true },
    dueDate: { type: Date, required: true },
    attachments: [AssignmentAttachmentSchema]
  },
  {
    timestamps: true,
    collection: 'assignments'
  }
);

module.exports = mongoose.model('Assignment', AssignmentSchema);
