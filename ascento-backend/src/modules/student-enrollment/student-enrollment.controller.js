'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const studentEnrollmentService = require('./student-enrollment.service');

const create = asyncHandler(async (req, res) => {
  const { studentId, classId, sectionId, academicYear, status } = req.body;

  if (!studentId || !classId || !sectionId || !academicYear) {
    throw new AppError('studentId, classId, sectionId, and academicYear are required.', 400);
  }

  const enrollment = await studentEnrollmentService.create(
    { studentId, classId, sectionId, academicYear, status },
    req.user._id,
  );

  return new ApiResponse(201, 'Student enrolled successfully', enrollment).send(res);
});

const promote = asyncHandler(async (req, res) => {
  const { studentId, fromClassId, toClassId, fromSectionId, toSectionId, newAcademicYear } = req.body;

  if (!studentId || !fromClassId || !toClassId || !fromSectionId || !toSectionId || !newAcademicYear) {
    throw new AppError(
      'studentId, fromClassId, toClassId, fromSectionId, toSectionId, and newAcademicYear are required.',
      400,
    );
  }

  const enrollment = await studentEnrollmentService.promote(
    { studentId, fromClassId, toClassId, fromSectionId, toSectionId, newAcademicYear },
    req.user._id,
  );

  return new ApiResponse(201, 'Student promoted successfully', enrollment).send(res);
});

const list = asyncHandler(async (req, res) => {
  const { page, limit, studentId, academicYear, status } = req.query;
  const result = await studentEnrollmentService.list({
    page,
    limit,
    studentId,
    academicYear,
    status,
  });

  return new ApiResponse(200, 'Enrollments fetched', result).send(res);
});

const getCurrentClass = asyncHandler(async (req, res) => {
  const enrollment = await studentEnrollmentService.getCurrentClass(req.user._id);
  return new ApiResponse(200, 'Current class fetched', enrollment).send(res);
});

module.exports = { create, promote, list, getCurrentClass };