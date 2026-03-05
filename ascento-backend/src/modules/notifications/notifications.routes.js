const express = require('express');
const router = express.Router();
const controller = require('./notifications.controller');
const auth = require('../../middlewares/auth.middleware');
const { permit } = require('../../middlewares/role.middleware');

router.post('/', auth, permit('admin','teacher'), controller.create);
router.get('/', auth, controller.list);

module.exports = router;
