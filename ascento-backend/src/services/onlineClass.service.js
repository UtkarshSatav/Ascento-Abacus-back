const OnlineClass = require('../models/onlineClass.model');
const Student = require('../models/student.model');
const { parsePagination } = require('../utils/pagination');
const {
  ensureTeacherClassAccess,
  getStudentByUserId,
  getParentByUserId
} = require('./access.service');

function combineDateAndTime(dateInput, timeInput) {
  const date = new Date(dateInput);
  const [hours, minutes] = String(timeInput).split(':').map(Number);
  const combined = new Date(date);
  combined.setHours(hours || 0, minutes || 0, 0, 0);
  return combined;
}

async function scheduleClass(payload, user) {
  const teacher = await ensureTeacherClassAccess(user, payload.classId);

  const startDateTime = combineDateAndTime(payload.date, payload.startTime);
  const endDateTime = combineDateAndTime(payload.date, payload.endTime);

  if (endDateTime <= startDateTime) {
    throw { status: 400, message: 'endTime must be greater than startTime' };
  }

  return OnlineClass.create({
    title: payload.title,
    description: payload.description,
    domainId: payload.domainId,
    classId: payload.classId,
    subjectId: payload.subjectId || null,
    date: new Date(payload.date),
    startTime: payload.startTime,
    endTime: payload.endTime,
    startDateTime,
    endDateTime,
    meetingLink: payload.meetingLink,
    teacherId: teacher._id,
    isActive: true
  });
}

async function upcomingForStudent(user, query) {
  const student = await getStudentByUserId(user.userId);
  if (!student) throw { status: 404, message: 'Student profile not found' };

  const { page, limit, skip } = parsePagination(query);
  const filter = {
    classId: student.classId,
    domainId: student.domainId,
    isActive: true,
    startDateTime: { $gte: new Date() }
  };

  const [data, total] = await Promise.all([
    OnlineClass.find(filter)
      .populate('teacherId', 'name email')
      .populate('subjectId', 'name code')
      .sort({ startDateTime: 1 })
      .skip(skip)
      .limit(limit),
    OnlineClass.countDocuments(filter)
  ]);

  return { data, total, page, limit };
}

async function upcomingForParent(user, query) {
  const parent = await getParentByUserId(user.userId);
  if (!parent) throw { status: 404, message: 'Parent profile not found' };

  const students = await Student.find({ _id: { $in: parent.children } }).select('classId domainId');
  if (!students.length) {
    return { data: [], total: 0, page: 1, limit: 20 };
  }

  const classIds = [...new Set(students.map((item) => item.classId.toString()))];
  const domainIds = [...new Set(students.map((item) => item.domainId.toString()))];

  const { page, limit, skip } = parsePagination(query);
  const filter = {
    classId: { $in: classIds },
    domainId: { $in: domainIds },
    isActive: true,
    startDateTime: { $gte: new Date() }
  };

  const [data, total] = await Promise.all([
    OnlineClass.find(filter)
      .populate('teacherId', 'name email')
      .populate('subjectId', 'name code')
      .sort({ startDateTime: 1 })
      .skip(skip)
      .limit(limit),
    OnlineClass.countDocuments(filter)
  ]);

  return { data, total, page, limit };
}

module.exports = {
  scheduleClass,
  upcomingForStudent,
  upcomingForParent
};
