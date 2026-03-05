const service = require('./events.service');

const create = async (req, res, next) => { try { res.status(201).json(await service.createEvent(req.body)); } catch (err) { next(err); } };
const list = async (req, res, next) => { try { res.json(await service.upcoming()); } catch (err) { next(err); } };

module.exports = { create, list };
