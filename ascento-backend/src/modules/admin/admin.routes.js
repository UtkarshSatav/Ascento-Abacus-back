'use strict';

const express = require('express');
const academicYearRoutes = require('../academic-year/academic-year.routes');
const controller = require('./admin.controller');
const validateSession = require('../../middleware/validateSession');
const validateRole = require('../../middleware/validateRole');
const classRoutes = require('../class/class.routes');
const dashboardController = require('../dashboard/dashboard.controller');
const domainRoutes = require('../domain/domain.routes');
const enquiryAdminRoutes = require('../enquiry/enquiry.admin.routes');
const examAdminRoutes = require('../exam/exam.admin.routes');
const examSubjectController = require('../exam-subject/exam-subject.controller');
const eventController = require('../event/event.controller');
const feeController = require('../fee/fee.controller');
const notificationController = require('../notification/notification.controller');
const reminderController = require('../reminder/reminder.controller');
const reportCardController = require('../report-card/report-card.controller');
const sectionRoutes = require('../section/section.routes');
const attendanceController = require('../attendance/attendance.controller');
const studentEnrollmentController = require('../student-enrollment/student-enrollment.controller');
const studentEnrollmentRoutes = require('../student-enrollment/student-enrollment.routes');
const studentRoutes = require('../student/student.routes');
const subjectRoutes = require('../subject/subject.routes');
const timetableController = require('../timetable/timetable.controller');
const teacherAssignmentController = require('../teacher-assignment/teacher-assignment.controller');
const teacherAssignmentRoutes = require('../teacher-assignment/teacher-assignment.routes');
const teacherRoutes = require('../teacher/teacher.routes');

// ── /api/auth/admin/* ─────────────────────────────────────────────────────────
const authRouter = express.Router();

// POST /api/auth/admin/login  — public
authRouter.post('/login', controller.login);

// POST /api/auth/admin/logout — protected
authRouter.post(
  '/logout',
  validateSession,
  validateRole('admin'),
  controller.logout,
);

// ── /api/admin/* ──────────────────────────────────────────────────────────────
const adminRouter = express.Router();

// Every route below requires a valid admin session
adminRouter.use(validateSession, validateRole('admin'));

// GET /api/admin/profile
adminRouter.get('/profile', controller.getProfile);

// PUT /api/admin/change-password
adminRouter.put('/change-password', controller.changePassword);

// Dashboard analytics → GET /api/admin/dashboard
adminRouter.get('/dashboard', dashboardController.getDashboard);

// Academic years → /api/admin/academic-years
adminRouter.use('/academic-years', academicYearRoutes);

// Domain management  → /api/admin/domains
adminRouter.use('/domains', domainRoutes);

// Class management   → /api/admin/classes
adminRouter.use('/classes', classRoutes);

// Section management → /api/admin/sections
adminRouter.use('/sections', sectionRoutes);

// Subject management → /api/admin/subjects
adminRouter.use('/subjects', subjectRoutes);

// Exams management → /api/admin/exams
adminRouter.use('/exams', examAdminRoutes);

// Exam subject management
adminRouter.post('/exam-subject', examSubjectController.create);
adminRouter.get('/exam-subjects/:examId', examSubjectController.listByExam);
adminRouter.put('/exam-subject/:id', examSubjectController.update);
adminRouter.delete('/exam-subject/:id', examSubjectController.remove);

// Teacher management → /api/admin/teachers
adminRouter.use('/teachers', teacherRoutes);

// Teacher assignments → POST /api/admin/assign-teacher
adminRouter.post('/assign-teacher', teacherAssignmentController.create);

// Teacher assignments → GET /api/admin/teacher-assignments | PUT/DELETE by id
adminRouter.use('/teacher-assignments', teacherAssignmentRoutes);

// Student management → /api/admin/students
adminRouter.use('/students', studentRoutes);

// Timetable management → POST /api/admin/timetable | PUT/DELETE by id
adminRouter.post('/timetable', timetableController.create);
adminRouter.put('/timetable/:id', timetableController.update);
adminRouter.delete('/timetable/:id', timetableController.remove);

// Student enrollments → POST /api/admin/enroll-student
adminRouter.post('/enroll-student', studentEnrollmentController.create);

// Student promotions → POST /api/admin/promote-student
adminRouter.post('/promote-student', studentEnrollmentController.promote);

// Student enrollments → GET /api/admin/enrollments
adminRouter.use('/enrollments', studentEnrollmentRoutes);

// Attendance → GET /api/admin/attendance
adminRouter.get('/attendance', attendanceController.listForAdmin);

// Report card → GET /api/admin/report-card/:studentId
adminRouter.get('/report-card/:studentId', reportCardController.getForAdminByStudent);

// Fee management → POST/GET /api/admin/fees
adminRouter.post('/fees', feeController.create);
adminRouter.get('/fees', feeController.listForAdmin);

// Fee payment update → PUT /api/admin/fees/pay
adminRouter.put('/fees/pay', feeController.markAsPaid);

// Reminder management → POST /api/admin/reminders
adminRouter.post('/reminders', reminderController.create);

// Event management → POST /api/admin/events
adminRouter.post('/events', eventController.create);

// Notification management → POST /api/admin/notifications
adminRouter.post('/notifications', notificationController.create);

// Enquiry management → GET/PUT/DELETE /api/admin/enquiries
adminRouter.use('/enquiries', enquiryAdminRoutes);

module.exports = { authRouter, adminRouter };
