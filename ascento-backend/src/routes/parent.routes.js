const router = require('express').Router();
const controller = require('../controllers/parentPortal.controller');
const authenticate = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');

router.use(authenticate);
router.use(allowRoles('parent'));

router.get('/student', controller.student);
router.get('/attendance', controller.attendance);
router.get('/results', controller.results);
router.get('/upcoming-classes', controller.upcomingClasses);
router.get('/report-card', controller.reportCard);

module.exports = router;
