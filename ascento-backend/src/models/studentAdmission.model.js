const mongoose = require('mongoose');
const { STUDENT_APPLICATION_STATUS } = require('../config/constants');

const FileSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true },
    publicId: { type: String, trim: true }
  },
  { _id: false }
);

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

const StudentAdmissionSchema = new mongoose.Schema(
  {
    applicationCode: { type: String, required: true, trim: true, unique: true, index: true },
    studentFullName: { type: String, required: true, trim: true, index: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    academicYear: { type: String, trim: true },
    bloodGroup: { type: String, trim: true },
    domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true, index: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', default: null, index: true },
    parentName: { type: String, required: true, trim: true },
    guardianRelation: { type: String, trim: true },
    parentPhone: { type: String, required: true, trim: true, index: true },
    alternatePhone: { type: String, trim: true },
    parentEmail: { type: String, trim: true, lowercase: true, index: true },
    occupation: { type: String, trim: true },
    annualIncome: { type: Number, min: 0, default: null },
    address: { type: String, trim: true },
    previousSchool: { type: String, trim: true },
    previousMarks: [PreviousMarkSchema],
    documents: [DocumentSchema],
    profilePhoto: FileSchema,
    medicalNotes: { type: String, trim: true },
    note: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(STUDENT_APPLICATION_STATUS),
      default: STUDENT_APPLICATION_STATUS.PENDING,
      index: true
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewRemark: { type: String, trim: true },
    createdStudentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
    approvedClassId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', default: null },
    approvedRollNumber: { type: String, trim: true }
  },
  {
    timestamps: true,
    collection: 'studentAdmissions'
  }
);

StudentAdmissionSchema.index({ parentPhone: 1, studentFullName: 1, status: 1 });
StudentAdmissionSchema.index({ parentEmail: 1, studentFullName: 1, status: 1 });

module.exports = mongoose.model('StudentAdmission', StudentAdmissionSchema);
