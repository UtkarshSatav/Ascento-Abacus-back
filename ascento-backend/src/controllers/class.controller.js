const classService = require('../services/class.service');
const asyncHandler = require('../utils/async-handler');

const createClass = asyncHandler(async (req, res) => {
  const data = await classService.createClass(req.body);
  res.status(201).json(data);
});

const listClasses = asyncHandler(async (req, res) => {
  const data = await classService.listClasses(req.query);
  res.json(data);
});

const assignTeacher = asyncHandler(async (req, res) => {
  const data = await classService.assignTeacherToClass(req.params.id, req.body.teacherId);
  res.json(data);
});

module.exports = {
  createClass,
  listClasses,
  assignTeacher
};
