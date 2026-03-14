'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const attendanceService = require('./attendance.service');

const create = asyncHandler(async (req, res) => {
  const { studentId, classId, sectionId, academicYear, date, status } = req.body;

  if (!studentId || !classId || !sectionId || !academicYear || !date || !status) {
    throw new AppError('studentId, classId, sectionId, academicYear, date, and status are required.', 400);
  }

  const attendance = await attendanceService.create(
    { studentId, classId, sectionId, academicYear, date, status },
    req.user._id,
  );

  return new ApiResponse(201, 'Attendance marked successfully', attendance).send(res);
});

const listForAdmin = asyncHandler(async (req, res) => {
  const { page, limit, studentId, classId, sectionId, academicYear, status, date } = req.query;
  const result = await attendanceService.list({
    page,
    limit,
    studentId,
    classId,
    sectionId,
    academicYear,
    status,
    date,
  });

  return new ApiResponse(200, 'Attendance fetched', result).send(res);
});

const listForStudent = asyncHandler(async (req, res) => {
  const { page, limit, classId, sectionId, academicYear, status, date } = req.query;
  const result = await attendanceService.listForStudent(req.user._id, {
    page,
    limit,
    classId,
    sectionId,
    academicYear,
    status,
    date,
  });

  return new ApiResponse(200, 'Attendance fetched', result).send(res);
});

module.exports = { create, listForAdmin, listForStudent };