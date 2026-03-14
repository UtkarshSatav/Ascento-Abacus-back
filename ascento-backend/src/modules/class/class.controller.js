'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const classService = require('./class.service');

const create = asyncHandler(async (req, res) => {
  const { name, domainId, description } = req.body;

  if (!name || !domainId) {
    throw new AppError('name and domainId are required.', 400);
  }

  const classItem = await classService.create(
    { name, domainId, description },
    req.user._id,
  );

  return new ApiResponse(201, 'Class created', classItem).send(res);
});

const list = asyncHandler(async (req, res) => {
  const { page, limit, domainId } = req.query;
  const result = await classService.list({ page, limit, domainId });
  return new ApiResponse(200, 'Classes fetched', result).send(res);
});

const getById = asyncHandler(async (req, res) => {
  const classItem = await classService.getById(req.params.id);
  return new ApiResponse(200, 'Class fetched', classItem).send(res);
});

const update = asyncHandler(async (req, res) => {
  const { name, domainId, description } = req.body;
  const classItem = await classService.update(
    req.params.id,
    { name, domainId, description },
    req.user._id,
  );

  return new ApiResponse(200, 'Class updated', classItem).send(res);
});

const remove = asyncHandler(async (req, res) => {
  await classService.remove(req.params.id);
  return new ApiResponse(200, 'Class deleted').send(res);
});

module.exports = { create, list, getById, update, remove };