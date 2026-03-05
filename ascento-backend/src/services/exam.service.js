const Exam = require('../models/exam.model');
const Domain = require('../models/domain.model');
const ClassModel = require('../models/class.model');
const Student = require('../models/student.model');
const { parsePagination } = require('../utils/pagination');
const { ROLES } = require('../config/constants');
const {
  ensureTeacherClassAccess,
  getTeacherByUserId,
  getStudentByUserId,
  getParentByUserId
} = require('./access.service');

async function createExam(payload, user) {
  const [domain, classDoc] = await Promise.all([
    Domain.findById(payload.domainId),
    ClassModel.findById(payload.classId)
  ]);

  if (!domain) throw { status: 404, message: 'Domain not found' };
  if (!classDoc) throw { status: 404, message: 'Class not found' };

  if (classDoc.domainId.toString() !== domain._id.toString()) {
    throw { status: 400, message: 'Class does not belong to selected domain' };
  }

  let createdBy = null;
  if (user.role === ROLES.TEACHER) {
    const teacher = await ensureTeacherClassAccess(user, payload.classId);
    createdBy = teacher._id;
  }

  return Exam.create({ ...payload, createdBy });
}

async function listExams(query, user) {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.domainId) filter.domainId = query.domainId;
  if (query.classId) filter.classId = query.classId;
  if (query.examType) filter.examType = query.examType;

  if (user.role === ROLES.TEACHER) {
    const teacher = await getTeacherByUserId(user.userId);
    if (!teacher) throw { status: 404, message: 'Teacher profile not found' };
    filter.classId = { $in: teacher.assignedClassIds };
  }

  if (user.role === ROLES.STUDENT) {
    const student = await getStudentByUserId(user.userId);
    if (!student) throw { status: 404, message: 'Student profile not found' };
    filter.classId = student.classId;
  }

  if (user.role === ROLES.PARENT) {
    const parent = await getParentByUserId(user.userId);
    if (!parent || !parent.children.length) {
      return { data: [], total: 0, page, limit };
    }
    const child = await Student.findById(parent.children[0]);
    if (child) filter.classId = child.classId;
  }

  const [data, total] = await Promise.all([
    Exam.find(filter)
      .populate('domainId', 'name code')
      .populate('classId', 'className section')
      .sort({ examDate: -1 })
      .skip(skip)
      .limit(limit),
    Exam.countDocuments(filter)
  ]);

  return { data, total, page, limit };
}

module.exports = {
  createExam,
  listExams
};
