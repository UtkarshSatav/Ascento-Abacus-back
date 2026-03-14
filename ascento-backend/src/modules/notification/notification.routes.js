'use strict';

const express = require('express');
const controller = require('./notification.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');

const router = express.Router();

router.get(
  '/notifications',
  validateSession,
  validateRole('admin', 'teacher', 'student', 'parent'),
  controller.listForUser,
);

module.exports = router;
