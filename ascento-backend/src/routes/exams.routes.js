const router = require('express').Router();
const controller = require('../controllers/exam.controller');
const authenticate = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { createExamSchema } = require('../validators/exam.validation');

router.use(authenticate);

router.post('/', allowRoles('admin', 'teacher'), validate(createExamSchema), controller.createExam);
router.get('/', allowRoles('admin', 'teacher', 'parent', 'student'), controller.listExams);

module.exports = router;

