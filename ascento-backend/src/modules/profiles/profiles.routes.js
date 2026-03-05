const express = require('express');
const authenticate = require('../../middlewares/auth.middleware');
const { permit } = require('../../middlewares/role.middleware');
const studentProfileController = require('./studentProfile.controller');
const teacherProfileController = require('./teacherProfile.controller');
const bulkDataController = require('./bulkData.controller');

const router = express.Router();

// Student Profile Routes
router.post('/student/:studentId', authenticate, permit('admin'), studentProfileController.createStudentProfile);
router.get('/student/my-profile', authenticate, permit('student'), studentProfileController.getMyProfile);
router.get('/student/:studentId', authenticate, studentProfileController.getStudentProfileById);
router.get('/students/all', authenticate, permit('admin', 'teacher'), studentProfileController.getAllProfiles);
router.put('/student/update', authenticate, permit('student'), studentProfileController.updateStudentProfile);
router.delete('/student/:studentId', authenticate, permit('admin'), studentProfileController.deleteProfile);

// Teacher Profile Routes
router.post('/teacher/:teacherId', authenticate, permit('admin'), teacherProfileController.createTeacherProfile);
router.get('/teacher/my-profile', authenticate, permit('teacher'), teacherProfileController.getMyProfile);
router.get('/teacher/:teacherId', authenticate, teacherProfileController.getTeacherProfileById);
router.get('/teachers/all', authenticate, permit('admin'), teacherProfileController.getAllProfiles);
router.put('/teacher/update', authenticate, permit('teacher'), teacherProfileController.updateTeacherProfile);
router.delete('/teacher/:teacherId', authenticate, permit('admin'), teacherProfileController.deleteProfile);

// Bulk Data Routes (Teacher uploading student data)
router.post('/bulk-data/student/:studentId', authenticate, permit('teacher'), bulkDataController.uploadBulkStudentData);
router.get('/bulk-data/student/:studentId', authenticate, bulkDataController.getStudentData);
router.get('/bulk-data/my-students', authenticate, permit('teacher'), bulkDataController.getMyStudentsData);
router.put('/bulk-data/:dataId', authenticate, permit('teacher'), bulkDataController.updateStudentData);
router.delete('/bulk-data/:dataId', authenticate, permit('teacher'), bulkDataController.deleteStudentData);

module.exports = router;
