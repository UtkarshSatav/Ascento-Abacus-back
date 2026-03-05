const teacherService = require('../services/teacher.service');
const attendanceService = require('../services/attendance.service');
const markService = require('../services/mark.service');
const assignmentService = require('../services/assignment.service');
const contentService = require('../services/content.service');
const onlineClassService = require('../services/onlineClass.service');
const asyncHandler = require('../utils/async-handler');

const classes = asyncHandler(async (req, res) => {
  const data = await teacherService.getTeacherClasses(req.user);
  res.json(data);
});

const students = asyncHandler(async (req, res) => {
  const data = await teacherService.getTeacherStudents(req.user, req.query);
  res.json(data);
});

const attendance = asyncHandler(async (req, res) => {
  const data = await attendanceService.markAttendance(req.body, req.user);
  res.status(201).json(data);
});

const marks = asyncHandler(async (req, res) => {
  const data = await markService.createOrUpdateMark(req.body, req.user);
  res.status(201).json(data);
});

const assignment = asyncHandler(async (req, res) => {
  const data = await assignmentService.createAssignment(req.body, req.user);
  res.status(201).json(data);
});

const announcement = asyncHandler(async (req, res) => {
  const data = await contentService.publishAnnouncement(req.body, req.user);
  res.status(201).json(data);
});

const publishContent = asyncHandler(async (req, res) => {
  const data = await contentService.publishContent(req.body, req.user);
  res.status(201).json(data);
});

const scheduleClass = asyncHandler(async (req, res) => {
  const data = await onlineClassService.scheduleClass(req.body, req.user);
  res.status(201).json(data);
});

module.exports = {
  classes,
  students,
  attendance,
  marks,
  assignment,
  announcement,
  publishContent,
  scheduleClass
};
