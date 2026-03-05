const Result = require('../models/result.model');
const Mark = require('../models/mark.model');
const Student = require('../models/student.model');
const Exam = require('../models/exam.model');
const Attendance = require('../models/attendance.model');
const { resolveGrade } = require('../utils/grade');
const { parsePagination } = require('../utils/pagination');
const { ROLES } = require('../config/constants');
const {
  ensureStudentAccess,
  ensureTeacherClassAccess,
  getTeacherByUserId
} = require('./access.service');

async function generateStudentResult(studentId, examId, user) {
  const student = await Student.findById(studentId);
  if (!student) throw { status: 404, message: 'Student not found' };

  const exam = await Exam.findById(examId);
  if (!exam) throw { status: 404, message: 'Exam not found' };

  if (student.classId.toString() !== exam.classId.toString()) {
    throw { status: 400, message: 'Student does not belong to exam class' };
  }

  if (user.role === ROLES.TEACHER) {
    await ensureTeacherClassAccess(user, exam.classId);
  }

  const marks = await Mark.find({ studentId, examId }).populate('subjectId', 'name');
  if (!marks.length) {
    throw { status: 400, message: 'No marks available for result generation' };
  }

  const subjectWise = marks.map((mark) => ({
    subjectId: mark.subjectId._id,
    subjectName: mark.subjectId.name,
    obtainedMarks: mark.obtainedMarks,
    totalMarks: mark.totalMarks
  }));

  const totalObtained = subjectWise.reduce((sum, item) => sum + item.obtainedMarks, 0);
  const totalMarks = subjectWise.reduce((sum, item) => sum + item.totalMarks, 0);
  const percentage = Number(((totalObtained / totalMarks) * 100).toFixed(2));
  const grade = resolveGrade(percentage);

  let generatedBy = null;
  if (user.role === ROLES.TEACHER) {
    const teacher = await getTeacherByUserId(user.userId);
    generatedBy = teacher ? teacher._id : null;
  }

  return Result.findOneAndUpdate(
    { studentId, examId },
    {
      subjectWise,
      totalObtained,
      totalMarks,
      percentage,
      grade,
      generatedBy,
      publishedAt: new Date()
    },
    { upsert: true, new: true }
  )
    .populate('studentId', 'fullName rollNumber')
    .populate('examId', 'name examType examDate');
}

async function resultsByStudent(studentId, query, user) {
  await ensureStudentAccess(user, studentId);

  const { page, limit, skip } = parsePagination(query);
  const filter = { studentId };
  if (query.examId) filter.examId = query.examId;

  const [data, total] = await Promise.all([
    Result.find(filter)
      .populate('examId', 'name examType examDate')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit),
    Result.countDocuments(filter)
  ]);

  return { data, total, page, limit };
}

async function reportCard(studentId, examId, user) {
  const student = await Student.findById(studentId)
    .populate('classId', 'className section')
    .populate('domainId', 'name code')
    .populate('parentId', 'name phone email');

  await ensureStudentAccess(user, student);

  let result = null;
  if (examId) {
    result = await Result.findOne({ studentId, examId }).populate('examId', 'name examType examDate');
  } else {
    result = await Result.findOne({ studentId })
      .populate('examId', 'name examType examDate')
      .sort({ publishedAt: -1 });
  }

  if (!result) {
    throw { status: 404, message: 'Result not found for report card' };
  }

  const totalAttendance = await Attendance.countDocuments({ studentId });
  const presentAttendance = await Attendance.countDocuments({ studentId, status: 'present' });
  const attendancePercentage =
    totalAttendance > 0 ? Number(((presentAttendance / totalAttendance) * 100).toFixed(2)) : 0;

  return {
    student,
    result,
    attendance: {
      total: totalAttendance,
      present: presentAttendance,
      percentage: attendancePercentage
    }
  };
}

module.exports = {
  generateStudentResult,
  resultsByStudent,
  reportCard
};
