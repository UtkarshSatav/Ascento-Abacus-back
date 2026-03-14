'use strict';

const express = require('express');
const controller = require('./teacher.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');
const requireTeacherPasswordChange = require('../../middleware/requireTeacherPasswordChange');

const router = express.Router();

router.use(validateSession, validateRole('teacher'));

// Teachers must be able to change a temporary password before anything else.
router.post('/change-password', controller.changePassword);

// Future teacher-only routes mounted after this line will be blocked until the
// teacher changes the temporary password.
router.use(requireTeacherPasswordChange);

module.exports = router;