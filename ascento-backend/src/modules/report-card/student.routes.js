'use strict';

const express = require('express');
const controller = require('./report-card.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');
const requireStudentPasswordChange = require('../../middleware/requireStudentPasswordChange');

const router = express.Router();

router.use(validateSession, validateRole('student'), requireStudentPasswordChange);
router.get('/report-card', controller.getForStudent);

module.exports = router;
