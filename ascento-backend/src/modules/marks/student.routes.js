'use strict';

const express = require('express');
const controller = require('./marks.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');

const router = express.Router();

router.use(validateSession, validateRole('student'));
router.get('/marks', controller.listForStudent);

module.exports = router;