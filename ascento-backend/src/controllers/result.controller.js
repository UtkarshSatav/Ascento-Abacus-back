const resultService = require('../services/result.service');
const asyncHandler = require('../utils/async-handler');

const generate = asyncHandler(async (req, res) => {
  const examId = req.body.examId || req.query.examId;
  if (!examId) {
    throw { status: 400, message: 'examId is required' };
  }

  const data = await resultService.generateStudentResult(req.params.id, examId, req.user);
  res.status(201).json(data);
});

const studentResults = asyncHandler(async (req, res) => {
  const data = await resultService.resultsByStudent(req.params.id, req.query, req.user);
  res.json(data);
});

const reportCard = asyncHandler(async (req, res) => {
  const examId = req.query.examId || null;
  const data = await resultService.reportCard(req.params.id, examId, req.user);
  res.json(data);
});

module.exports = {
  generate,
  studentResults,
  reportCard
};
