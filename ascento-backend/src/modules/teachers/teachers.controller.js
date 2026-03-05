const service = require('./teachers.service');

const create = async (req, res, next) => {
  try { res.status(201).json(await service.createTeacher(req.body)); } catch (err) { next(err); }
};

const list = async (req, res, next) => {
  try { const { page, limit } = req.query; res.json(await service.listTeachers({ page: Number(page)||1, limit: Number(limit)||20 })); } catch (err) { next(err); }
};

module.exports = { create, list };
