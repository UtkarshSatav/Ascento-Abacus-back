const service = require('./attendance.service');

const mark = async (req, res, next) => {
  try { res.json(await service.mark(req.body)); } catch (err) { next(err); }
};

const daily = async (req, res, next) => {
  try { res.json(await service.fetchDaily(req.query)); } catch (err) { next(err); }
};

const weekly = async (req, res, next) => {
  try { res.json(await service.weeklySummary(req.query)); } catch (err) { next(err); }
};

const monthly = async (req, res, next) => {
  try { res.json(await service.monthlyPercentage(req.query)); } catch (err) { next(err); }
};

module.exports = { mark, daily, weekly, monthly };
