'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const marksService = require('./marks.service');

const create = asyncHandler(async (req, res) => {
  const { studentId, examId, subjectId, marksObtained, remarks, enteredByTeacherId } = req.body;

  if (!studentId || !examId || !subjectId || marksObtained === undefined) {
    throw new AppError('studentId, examId, subjectId, and marksObtained are required.', 400);
  }

  if (enteredByTeacherId && String(enteredByTeacherId) !== String(req.user._id)) {
    throw new AppError('enteredByTeacherId must match the logged-in teacher.', 400);
  }

  const mark = await marksService.create(
    { studentId, examId, subjectId, marksObtained, remarks },
    req.user._id,
  );

  return new ApiResponse(201, 'Marks created', mark).send(res);
});

const update = asyncHandler(async (req, res) => {
  const mark = await marksService.update(req.params.id, req.body, req.user._id);
  return new ApiResponse(200, 'Marks updated', mark).send(res);
});

const listForTeacherByExam = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  if (!examId) {
    throw new AppError('examId is required.', 400);
  }

  const data = await marksService.listForTeacherByExam(req.user._id, examId);
  return new ApiResponse(200, 'Marks fetched', data).send(res);
});

const listForStudent = asyncHandler(async (req, res) => {
  const { examId, subjectId } = req.query;
  const data = await marksService.listForStudent(req.user._id, { examId, subjectId });
  return new ApiResponse(200, 'Marks fetched', data).send(res);
});

module.exports = {
  create,
  update,
  listForTeacherByExam,
  listForStudent,
};