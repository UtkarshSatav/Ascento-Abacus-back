'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const teacherAssignmentService = require('./teacher-assignment.service');

const create = asyncHandler(async (req, res) => {
  const { teacherId, classId, sectionId, subjectId, academicYear, status } = req.body;

  if (!teacherId || !classId || !sectionId || !subjectId || !academicYear) {
    throw new AppError('teacherId, classId, sectionId, subjectId, and academicYear are required.', 400);
  }

  const assignment = await teacherAssignmentService.create(
    { teacherId, classId, sectionId, subjectId, academicYear, status },
    req.user._id,
  );

  return new ApiResponse(201, 'Teacher assigned successfully', assignment).send(res);
});

const list = asyncHandler(async (req, res) => {
  const { page, limit, teacherId, classId, academicYear, status } = req.query;
  const result = await teacherAssignmentService.list({
    page,
    limit,
    teacherId,
    classId,
    academicYear,
    status,
  });

  return new ApiResponse(200, 'Teacher assignments fetched', result).send(res);
});

const update = asyncHandler(async (req, res) => {
  const assignment = await teacherAssignmentService.update(req.params.id, req.body, req.user._id);
  return new ApiResponse(200, 'Teacher assignment updated', assignment).send(res);
});

const remove = asyncHandler(async (req, res) => {
  await teacherAssignmentService.remove(req.params.id);
  return new ApiResponse(200, 'Teacher assignment deleted').send(res);
});

module.exports = { create, list, update, remove };