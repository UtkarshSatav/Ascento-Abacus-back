const express = require('express');
const router = express.Router();
const controller = require('./students.controller');
const auth = require('../../middlewares/auth.middleware');
const { permit } = require('../../middlewares/role.middleware');

router.post('/', auth, permit('admin','teacher'), controller.create);
router.get('/', auth, permit('admin','teacher'), controller.list);
router.get('/:id', auth, permit('admin','teacher','parent','student'), controller.get);
router.put('/:id', auth, permit('admin','teacher'), controller.update);
router.delete('/:id', auth, permit('admin'), controller.remove);

module.exports = router;
