'use strict';

const express = require('express');
const controller = require('./marks.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');
const requireStudentPasswordChange = require('../../middleware/requireStudentPasswordChange');

const router = express.Router();

router.use(validateSession, validateRole('student'), requireStudentPasswordChange);
router.get('/marks', controller.listForStudent);

module.exports = router;