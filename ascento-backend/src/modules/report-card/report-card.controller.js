'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const reportCardService = require('./report-card.service');

const getForStudent = asyncHandler(async (req, res) => {
  const reportCard = await reportCardService.getStudentReportCard({
    studentId: req.user._id,
    examId: req.query.examId,
  });

  return new ApiResponse(200, 'Student report card fetched', reportCard).send(res);
});

const getForAdminByStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  if (!studentId) {
    throw new AppError('studentId is required.', 400);
  }

  const reportCard = await reportCardService.getStudentReportCard({
    studentId,
    examId: req.query.examId,
  });

  return new ApiResponse(200, 'Student report card fetched', reportCard).send(res);
});

const getForClass = asyncHandler(async (req, res) => {
  const { classId } = req.params;

  if (!classId) {
    throw new AppError('classId is required.', 400);
  }

  const reportCards = await reportCardService.getClassReportCards({
    classId,
    examId: req.query.examId,
  });

  return new ApiResponse(200, 'Class report cards fetched', reportCards).send(res);
});

module.exports = {
  getForStudent,
  getForAdminByStudent,
  getForClass,
};
