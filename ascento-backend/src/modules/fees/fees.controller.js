const service = require('./fees.service');

const add = async (req, res, next) => { try { res.status(201).json(await service.addFee(req.body)); } catch (err) { next(err); } };
const pay = async (req, res, next) => { try { res.json(await service.markPaid(req.params.id)); } catch (err) { next(err); } };
const status = async (req, res, next) => { try { res.json(await service.fetchStatus(req.query)); } catch (err) { next(err); } };

module.exports = { add, pay, status };
