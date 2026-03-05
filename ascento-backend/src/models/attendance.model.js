const mongoose = require('mongoose');
const { ATTENDANCE_STATUS } = require('../config/constants');

const AttendanceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, index: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    status: { type: String, enum: Object.values(ATTENDANCE_STATUS), required: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    note: { type: String, trim: true }
  },
  {
    timestamps: true,
    collection: 'attendance'
  }
);

AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ classId: 1, date: 1 });

module.exports = mongoose.model('Attendance', AttendanceSchema);
