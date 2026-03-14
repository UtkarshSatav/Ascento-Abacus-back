'use strict';

const express = require('express');
const controller = require('./exam.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');

const router = express.Router();

router.use(validateSession, validateRole('admin', 'teacher'));
router.get('/exams/:classId', controller.listByClass);

module.exports = router;