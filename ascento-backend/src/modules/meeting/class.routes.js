'use strict';

const express = require('express');
const controller = require('./meeting.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');

const router = express.Router();

router.use(validateSession, validateRole('admin', 'teacher'));
router.get('/meetings/:classId', controller.listForClass);

module.exports = router;
