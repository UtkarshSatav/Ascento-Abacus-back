const service = require('./exams.service');

const create = async (req, res, next) => {
  try { res.status(201).json(await service.createExam(req.body)); } catch (err) { next(err); }
};

const enterMarks = async (req, res, next) => {
  try { res.json(await service.enterMarks(req.params.id, req.body.marks)); } catch (err) { next(err); }
};

const result = async (req, res, next) => {
  try { res.json(await service.getStudentResult(req.params.studentId)); } catch (err) { next(err); }
};

module.exports = { create, enterMarks, result };
