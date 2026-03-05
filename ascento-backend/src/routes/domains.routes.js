const router = require('express').Router();
const controller = require('../controllers/domain.controller');
const authenticate = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { createDomainSchema } = require('../validators/domain.validation');

router.use(authenticate);

router.post('/', allowRoles('admin'), validate(createDomainSchema), controller.createDomain);
router.get('/', allowRoles('admin', 'teacher', 'student', 'parent'), controller.listDomains);

module.exports = router;

