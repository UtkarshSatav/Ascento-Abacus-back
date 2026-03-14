'use strict';

const express = require('express');
const controller = require('./student-enrollment.controller');

const router = express.Router();

router.get('/', controller.list);

module.exports = router;