'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const examService = require('./exam.service');

const create = asyncHandler(async (req, res) => {
  const {
    examName,
    classId,
    academicYearId,
    examStartDate,
    examEndDate,
    description,
    status,
  } = req.body;

  if (!examName || !classId || !academicYearId || !examStartDate || !examEndDate) {
    throw new AppError(
      'examName, classId, academicYearId, examStartDate, and examEndDate are required.',
      400,
    );
  }

  const exam = await examService.create(
    {
      examName,
      classId,
      academicYearId,
      examStartDate,
      examEndDate,
      description,
      status,
    },
    req.user._id,
  );

  return new ApiResponse(201, 'Exam created', exam).send(res);
});

const list = asyncHandler(async (req, res) => {
  const { page, limit, classId, academicYearId, status } = req.query;
  const result = await examService.list({ page, limit, classId, academicYearId, status });
  return new ApiResponse(200, 'Exams fetched', result).send(res);
});

const getById = asyncHandler(async (req, res) => {
  const exam = await examService.getById(req.params.id);
  return new ApiResponse(200, 'Exam fetched', exam).send(res);
});

const update = asyncHandler(async (req, res) => {
  const exam = await examService.update(req.params.id, req.body, req.user._id);
  return new ApiResponse(200, 'Exam updated', exam).send(res);
});

const remove = asyncHandler(async (req, res) => {
  await examService.remove(req.params.id);
  return new ApiResponse(200, 'Exam deleted').send(res);
});

const listByClass = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  const { academicYearId, status } = req.query;

  if (!classId) {
    throw new AppError('classId is required.', 400);
  }

  if (req.user.role === 'teacher') {
    await examService.ensureTeacherCanViewClassExams(req.user._id, classId, academicYearId);
  }

  const exams = await examService.listByClass(classId, { academicYearId, status });
  return new ApiResponse(200, 'Class exams fetched', exams).send(res);
});

const listForStudent = asyncHandler(async (req, res) => {
  const { academicYearId, status } = req.query;
  const exams = await examService.listForStudent(req.user._id, { academicYearId, status });
  return new ApiResponse(200, 'Student exams fetched', exams).send(res);
});

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  listByClass,
  listForStudent,
};