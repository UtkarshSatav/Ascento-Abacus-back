'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const teacherService = require('./teacher.service');

const create = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    domainId,
    status,
    address,
    city,
    state,
    country,
    dateOfBirth,
    gender,
    qualification,
    experienceYears,
    joiningDate,
    profilePhoto,
  } = req.body;

  if (!name || !email || !phone || !domainId) {
    throw new AppError('name, email, phone, and domainId are required.', 400);
  }

  const result = await teacherService.create(
    {
      name,
      email,
      phone,
      domainId,
      status,
      address,
      city,
      state,
      country,
      dateOfBirth,
      gender,
      qualification,
      experienceYears,
      joiningDate,
      profilePhoto,
    },
    req.user._id,
  );

  return new ApiResponse(201, 'Teacher created', result).send(res);
});

const list = asyncHandler(async (req, res) => {
  const { page, limit, domainId, status } = req.query;
  const result = await teacherService.list({ page, limit, domainId, status });
  return new ApiResponse(200, 'Teachers fetched', result).send(res);
});

const getById = asyncHandler(async (req, res) => {
  const teacher = await teacherService.getById(req.params.id);
  return new ApiResponse(200, 'Teacher fetched', teacher).send(res);
});

const update = asyncHandler(async (req, res) => {
  const teacher = await teacherService.update(req.params.id, req.body, req.user._id);
  return new ApiResponse(200, 'Teacher updated', teacher).send(res);
});

const remove = asyncHandler(async (req, res) => {
  await teacherService.remove(req.params.id);
  return new ApiResponse(200, 'Teacher deleted').send(res);
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const teacher = await teacherService.changePassword(req.user._id, {
    currentPassword,
    newPassword,
  });

  return new ApiResponse(200, 'Password changed successfully', teacher).send(res);
});

module.exports = { create, list, getById, update, remove, changePassword };