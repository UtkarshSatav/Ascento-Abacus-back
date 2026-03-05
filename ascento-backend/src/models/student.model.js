const mongoose = require('mongoose');

const PreviousMarkSchema = new mongoose.Schema(
  {
    examName: { type: String, trim: true },
    percentage: { type: Number },
    year: { type: Number }
  },
  { _id: false }
);

const DocumentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true }
  },
  { _id: false }
);

const StudentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent', required: true, index: true },
    fullName: { type: String, required: true, trim: true, index: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true, index: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
    className: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true, unique: true, index: true },
    parentName: { type: String, required: true, trim: true },
    parentPhone: { type: String, required: true, trim: true, index: true },
    parentEmail: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
    admissionDate: { type: Date, default: Date.now },
    previousSchool: { type: String, trim: true },
    previousMarks: [PreviousMarkSchema],
    documents: [DocumentSchema],
    profilePhoto: { type: String, trim: true },
    improvementNotes: { type: String, trim: true }
  },
  {
    timestamps: true,
    collection: 'students'
  }
);

StudentSchema.index({ fullName: 'text', rollNumber: 'text', parentName: 'text' });
StudentSchema.index({ domainId: 1, classId: 1, section: 1 });

module.exports = mongoose.model('Student', StudentSchema);
