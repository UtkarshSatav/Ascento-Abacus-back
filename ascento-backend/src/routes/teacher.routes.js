const router = require('express').Router();
const controller = require('../controllers/teacherPortal.controller');
const authenticate = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');

const { markAttendanceSchema } = require('../validators/attendance.validation');
const { createMarkSchema } = require('../validators/mark.validation');
const { createAssignmentSchema } = require('../validators/assignment.validation');
const {
  publishContentSchema,
  publishAnnouncementSchema
} = require('../validators/content.validation');
const { scheduleOnlineClassSchema } = require('../validators/onlineClass.validation');

router.use(authenticate);
router.use(allowRoles('teacher'));

router.get('/classes', controller.classes);
router.get('/students', controller.students);

router.post('/attendance', validate(markAttendanceSchema), controller.attendance);
router.post('/marks', validate(createMarkSchema), controller.marks);
router.post('/add-marks', validate(createMarkSchema), controller.marks);
router.post('/assignment', validate(createAssignmentSchema), controller.assignment);
router.post('/announcement', validate(publishAnnouncementSchema), controller.announcement);
router.post('/publish-content', validate(publishContentSchema), controller.publishContent);
router.post('/schedule-class', validate(scheduleOnlineClassSchema), controller.scheduleClass);

module.exports = router;

