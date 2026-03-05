const attendanceService = require('../services/attendance.service');
const asyncHandler = require('../utils/async-handler');

const markAttendance = asyncHandler(async (req, res) => {
  const data = await attendanceService.markAttendance(req.body, req.user);
  res.status(201).json(data);
});

const classAttendance = asyncHandler(async (req, res) => {
  const data = await attendanceService.classAttendance(req.params.id, req.query, req.user);
  res.json(data);
});

const studentAttendance = asyncHandler(async (req, res) => {
  const data = await attendanceService.studentAttendance(req.params.id, req.query, req.user);
  res.json(data);
});

module.exports = {
  markAttendance,
  classAttendance,
  studentAttendance
};
