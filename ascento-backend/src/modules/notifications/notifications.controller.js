const service = require('./notifications.service');

const create = async (req, res, next) => { try { res.status(201).json(await service.createNotification(req.body)); } catch (err) { next(err); } };
const list = async (req, res, next) => { try { const { class: classNo, section } = req.query; res.json(await service.fetchForUser({ role: req.user.role, classNo, section })); } catch (err) { next(err); } };

module.exports = { create, list };
