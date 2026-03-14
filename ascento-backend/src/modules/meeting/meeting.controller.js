'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const meetingService = require('./meeting.service');

const create = asyncHandler(async (req, res) => {
  const {
    title,
    classId,
    sectionId,
    subjectId,
    teacherId,
    meetingLink,
    meetingDate,
    startTime,
    endTime,
    description,
  } = req.body;

  if (!title || !classId || !sectionId || !subjectId || !meetingLink || !meetingDate || !startTime || !endTime) {
    throw new AppError(
      'title, classId, sectionId, subjectId, meetingLink, meetingDate, startTime, and endTime are required.',
      400,
    );
  }

  if (teacherId && String(teacherId) !== String(req.user._id)) {
    throw new AppError('teacherId must match the logged-in teacher.', 400);
  }

  const meeting = await meetingService.create(
    {
      title,
      classId,
      sectionId,
      subjectId,
      meetingLink,
      meetingDate,
      startTime,
      endTime,
      description,
    },
    req.user._id,
  );

  return new ApiResponse(201, 'Meeting created', meeting).send(res);
});

const listForClass = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  if (!classId) {
    throw new AppError('classId is required.', 400);
  }

  const data = await meetingService.listForClass({
    classId,
    requesterRole: req.user.role,
    requesterId: req.user._id,
  });

  return new ApiResponse(200, 'Meetings fetched', data).send(res);
});

const listForTeacher = asyncHandler(async (req, res) => {
  const { classId, sectionId, subjectId } = req.query;
  const data = await meetingService.listForTeacher(req.user._id, { classId, sectionId, subjectId });
  return new ApiResponse(200, 'Meetings fetched', data).send(res);
});

module.exports = {
  create,
  listForClass,
  listForTeacher,
};
