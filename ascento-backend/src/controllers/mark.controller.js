const markService = require('../services/mark.service');
const asyncHandler = require('../utils/async-handler');

const createMark = asyncHandler(async (req, res) => {
  const data = await markService.createOrUpdateMark(req.body, req.user);
  res.status(201).json(data);
});

const studentMarks = asyncHandler(async (req, res) => {
  const data = await markService.marksByStudent(req.params.id, req.query, req.user);
  res.json(data);
});

const examMarks = asyncHandler(async (req, res) => {
  const data = await markService.marksByExam(req.params.id, req.query, req.user);
  res.json(data);
});

module.exports = {
  createMark,
  studentMarks,
  examMarks
};
