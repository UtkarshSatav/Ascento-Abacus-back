'use strict';

const express = require('express');
const controller = require('./student-enrollment.controller');
const studentController = require('../student/student.controller');
const attendanceController = require('../attendance/attendance.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');
const requireStudentPasswordChange = require('../../middleware/requireStudentPasswordChange');

const router = express.Router();

router.use(validateSession, validateRole('student'));
router.post('/change-password', studentController.changePassword);
router.use(requireStudentPasswordChange);
router.get('/current-class', controller.getCurrentClass);
router.get('/attendance', attendanceController.listForStudent);

module.exports = router;