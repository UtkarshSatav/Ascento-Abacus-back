const studentAdmissionService = require('../services/studentAdmission.service');
const asyncHandler = require('../utils/async-handler');

const apply = asyncHandler(async (req, res) => {
  const data = await studentAdmissionService.applyAdmission(req.body);
  res.status(201).json(data);
});

module.exports = {
  apply
};
