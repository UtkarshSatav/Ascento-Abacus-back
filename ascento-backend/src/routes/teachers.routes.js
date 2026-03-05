const router = require('express').Router();
const controller = require('../controllers/teacher.controller');
const authenticate = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { createTeacherSchema } = require('../validators/teacher.validation');

router.use(authenticate);

router.post('/', allowRoles('admin'), validate(createTeacherSchema), controller.createTeacher);
router.get('/', allowRoles('admin', 'teacher'), controller.listTeachers);
router.get('/me/classes', allowRoles('teacher'), controller.myClasses);
router.get('/me/classes/:classId/students', allowRoles('teacher'), controller.myClassStudents);
router.get('/:id', allowRoles('admin', 'teacher'), controller.getTeacher);

module.exports = router;

