'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const eventService = require('./event.service');

const create = asyncHandler(async (req, res) => {
  const { title, description, eventDate, location, attachments } = req.body;

  if (!title || !eventDate) {
    throw new AppError('title and eventDate are required.', 400);
  }

  const event = await eventService.create(
    { title, description, eventDate, location, attachments },
    req.user._id,
  );

  return new ApiResponse(201, 'Event created', event).send(res);
});

const list = asyncHandler(async (req, res) => {
  const { fromDate, toDate } = req.query;
  const data = await eventService.list({ fromDate, toDate });
  return new ApiResponse(200, 'Events fetched', data).send(res);
});

module.exports = {
  create,
  list,
};
