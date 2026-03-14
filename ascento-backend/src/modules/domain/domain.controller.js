'use strict';

const domainService = require('./domain.service');
const ApiResponse = require('../../core/ApiResponse');
const asyncHandler = require('../../core/asyncHandler');
const AppError = require('../../core/AppError');

// POST /api/admin/domains
const create = asyncHandler(async (req, res) => {
  const { name, code, description, status } = req.body;
  if (!name || !code) throw new AppError('name and code are required.', 400);

  const domain = await domainService.create(
    { name, code, description, status },
    req.user._id,
  );
  return new ApiResponse(201, 'Domain created', domain).send(res);
});

// GET /api/admin/domains
const list = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const result = await domainService.list({ page, limit, status });
  return new ApiResponse(200, 'Domains fetched', result).send(res);
});

// GET /api/admin/domains/:id
const getById = asyncHandler(async (req, res) => {
  const domain = await domainService.getById(req.params.id);
  return new ApiResponse(200, 'Domain fetched', domain).send(res);
});

// PUT /api/admin/domains/:id
const update = asyncHandler(async (req, res) => {
  const { name, code, description, status } = req.body;
  const domain = await domainService.update(
    req.params.id,
    { name, code, description, status },
    req.user._id,
  );
  return new ApiResponse(200, 'Domain updated', domain).send(res);
});

// DELETE /api/admin/domains/:id
const remove = asyncHandler(async (req, res) => {
  await domainService.remove(req.params.id);
  return new ApiResponse(200, 'Domain deleted').send(res);
});

module.exports = { create, list, getById, update, remove };
