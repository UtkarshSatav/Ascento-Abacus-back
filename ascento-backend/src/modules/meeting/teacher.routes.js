'use strict';

const express = require('express');
const controller = require('./meeting.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');
const requireTeacherPasswordChange = require('../../middleware/requireTeacherPasswordChange');

const router = express.Router();

router.use(validateSession, validateRole('teacher'), requireTeacherPasswordChange);
router.post('/meetings', controller.create);
router.get('/meetings', controller.listForTeacher);

module.exports = router;
