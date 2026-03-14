'use strict';

const express = require('express');
const controller = require('./event.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');

const router = express.Router();

router.get(
  '/events',
  validateSession,
  validateRole('admin', 'teacher', 'student', 'parent'),
  controller.list,
);

module.exports = router;
