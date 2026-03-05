const router = require('express').Router();
const controller = require('../controllers/studentPortal.controller');
const authenticate = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');

router.use(authenticate);
router.use(allowRoles('student'));

router.get('/content', controller.content);
router.get('/upcoming-classes', controller.upcomingClasses);
router.get('/results', controller.results);

module.exports = router;
