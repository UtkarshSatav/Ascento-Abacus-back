const express = require('express');
const router = express.Router();
const controller = require('./library.controller');
const auth = require('../../middlewares/auth.middleware');
const { permit } = require('../../middlewares/role.middleware');

router.post('/books', auth, permit('admin','teacher'), controller.add);
router.get('/books', auth, controller.list);
router.post('/issue', auth, permit('admin','teacher'), controller.issue);
router.post('/return/:id', auth, permit('admin','teacher'), controller.returnBook);

module.exports = router;
