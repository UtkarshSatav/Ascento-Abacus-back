'use strict';

const express = require('express');
const controller = require('./fee.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');

const router = express.Router();

router.use(validateSession, validateRole('student'));
router.get('/fees', controller.listForStudent);

module.exports = router;
