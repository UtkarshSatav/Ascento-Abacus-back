'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const teacherAssignmentSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: [true, 'teacherId is required'],
    index: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'classId is required'],
    index: true,
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: [true, 'sectionId is required'],
    index: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'subjectId is required'],
    index: true,
  },
  academicYear: {
    type: String,
    required: [true, 'academicYear is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
});

teacherAssignmentSchema.plugin(auditFieldsPlugin);
teacherAssignmentSchema.index(
  { teacherId: 1, classId: 1, sectionId: 1, subjectId: 1, academicYear: 1 },
  { unique: true },
);

module.exports = mongoose.models.TeacherAssignment || mongoose.model('TeacherAssignment', teacherAssignmentSchema);