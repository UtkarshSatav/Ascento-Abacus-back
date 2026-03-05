const service = require('./homework.service');

const create = async (req, res, next) => {
  try { res.status(201).json(await service.createHomework(req.body)); } catch (err) { next(err); }
};

const list = async (req, res, next) => {
  try { const { class: classNo, section, page, limit } = req.query; res.json(await service.getByClassSection({ classNo: Number(classNo), section, page: Number(page)||1, limit: Number(limit)||20 })); } catch (err) { next(err); }
};

module.exports = { create, list };
