const router = require('express').Router();
const controller = require('../controllers/mark.controller');
const authenticate = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { createMarkSchema } = require('../validators/mark.validation');

router.use(authenticate);

router.post('/', allowRoles('admin', 'teacher'), validate(createMarkSchema), controller.createMark);
router.get('/student/:id', allowRoles('admin', 'teacher', 'parent', 'student'), controller.studentMarks);
router.get('/exam/:id', allowRoles('admin', 'teacher'), controller.examMarks);

module.exports = router;

