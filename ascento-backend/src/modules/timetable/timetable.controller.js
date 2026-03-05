const service = require('./timetable.service');

const create = async (req, res, next) => { try { res.status(201).json(await service.createOrUpdate(req.body)); } catch (err) { next(err); } };
const get = async (req, res, next) => { try { const { class: classNo, section } = req.query; res.json(await service.fetchForStudent({ classNo: Number(classNo), section })); } catch (err) { next(err); } };

module.exports = { create, get };
