const router = require('express').Router();
const controller = require('../controllers/teacherApplication.controller');
const validate = require('../middlewares/validate.middleware');
const { teacherApplySchema } = require('../validators/teacherApplication.validation');

router.post('/apply', validate(teacherApplySchema), controller.apply);

module.exports = router;

