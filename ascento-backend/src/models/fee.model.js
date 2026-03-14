'use strict';

const mongoose = require('mongoose');
const auditFieldsPlugin = require('./plugins/auditFields.plugin');

const feeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'studentId is required'],
    index: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'classId is required'],
    index: true,
  },
  academicYearId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: [true, 'academicYearId is required'],
    index: true,
  },
  feeType: {
    type: String,
    required: [true, 'feeType is required'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'amount is required'],
    min: [0, 'amount cannot be negative'],
  },
  dueDate: {
    type: Date,
    required: [true, 'dueDate is required'],
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
    index: true,
  },
  paymentDate: {
    type: Date,
    default: null,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'bank_transfer', 'other', null],
    default: null,
    trim: true,
  },
  transactionReference: {
    type: String,
    trim: true,
    default: null,
  },
});

feeSchema.plugin(auditFieldsPlugin);
feeSchema.index(
  { studentId: 1, classId: 1, academicYearId: 1, feeType: 1 },
  { unique: true },
);

module.exports = mongoose.models.Fee || mongoose.model('Fee', feeSchema);
