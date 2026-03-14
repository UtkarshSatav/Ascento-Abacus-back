'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const academicYearService = require('./academic-year.service');

const create = asyncHandler(async (req, res) => {
  const { name, startDate, endDate, status } = req.body;

  if (!name || !startDate || !endDate) {
    throw new AppError('name, startDate, and endDate are required.', 400);
  }

  const academicYear = await academicYearService.create(
    { name, startDate, endDate, status },
    req.user._id,
  );

  return new ApiResponse(201, 'Academic year created', academicYear).send(res);
});

const list = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const result = await academicYearService.list({ page, limit, status });
  return new ApiResponse(200, 'Academic years fetched', result).send(res);
});

const getById = asyncHandler(async (req, res) => {
  const academicYear = await academicYearService.getById(req.params.id);
  return new ApiResponse(200, 'Academic year fetched', academicYear).send(res);
});

const getActive = asyncHandler(async (req, res) => {
  const activeAcademicYear = await academicYearService.getActive();
  return new ApiResponse(200, 'Active academic year fetched', activeAcademicYear).send(res);
});

const update = asyncHandler(async (req, res) => {
  const { name, startDate, endDate, status } = req.body;
  const academicYear = await academicYearService.update(
    req.params.id,
    { name, startDate, endDate, status },
    req.user._id,
  );

  return new ApiResponse(200, 'Academic year updated', academicYear).send(res);
});

const remove = asyncHandler(async (req, res) => {
  await academicYearService.remove(req.params.id);
  return new ApiResponse(200, 'Academic year deleted').send(res);
});

module.exports = { create, list, getById, getActive, update, remove };