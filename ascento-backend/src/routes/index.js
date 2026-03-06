const router = require('express').Router();

router.use('/auth', require('./auth.routes'));

router.use('/admission', require('./admission.routes'));
router.use('/teacher', require('./teacher-application.routes'));
router.use('/teacher', require('./teacher.routes'));
router.use('/student', require('./student.routes'));
router.use('/parent', require('./parent.routes'));

router.use('/domains', require('./domains.routes'));
router.use('/classes', require('./classes.routes'));
router.use('/subjects', require('./subjects.routes'));
router.use('/teachers', require('./teachers.routes'));
router.use('/students', require('./students.routes'));
router.use('/attendance', require('./attendance.routes'));
router.use('/exams', require('./exams.routes'));
router.use('/marks', require('./marks.routes'));
router.use('/results', require('./results.routes'));
router.use('/assignments', require('./assignments.routes'));
router.use('/admin', require('./admin.routes'));

module.exports = router;
