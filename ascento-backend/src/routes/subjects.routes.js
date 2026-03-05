const router = require('express').Router();
const controller = require('../controllers/subject.controller');
const authenticate = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createSubjectSchema,
  assignTeacherSubjectSchema
} = require('../validators/subject.validation');

router.use(authenticate);

router.post('/', allowRoles('admin'), validate(createSubjectSchema), controller.createSubject);
router.get('/', allowRoles('admin', 'teacher', 'student', 'parent'), controller.listSubjects);
router.post(
  '/:id/assign-teacher',
  allowRoles('admin'),
  validate(assignTeacherSubjectSchema),
  controller.assignTeacher
);

module.exports = router;

