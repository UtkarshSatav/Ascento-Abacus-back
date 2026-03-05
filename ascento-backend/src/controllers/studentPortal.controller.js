const contentService = require('../services/content.service');
const onlineClassService = require('../services/onlineClass.service');
const resultService = require('../services/result.service');
const { getStudentByUserId } = require('../services/access.service');
const asyncHandler = require('../utils/async-handler');

const content = asyncHandler(async (req, res) => {
  const data = await contentService.studentContent(req.user, req.query);
  res.json(data);
});

const upcomingClasses = asyncHandler(async (req, res) => {
  const data = await onlineClassService.upcomingForStudent(req.user, req.query);
  res.json(data);
});

const results = asyncHandler(async (req, res) => {
  const student = await getStudentByUserId(req.user.userId);
  if (!student) throw { status: 404, message: 'Student profile not found' };

  const data = await resultService.resultsByStudent(student._id, req.query, req.user);
  res.json(data);
});

module.exports = {
  content,
  upcomingClasses,
  results
};
