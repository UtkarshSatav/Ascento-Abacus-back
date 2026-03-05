const Mark = require('../models/mark.model');
const Exam = require('../models/exam.model');
const Subject = require('../models/subject.model');
const Student = require('../models/student.model');
const { parsePagination } = require('../utils/pagination');
const { ROLES } = require('../config/constants');
const {
  ensureTeacherClassAccess,
  ensureStudentAccess
} = require('./access.service');

async function createOrUpdateMark(payload, user) {
  const [exam, subject, student] = await Promise.all([
    Exam.findById(payload.examId),
    Subject.findById(payload.subjectId),
    Student.findById(payload.studentId)
  ]);

  if (!exam) throw { status: 404, message: 'Exam not found' };
  if (!subject) throw { status: 404, message: 'Subject not found' };
  if (!student) throw { status: 404, message: 'Student not found' };

  if (student.classId.toString() !== exam.classId.toString()) {
    throw { status: 400, message: 'Student does not belong to exam class' };
  }

  if (subject.classId.toString() !== exam.classId.toString()) {
    throw { status: 400, message: 'Subject does not belong to exam class' };
  }

  if (user.role === ROLES.TEACHER) {
    await ensureTeacherClassAccess(user, exam.classId);
  }

  return Mark.findOneAndUpdate(
    {
      examId: payload.examId,
      studentId: payload.studentId,
      subjectId: payload.subjectId
    },
    {
      obtainedMarks: payload.obtainedMarks,
      totalMarks: payload.totalMarks
    },
    { upsert: true, new: true }
  )
    .populate('examId', 'name examType examDate')
    .populate('subjectId', 'name code')
    .populate('studentId', 'fullName rollNumber');
}

async function marksByStudent(studentId, query, user) {
  await ensureStudentAccess(user, studentId);

  const { page, limit, skip } = parsePagination(query);
  const filter = { studentId };
  if (query.examId) filter.examId = query.examId;

  const [data, total] = await Promise.all([
    Mark.find(filter)
      .populate('examId', 'name examType examDate')
      .populate('subjectId', 'name code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Mark.countDocuments(filter)
  ]);

  return { data, total, page, limit };
}

async function marksByExam(examId, query, user) {
  const exam = await Exam.findById(examId);
  if (!exam) throw { status: 404, message: 'Exam not found' };

  if (user.role === ROLES.TEACHER) {
    await ensureTeacherClassAccess(user, exam.classId);
  }

  const { page, limit, skip } = parsePagination(query);

  const [data, total] = await Promise.all([
    Mark.find({ examId })
      .populate('studentId', 'fullName rollNumber')
      .populate('subjectId', 'name code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Mark.countDocuments({ examId })
  ]);

  return { data, total, page, limit };
}

module.exports = {
  createOrUpdateMark,
  marksByStudent,
  marksByExam
};
