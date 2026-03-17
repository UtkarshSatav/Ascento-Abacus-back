'use strict';

const express = require('express');
const controller = require('./dashboard.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');

const router = express.Router();

router.use(validateSession, validateRole('student'));
router.get('/dashboard', controller.getStudentDashboard);

module.exports = router;
