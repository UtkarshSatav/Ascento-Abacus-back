const parentService = require('../services/parent.service');
const asyncHandler = require('../utils/async-handler');

const student = asyncHandler(async (req, res) => {
  const data = await parentService.parentStudent(req.user, req.query);
  res.json(data);
});

const attendance = asyncHandler(async (req, res) => {
  const data = await parentService.parentAttendance(req.user, req.query);
  res.json(data);
});

const results = asyncHandler(async (req, res) => {
  const data = await parentService.parentResults(req.user, req.query);
  res.json(data);
});

const upcomingClasses = asyncHandler(async (req, res) => {
  const data = await parentService.parentUpcomingClasses(req.user, req.query);
  res.json(data);
});

const reportCard = asyncHandler(async (req, res) => {
  const data = await parentService.parentReportCard(req.user, req.query);
  res.json(data);
});

module.exports = {
  student,
  attendance,
  results,
  upcomingClasses,
  reportCard
};
