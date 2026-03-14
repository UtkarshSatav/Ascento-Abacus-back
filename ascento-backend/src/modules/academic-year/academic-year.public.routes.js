'use strict';

const express = require('express');
const controller = require('./academic-year.controller');

const router = express.Router();

router.get('/active', controller.getActive);

module.exports = router;