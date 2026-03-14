'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const feeService = require('./fee.service');

const create = asyncHandler(async (req, res) => {
  const {
    studentId,
    classId,
    academicYearId,
    feeType,
    amount,
    dueDate,
    paymentStatus,
    paymentDate,
    paymentMethod,
    transactionReference,
  } = req.body;

  if (!studentId || !classId || !academicYearId || !feeType || amount === undefined || !dueDate) {
    throw new AppError(
      'studentId, classId, academicYearId, feeType, amount, and dueDate are required.',
      400,
    );
  }

  const fee = await feeService.create(
    {
      studentId,
      classId,
      academicYearId,
      feeType,
      amount,
      dueDate,
      paymentStatus,
      paymentDate,
      paymentMethod,
      transactionReference,
    },
    req.user._id,
  );

  return new ApiResponse(201, 'Fee created', fee).send(res);
});

const listForAdmin = asyncHandler(async (req, res) => {
  const result = await feeService.listForAdmin(req.query);
  return new ApiResponse(200, 'Fees fetched', result).send(res);
});

const markAsPaid = asyncHandler(async (req, res) => {
  const { feeId, paymentDate, paymentMethod, transactionReference } = req.body;

  if (!feeId) {
    throw new AppError('feeId is required.', 400);
  }

  const fee = await feeService.markAsPaid(
    { feeId, paymentDate, paymentMethod, transactionReference },
    req.user._id,
  );

  return new ApiResponse(200, 'Fee marked as paid', fee).send(res);
});

const listForStudent = asyncHandler(async (req, res) => {
  const { paymentStatus, academicYearId } = req.query;
  const data = await feeService.listForStudent(req.user._id, { paymentStatus, academicYearId });
  return new ApiResponse(200, 'Fees fetched', data).send(res);
});

module.exports = {
  create,
  listForAdmin,
  markAsPaid,
  listForStudent,
};
