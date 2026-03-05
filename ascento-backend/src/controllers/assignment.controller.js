const assignmentService = require('../services/assignment.service');
const asyncHandler = require('../utils/async-handler');

const createAssignment = asyncHandler(async (req, res) => {
  const data = await assignmentService.createAssignment(req.body, req.user);
  res.status(201).json(data);
});

const classAssignments = asyncHandler(async (req, res) => {
  const data = await assignmentService.assignmentsByClass(req.params.id, req.query, req.user);
  res.json(data);
});

const studentAssignments = asyncHandler(async (req, res) => {
  const data = await assignmentService.assignmentsByStudent(req.params.id, req.query, req.user);
  res.json(data);
});

module.exports = {
  createAssignment,
  classAssignments,
  studentAssignments
};
