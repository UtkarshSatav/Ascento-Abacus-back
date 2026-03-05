const service = require('./reports.service');

const studentSummary = async (req, res, next) => {
  try { res.json(await service.studentSummary(req.params.studentId)); } catch (err) { next(err); }
};

module.exports = { studentSummary };
