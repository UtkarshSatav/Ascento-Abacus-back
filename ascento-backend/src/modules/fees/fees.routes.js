const express = require('express');
const router = express.Router();
const controller = require('./fees.controller');
const auth = require('../../middlewares/auth.middleware');
const { permit } = require('../../middlewares/role.middleware');

router.post('/', auth, permit('admin'), controller.add);
router.post('/:id/pay', auth, permit('admin'), controller.pay);
router.get('/status', auth, permit('admin','teacher','parent'), controller.status);

module.exports = router;
