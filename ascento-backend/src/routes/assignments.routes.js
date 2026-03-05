const router = require('express').Router();
const controller = require('../controllers/assignment.controller');
const authenticate = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { createAssignmentSchema } = require('../validators/assignment.validation');

router.use(authenticate);

router.post('/', allowRoles('admin', 'teacher'), validate(createAssignmentSchema), controller.createAssignment);
router.get('/class/:id', allowRoles('admin', 'teacher'), controller.classAssignments);
router.get('/student/:id', allowRoles('admin', 'teacher', 'parent', 'student'), controller.studentAssignments);

module.exports = router;

