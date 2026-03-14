'use strict';

const express = require('express');
const controller = require('./marks.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');
const requireTeacherPasswordChange = require('../../middleware/requireTeacherPasswordChange');

const router = express.Router();

router.use(validateSession, validateRole('teacher'), requireTeacherPasswordChange);
router.post('/marks', controller.create);
router.put('/marks/:id', controller.update);
router.get('/marks/:examId', controller.listForTeacherByExam);

module.exports = router;