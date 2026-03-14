'use strict';

const express = require('express');
const controller = require('./enquiry.controller');

const router = express.Router();

router.post('/enquiry', controller.create);

module.exports = router;
