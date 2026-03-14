'use strict';

const express = require('express');
const controller = require('./domain.controller');

const router = express.Router();

// Auth guard already applied at the adminRouter level in routes/index.js

router.post('/',     controller.create);
router.get('/',      controller.list);
router.get('/:id',   controller.getById);
router.put('/:id',   controller.update);
router.delete('/:id',controller.remove);

module.exports = router;
