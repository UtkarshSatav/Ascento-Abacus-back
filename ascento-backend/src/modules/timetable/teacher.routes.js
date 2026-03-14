'use strict';

const express = require('express');
const controller = require('./timetable.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');
const requireTeacherPasswordChange = require('../../middleware/requireTeacherPasswordChange');

const router = express.Router();

router.use(validateSession, validateRole('teacher'), requireTeacherPasswordChange);
router.get('/timetable', controller.listForTeacher);

module.exports = router;