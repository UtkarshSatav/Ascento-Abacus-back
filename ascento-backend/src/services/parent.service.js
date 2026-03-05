const Attendance = require('../models/attendance.model');
const Result = require('../models/result.model');
const Student = require('../models/student.model');
const { parsePagination } = require('../utils/pagination');
const { getParentByUserId } = require('./access.service');
const onlineClassService = require('./onlineClass.service');
const resultService = require('./result.service');

async function getParentChildren(parentUserId) {
  const parent = await getParentByUserId(parentUserId);
  if (!parent) throw { status: 404, message: 'Parent profile not found' };

  const children = await Student.find({ _id: { $in: parent.children } })
    .populate('domainId', 'name code')
    .populate('classId', 'className section')
    .sort({ fullName: 1 });

  return { parent, children };
}

function resolveStudentId(children, requestedStudentId) {
  if (requestedStudentId) {
    const exists = children.find((item) => item._id.toString() === requestedStudentId.toString());
    if (!exists) {
      throw { status: 403, message: 'Requested student does not belong to parent' };
    }
    return requestedStudentId;
  }

  if (!children.length) {
    throw { status: 404, message: 'No child linked to this parent account' };
  }

  return children[0]._id.toString();
}

async function parentStudent(user, query) {
  const { parent, children } = await getParentChildren(user.userId);
  const studentId = resolveStudentId(children, query.studentId);
  const student = children.find((item) => item._id.toString() === studentId.toString());
  return { parent, student, children };
}

async function parentAttendance(user, query) {
  const { children } = await getParentChildren(user.userId);
  const studentId = resolveStudentId(children, query.studentId);

  const { page, limit, skip } = parsePagination(query);
  const filter = { studentId };

  const [data, total, present] = await Promise.all([
    Attendance.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
    Attendance.countDocuments(filter),
    Attendance.countDocuments({ ...filter, status: 'present' })
  ]);

  const percentage = total > 0 ? Number(((present / total) * 100).toFixed(2)) : 0;

  return {
    data,
    total,
    page,
    limit,
    summary: {
      present,
      absent: total - present,
      percentage
    }
  };
}

async function parentResults(user, query) {
  const { children } = await getParentChildren(user.userId);
  const studentId = resolveStudentId(children, query.studentId);

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

async function parentUpcomingClasses(user, query) {
  return onlineClassService.upcomingForParent(user, query);
}

async function parentReportCard(user, query) {
  const { children } = await getParentChildren(user.userId);
  const studentId = resolveStudentId(children, query.studentId);
  return resultService.reportCard(studentId, query.examId || null, user);
}

module.exports = {
  parentStudent,
  parentAttendance,
  parentResults,
  parentUpcomingClasses,
  parentReportCard
};
