'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const sectionService = require('./section.service');

const create = asyncHandler(async (req, res) => {
  const { name, classId } = req.body;

  if (!name || !classId) {
    throw new AppError('name and classId are required.', 400);
  }

  const section = await sectionService.create({ name, classId }, req.user._id);
  return new ApiResponse(201, 'Section created', section).send(res);
});

const list = asyncHandler(async (req, res) => {
  const { page, limit, classId } = req.query;
  const result = await sectionService.list({ page, limit, classId });
  return new ApiResponse(200, 'Sections fetched', result).send(res);
});

const update = asyncHandler(async (req, res) => {
  const { name, classId } = req.body;
  const section = await sectionService.update(
    req.params.id,
    { name, classId },
    req.user._id,
  );

  return new ApiResponse(200, 'Section updated', section).send(res);
});

const remove = asyncHandler(async (req, res) => {
  await sectionService.remove(req.params.id);
  return new ApiResponse(200, 'Section deleted').send(res);
});

module.exports = { create, list, update, remove };