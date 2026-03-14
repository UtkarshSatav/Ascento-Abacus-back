'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const reminderService = require('./reminder.service');

const create = asyncHandler(async (req, res) => {
  const { title, description, targetType, targetId, reminderDate } = req.body;

  if (!title || !targetType || !targetId || !reminderDate) {
    throw new AppError('title, targetType, targetId, and reminderDate are required.', 400);
  }

  const reminder = await reminderService.create(
    { title, description, targetType, targetId, reminderDate },
    req.user._id,
  );

  return new ApiResponse(201, 'Reminder created', reminder).send(res);
});

const listForUser = asyncHandler(async (req, res) => {
  const { targetType, targetId } = req.query;
  const data = await reminderService.listForUser(req.user, { targetType, targetId });
  return new ApiResponse(200, 'Reminders fetched', data).send(res);
});

module.exports = {
  create,
  listForUser,
};
