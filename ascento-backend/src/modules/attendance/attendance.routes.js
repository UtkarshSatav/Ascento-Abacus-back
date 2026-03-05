const express = require('express');
const router = express.Router();
const controller = require('./attendance.controller');
const auth = require('../../middlewares/auth.middleware');
const { permit } = require('../../middlewares/role.middleware');

router.post('/', auth, permit('admin','teacher'), controller.mark);
router.get('/daily', auth, permit('admin','teacher','parent'), controller.daily);
router.get('/weekly', auth, permit('admin','teacher','parent','student'), controller.weekly);
router.get('/monthly', auth, permit('admin','teacher','parent','student'), controller.monthly);

module.exports = router;
