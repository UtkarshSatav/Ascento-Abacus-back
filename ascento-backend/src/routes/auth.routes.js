const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  adminLoginSchema,
  teacherLoginSchema,
  studentLoginSchema,
  parentLoginSchema,
  parentOtpRequestSchema,
  refreshTokenSchema
} = require('../validators/auth.validation');

router.post('/admin/login', validate(adminLoginSchema), controller.adminLogin);
router.post('/teacher/login', validate(teacherLoginSchema), controller.teacherLogin);
router.post('/student/login', validate(studentLoginSchema), controller.studentLogin);
router.post('/parent/request-otp', validate(parentOtpRequestSchema), controller.parentRequestOtp);
router.post('/parent/login', validate(parentLoginSchema), controller.parentLogin);
router.post('/refresh', validate(refreshTokenSchema), controller.refresh);
router.get('/me', authenticate, controller.me);

module.exports = router;

