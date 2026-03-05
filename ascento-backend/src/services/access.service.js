const Teacher = require('../models/teacher.model');
const Parent = require('../models/parent.model');
const Student = require('../models/student.model');
const { ROLES } = require('../config/constants');

async function getTeacherByUserId(userId) {
  return Teacher.findOne({ userId });
}

async function getParentByUserId(userId) {
  return Parent.findOne({ userId });
}

async function getStudentByUserId(userId) {
  return Student.findOne({ userId });
}

function normalizeId(value) {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (value._id) return value._id.toString();
  return value.toString();
}

function classAssigned(teacher, classId) {
  const targetClassId = normalizeId(classId);
  return teacher.assignedClassIds.some((id) => normalizeId(id) === targetClassId);
}

async function ensureTeacherClassAccess(user, classId) {
  if (user.role === ROLES.ADMIN) {
    return null;
  }

  if (user.role !== ROLES.TEACHER) {
    throw { status: 403, message: 'Only teacher/admin can access this class data' };
  }

  const teacher = await getTeacherByUserId(user.userId);
  if (!teacher || !classAssigned(teacher, classId)) {
    throw { status: 403, message: 'Teacher is not assigned to this class' };
  }

  return teacher;
}

function isStudentDoc(candidate) {
  return Boolean(candidate && typeof candidate === 'object' && candidate.userId);
}

async function ensureStudentAccess(user, studentOrId) {
  const student = isStudentDoc(studentOrId)
    ? studentOrId
    : await Student.findById(normalizeId(studentOrId));

  if (!student) {
    throw { status: 404, message: 'Student not found' };
  }

  if (user.role === ROLES.ADMIN) {
    return student;
  }

  if (user.role === ROLES.TEACHER) {
    const teacher = await getTeacherByUserId(user.userId);
    if (!teacher || !classAssigned(teacher, student.classId)) {
      throw { status: 403, message: 'Teacher cannot access this student' };
    }
    return student;
  }

  if (user.role === ROLES.PARENT) {
    const parent = await getParentByUserId(user.userId);
    if (!parent || !parent.children.some((id) => normalizeId(id) === normalizeId(student._id))) {
      throw { status: 403, message: 'Parent cannot access this student' };
    }
    return student;
  }

  if (user.role === ROLES.STUDENT) {
    if (normalizeId(student.userId) !== normalizeId(user.userId)) {
      throw { status: 403, message: 'Student can only access own data' };
    }
    return student;
  }

  throw { status: 403, message: 'Forbidden' };
}

module.exports = {
  getTeacherByUserId,
  getParentByUserId,
  getStudentByUserId,
  ensureTeacherClassAccess,
  ensureStudentAccess
};
