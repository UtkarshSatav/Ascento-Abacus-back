const mongoose = require('mongoose');

const TeacherProfileSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true, unique: true },
  bio: { type: String, maxlength: 500 },
  profilePicture: { type: String },
  dateOfBirth: { type: Date },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  phone: { type: String },
  email: { type: String, required: true },
  qualifications: [{ type: String }],
  experience: { type: Number },
  specialization: [{ type: String }],
  departments: [{ type: String }],
  classes: [{ type: Number }],
  emergencyContact: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('TeacherProfile', TeacherProfileSchema);
