const express = require('express');
const router = express.Router();
const controller = require('./exams.controller');
const auth = require('../../middlewares/auth.middleware');
const { permit } = require('../../middlewares/role.middleware');

router.post('/', auth, permit('admin','teacher'), controller.create);
router.post('/:id/marks', auth, permit('admin','teacher'), controller.enterMarks);
router.get('/student/:studentId/result', auth, permit('admin','teacher','parent','student'), controller.result);

module.exports = router;
