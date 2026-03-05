const router = require('express').Router();
const controller = require('../controllers/class.controller');
const authenticate = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createClassSchema,
  assignTeacherClassSchema
} = require('../validators/class.validation');

router.use(authenticate);

router.post('/', allowRoles('admin'), validate(createClassSchema), controller.createClass);
router.get('/', allowRoles('admin', 'teacher', 'student', 'parent'), controller.listClasses);
router.post(
  '/:id/assign-teacher',
  allowRoles('admin'),
  validate(assignTeacherClassSchema),
  controller.assignTeacher
);

module.exports = router;

