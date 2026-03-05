const express = require('express');
const router = express.Router();
const controller = require('./homework.controller');
const auth = require('../../middlewares/auth.middleware');
const { permit } = require('../../middlewares/role.middleware');

router.post('/', auth, permit('admin','teacher'), controller.create);
router.get('/', auth, permit('admin','teacher','student','parent'), controller.list);

module.exports = router;
