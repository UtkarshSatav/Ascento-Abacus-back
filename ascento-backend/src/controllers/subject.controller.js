const subjectService = require('../services/subject.service');
const asyncHandler = require('../utils/async-handler');

const createSubject = asyncHandler(async (req, res) => {
  const data = await subjectService.createSubject(req.body);
  res.status(201).json(data);
});

const listSubjects = asyncHandler(async (req, res) => {
  const data = await subjectService.listSubjects(req.query);
  res.json(data);
});

const assignTeacher = asyncHandler(async (req, res) => {
  const data = await subjectService.assignTeacherToSubject(req.params.id, req.body.teacherId);
  res.json(data);
});

module.exports = {
  createSubject,
  listSubjects,
  assignTeacher
};
