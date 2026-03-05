const service = require('./students.service');

const create = async (req, res, next) => {
  try {
    const data = await service.createStudent(req.body);
    res.status(201).json(data);
  } catch (err) { next(err); }
};

const list = async (req, res, next) => {
  try {
    const { page, limit, q } = req.query;
    res.json(await service.listStudents({ page: Number(page) || 1, limit: Number(limit) || 20, q }));
  } catch (err) { next(err); }
};

const get = async (req, res, next) => {
  try { res.json(await service.getStudent(req.params.id)); } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try { res.json(await service.updateStudent(req.params.id, req.body)); } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try { await service.removeStudent(req.params.id); res.json({ message: 'Deleted' }); } catch (err) { next(err); }
};

module.exports = { create, list, get, update, remove };
