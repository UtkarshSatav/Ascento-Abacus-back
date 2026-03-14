'use strict';

const express = require('express');
const controller = require('./teacher-assignment.controller');

const router = express.Router();

router.get('/', controller.list);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;