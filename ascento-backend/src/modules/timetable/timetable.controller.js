'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const timetableService = require('./timetable.service');

const create = asyncHandler(async (req, res) => {
  const {
    classId,
    sectionId,
    subjectId,
    teacherId,
    academicYearId,
    dayOfWeek,
    periodNumber,
    startTime,
    endTime,
    status,
  } = req.body;

  if (!classId || !sectionId || !subjectId || !teacherId || !academicYearId || !dayOfWeek || !periodNumber || !startTime || !endTime) {
    throw new AppError(
      'classId, sectionId, subjectId, teacherId, academicYearId, dayOfWeek, periodNumber, startTime, and endTime are required.',
      400,
    );
  }

  const timetable = await timetableService.create(
    {
      classId,
      sectionId,
      subjectId,
      teacherId,
      academicYearId,
      dayOfWeek,
      periodNumber,
      startTime,
      endTime,
      status,
    },
    req.user._id,
  );

  return new ApiResponse(201, 'Timetable entry created', timetable).send(res);
});

const update = asyncHandler(async (req, res) => {
  const timetable = await timetableService.update(req.params.id, req.body, req.user._id);
  return new ApiResponse(200, 'Timetable entry updated', timetable).send(res);
});

const remove = asyncHandler(async (req, res) => {
  await timetableService.remove(req.params.id);
  return new ApiResponse(200, 'Timetable entry deleted').send(res);
});

const listForClass = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  if (!classId) {
    throw new AppError('classId is required.', 400);
  }

  const { sectionId, academicYearId, status } = req.query;
  const data = await timetableService.listForClass(classId, { sectionId, academicYearId, status });

  return new ApiResponse(200, 'Class timetable fetched', data).send(res);
});

const listForTeacher = asyncHandler(async (req, res) => {
  const { academicYearId, status, dayOfWeek } = req.query;
  const data = await timetableService.listForTeacher(req.user._id, { academicYearId, status, dayOfWeek });
  return new ApiResponse(200, 'Teacher timetable fetched', data).send(res);
});

const listForStudent = asyncHandler(async (req, res) => {
  const { academicYearId, status, dayOfWeek } = req.query;
  const data = await timetableService.listForStudent(req.user._id, { academicYearId, status, dayOfWeek });
  return new ApiResponse(200, 'Student timetable fetched', data).send(res);
});

module.exports = {
  create,
  update,
  remove,
  listForClass,
  listForTeacher,
  listForStudent,
};