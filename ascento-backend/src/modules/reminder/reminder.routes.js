'use strict';

const express = require('express');
const controller = require('./reminder.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');

const router = express.Router();

router.get(
	'/reminders',
	validateSession,
	validateRole('admin', 'teacher', 'student', 'parent'),
	controller.listForUser,
);

module.exports = router;
