const router = require('express').Router();
const controller = require('../controllers/studentAdmission.controller');
const validate = require('../middlewares/validate.middleware');
const { applyStudentAdmissionSchema } = require('../validators/studentAdmission.validation');

router.post('/apply', validate(applyStudentAdmissionSchema), controller.apply);

module.exports = router;
