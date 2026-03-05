const examService = require('../services/exam.service');
const asyncHandler = require('../utils/async-handler');

const createExam = asyncHandler(async (req, res) => {
  const data = await examService.createExam(req.body, req.user);
  res.status(201).json(data);
});

const listExams = asyncHandler(async (req, res) => {
  const data = await examService.listExams(req.query, req.user);
  res.json(data);
});

module.exports = {
  createExam,
  listExams
};
