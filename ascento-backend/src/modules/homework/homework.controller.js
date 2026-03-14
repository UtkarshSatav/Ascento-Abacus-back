'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const homeworkService = require('./homework.service');

const create = asyncHandler(async (req, res) => {
  const { title, description, classId, sectionId, subjectId, teacherId, dueDate, attachments } = req.body;

  if (!title || !classId || !sectionId || !subjectId || !dueDate) {
    throw new AppError('title, classId, sectionId, subjectId, and dueDate are required.', 400);
  }

  if (teacherId && String(teacherId) !== String(req.user._id)) {
    throw new AppError('teacherId must match the logged-in teacher.', 400);
  }

  const homework = await homeworkService.create(
    { title, description, classId, sectionId, subjectId, dueDate, attachments },
    req.user._id,
  );

  return new ApiResponse(201, 'Homework created', homework).send(res);
});

const listForStudent = asyncHandler(async (req, res) => {
  const { page, limit, subjectId } = req.query;
  const result = await homeworkService.listForStudent(req.user._id, {
    page,
    limit,
    subjectId,
  });

  return new ApiResponse(200, 'Homework fetched', result).send(res);
});

module.exports = { create, listForStudent };