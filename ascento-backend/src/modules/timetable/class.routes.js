'use strict';

const express = require('express');
const controller = require('./timetable.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');

const router = express.Router();

router.use(validateSession, validateRole('admin', 'teacher'));
router.get('/timetable/:classId', controller.listForClass);

module.exports = router;