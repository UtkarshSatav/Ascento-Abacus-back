'use strict';

const express = require('express');
const controller = require('./report-card.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');

const router = express.Router();

router.use(validateSession, validateRole('admin', 'teacher'));
router.get('/report-cards/:classId', controller.getForClass);

module.exports = router;
