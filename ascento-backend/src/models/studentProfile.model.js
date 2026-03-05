const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },
  bio: { type: String, maxlength: 500 },
  profilePicture: { type: String },
  dateOfBirth: { type: Date },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  phone: { type: String },
  email: { type: String },
  achievements: [{ type: String }],
  hobbies: [{ type: String }],
  parentContact: { type: String },
  emergencyContact: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
