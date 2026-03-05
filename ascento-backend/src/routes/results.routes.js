const router = require('express').Router();
const controller = require('../controllers/result.controller');
const authenticate = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');

router.use(authenticate);

router.post('/student/:id/generate', allowRoles('admin', 'teacher'), controller.generate);
router.get('/student/:id', allowRoles('admin', 'teacher', 'parent', 'student'), controller.studentResults);
router.get('/student/:id/report-card', allowRoles('admin', 'teacher', 'parent', 'student'), controller.reportCard);

module.exports = router;
