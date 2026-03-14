'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const examSubjectService = require('./exam-subject.service');

const create = asyncHandler(async (req, res) => {
  const {
    examId,
    subjectId,
    totalMarks,
    passingMarks,
    examDate,
    startTime,
    endTime,
  } = req.body;

  if (!examId || !subjectId || totalMarks === undefined || passingMarks === undefined || !examDate || !startTime || !endTime) {
    throw new AppError(
      'examId, subjectId, totalMarks, passingMarks, examDate, startTime, and endTime are required.',
      400,
    );
  }

  const examSubject = await examSubjectService.create(
    { examId, subjectId, totalMarks, passingMarks, examDate, startTime, endTime },
    req.user._id,
  );

  return new ApiResponse(201, 'Exam subject created', examSubject).send(res);
});

const listByExam = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  if (!examId) {
    throw new AppError('examId is required.', 400);
  }

  const data = await examSubjectService.listByExam(examId);
  return new ApiResponse(200, 'Exam subjects fetched', data).send(res);
});

const update = asyncHandler(async (req, res) => {
  const examSubject = await examSubjectService.update(req.params.id, req.body, req.user._id);
  return new ApiResponse(200, 'Exam subject updated', examSubject).send(res);
});

const remove = asyncHandler(async (req, res) => {
  await examSubjectService.remove(req.params.id);
  return new ApiResponse(200, 'Exam subject deleted').send(res);
});

module.exports = {
  create,
  listByExam,
  update,
  remove,
};