const Attendance = require('../models/attendance.model');
const Student = require('../models/student.model');
const { parsePagination } = require('../utils/pagination');
const { ROLES } = require('../config/constants');
const {
  ensureTeacherClassAccess,
  ensureStudentAccess
} = require('./access.service');

function normalizeDate(input) {
  const date = new Date(input);
  date.setHours(0, 0, 0, 0);
  return date;
}

async function markAttendance(payload, user) {
  let teacherProfile = null;
  if (user.role === ROLES.TEACHER) {
    teacherProfile = await ensureTeacherClassAccess(user, payload.classId);
  }

  const date = normalizeDate(payload.date);
  const studentIds = payload.records.map((item) => item.studentId);

  const studentCount = await Student.countDocuments({
    _id: { $in: studentIds },
    classId: payload.classId
  });

  if (studentCount !== studentIds.length) {
    throw { status: 400, message: 'Some students do not belong to the provided class' };
  }

  const operations = payload.records.map((record) =>
    Attendance.findOneAndUpdate(
      { studentId: record.studentId, date },
      {
        date,
        classId: payload.classId,
        studentId: record.studentId,
        status: record.status,
        markedBy: teacherProfile ? teacherProfile._id : null,
        note: payload.note
      },
      { upsert: true, new: true }
    )
  );

  const data = await Promise.all(operations);
  return { count: data.length, data };
}

async function classAttendance(classId, query, user) {
  if (user.role === ROLES.TEACHER) {
    await ensureTeacherClassAccess(user, classId);
  }

  const { page, limit, skip } = parsePagination(query);
  const filter = { classId };

  if (query.date) {
    const date = normalizeDate(query.date);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    filter.date = { $gte: date, $lt: nextDate };
  }

  const [data, total] = await Promise.all([
    Attendance.find(filter)
      .populate('studentId', 'fullName rollNumber section')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    Attendance.countDocuments(filter)
  ]);

  return { data, total, page, limit };
}

async function studentAttendance(studentId, query, user) {
  await ensureStudentAccess(user, studentId);

  const { page, limit, skip } = parsePagination(query);
  const filter = { studentId };

  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = normalizeDate(query.from);
    if (query.to) {
      const toDate = normalizeDate(query.to);
      toDate.setDate(toDate.getDate() + 1);
      filter.date.$lt = toDate;
    }
  }

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

module.exports = {
  markAttendance,
  classAttendance,
  studentAttendance
};
