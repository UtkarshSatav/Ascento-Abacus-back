const teacherApplicationService = require('../services/teacherApplication.service');
const asyncHandler = require('../utils/async-handler');

const apply = asyncHandler(async (req, res) => {
  const files = req.files || {};

  // Attach uploaded file buffers so service can upload them to Cloudinary
  const payload = {
    ...req.body,
    resumeFile: files.resume ? files.resume[0] : null,
    supportingDocumentFiles: files.supportingDocuments || []
  };

  const data = await teacherApplicationService.applyTeacher(payload);
  res.status(201).json(data);
});

module.exports = {
  apply
};
