const mongoose = require('mongoose');
const { TEACHER_APPLICATION_STATUS } = require('../config/constants');

const FileSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true },
    publicId: { type: String, trim: true }
  },
  { _id: false }
);

const TeacherApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, required: true, trim: true, index: true },
    qualification: { type: String, trim: true },
    experience: { type: Number, min: 0, default: 0 },
    subjects: [{ type: String, trim: true }],
    domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', default: null, index: true },
    resume: FileSchema,
    profilePhoto: FileSchema,
    status: {
      type: String,
      enum: Object.values(TEACHER_APPLICATION_STATUS),
      default: TEACHER_APPLICATION_STATUS.PENDING,
      index: true
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewRemark: { type: String, trim: true },
    createdTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null }
  },
  {
    timestamps: true,
    collection: 'teacherApplications'
  }
);

TeacherApplicationSchema.index({ email: 1, status: 1 });
TeacherApplicationSchema.index({ phone: 1, status: 1 });

module.exports = mongoose.model('TeacherApplication', TeacherApplicationSchema);
