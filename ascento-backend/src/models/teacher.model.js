const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    phone: { type: String, required: true, trim: true, unique: true, index: true },
    domainIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Domain' }],
    subjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    assignedClassIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    experience: { type: Number, default: 0 },
    qualification: { type: String, trim: true },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    collection: 'teachers'
  }
);

TeacherSchema.index({ name: 'text', email: 'text', phone: 'text' });

module.exports = mongoose.model('Teacher', TeacherSchema);
