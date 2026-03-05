const service = require('./parents.service');

const create = async (req, res, next) => {
  try { res.status(201).json(await service.createParent(req.body)); } catch (err) { next(err); }
};

const list = async (req, res, next) => {
  try { const { page, limit } = req.query; res.json(await service.listParents({ page: Number(page)||1, limit: Number(limit)||20 })); } catch (err) { next(err); }
};

module.exports = { create, list };
