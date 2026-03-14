'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const subjectService = require('./subject.service');

const create = asyncHandler(async (req, res) => {
  const { name, code, classId, description } = req.body;

  if (!name || !code || !classId) {
    throw new AppError('name, code, and classId are required.', 400);
  }

  const subject = await subjectService.create(
    { name, code, classId, description },
    req.user._id,
  );

  return new ApiResponse(201, 'Subject created', subject).send(res);
});

const list = asyncHandler(async (req, res) => {
  const { page, limit, classId } = req.query;
  const result = await subjectService.list({ page, limit, classId });
  return new ApiResponse(200, 'Subjects fetched', result).send(res);
});

const getById = asyncHandler(async (req, res) => {
  const subject = await subjectService.getById(req.params.id);
  return new ApiResponse(200, 'Subject fetched', subject).send(res);
});

const update = asyncHandler(async (req, res) => {
  const { name, code, classId, description } = req.body;
  const subject = await subjectService.update(
    req.params.id,
    { name, code, classId, description },
    req.user._id,
  );

  return new ApiResponse(200, 'Subject updated', subject).send(res);
});

const remove = asyncHandler(async (req, res) => {
  await subjectService.remove(req.params.id);
  return new ApiResponse(200, 'Subject deleted').send(res);
});

module.exports = { create, list, getById, update, remove };