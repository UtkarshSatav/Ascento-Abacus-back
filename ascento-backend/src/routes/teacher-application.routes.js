const router = require('express').Router();
const controller = require('../controllers/teacherApplication.controller');
const validate = require('../middlewares/validate.middleware');
const upload = require('../middlewares/upload.middleware');
const { teacherApplySchema } = require('../validators/teacherApplication.validation');

// Accepts multipart/form-data (file upload) or JSON body
router.post(
  '/apply',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'supportingDocuments', maxCount: 10 }
  ]),
  validate(teacherApplySchema),
  controller.apply
);

module.exports = router;

