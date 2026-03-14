'use strict';

const express = require('express');
const controller = require('./student-enrollment.controller');
const attendanceController = require('../attendance/attendance.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');

const router = express.Router();

router.use(validateSession, validateRole('student'));
router.get('/current-class', controller.getCurrentClass);
router.get('/attendance', attendanceController.listForStudent);

module.exports = router;