const express = require('express');
const router = express.Router();
const controller = require('./reports.controller');
const auth = require('../../middlewares/auth.middleware');
const { permit } = require('../../middlewares/role.middleware');

router.get('/student/:studentId/summary', auth, permit('admin','teacher','parent','student'), controller.studentSummary);

module.exports = router;
