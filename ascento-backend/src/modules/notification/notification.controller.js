'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const notificationService = require('./notification.service');

const create = asyncHandler(async (req, res) => {
  const { title, message, targetType, targetId, createdBy, status } = req.body;

  if (!title || !message || !targetType) {
    throw new AppError('title, message, and targetType are required.', 400);
  }

  if (createdBy && String(createdBy) !== String(req.user._id)) {
    throw new AppError('createdBy must match the logged-in admin.', 400);
  }

  const notification = await notificationService.create(
    {
      title,
      message,
      targetType,
      targetId,
      status,
    },
    req.user._id,
  );

  return new ApiResponse(201, 'Notification created', notification).send(res);
});

const listForUser = asyncHandler(async (req, res) => {
  const { status, targetType } = req.query;
  const data = await notificationService.listForUser(req.user, { status, targetType });
  return new ApiResponse(200, 'Notifications fetched', data).send(res);
});

module.exports = {
  create,
  listForUser,
};
