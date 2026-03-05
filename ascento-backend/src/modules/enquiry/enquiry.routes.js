const express = require('express');
const router = express.Router();
const controller = require('./enquiry.controller');
const auth = require('../../middlewares/auth.middleware');
const { permit } = require('../../middlewares/role.middleware');

router.post('/', controller.create); // public
router.get('/', auth, permit('admin'), controller.list);

module.exports = router;
