const router = require('express').Router();
const controller = require('../controllers/attendance.controller');
const authenticate = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { markAttendanceSchema } = require('../validators/attendance.validation');

router.use(authenticate);

router.post('/', allowRoles('admin', 'teacher'), validate(markAttendanceSchema), controller.markAttendance);
router.get('/class/:id', allowRoles('admin', 'teacher'), controller.classAttendance);
router.get('/student/:id', allowRoles('admin', 'teacher', 'parent', 'student'), controller.studentAttendance);

module.exports = router;

