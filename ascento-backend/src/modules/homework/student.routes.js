'use strict';

const express = require('express');
const controller = require('./homework.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');

const router = express.Router();

router.use(validateSession, validateRole('student'));
router.get('/homework', controller.listForStudent);

module.exports = router;