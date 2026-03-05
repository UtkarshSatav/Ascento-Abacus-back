const teacherApplicationService = require('../services/teacherApplication.service');
const asyncHandler = require('../utils/async-handler');

const apply = asyncHandler(async (req, res) => {
  const data = await teacherApplicationService.applyTeacher(req.body);
  res.status(201).json(data);
});

module.exports = {
  apply
};
