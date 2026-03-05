const Assignment = require('../models/assignment.model');
const Student = require('../models/student.model');
const { parsePagination } = require('../utils/pagination');
const { ROLES } = require('../config/constants');
const { uploadBase64 } = require('../utils/cloudinary');
const {
  ensureTeacherClassAccess,
  ensureStudentAccess
} = require('./access.service');

async function createAssignment(payload, user) {
  let teacherId = payload.teacherId || null;

  if (user.role === ROLES.TEACHER) {
    const teacher = await ensureTeacherClassAccess(user, payload.classId);
    teacherId = teacher._id;
  }

  if (!teacherId) {
    throw { status: 400, message: 'teacherId is required for assignment' };
  }

  const attachments = [];
  if (payload.attachmentBase64) {
    const upload = await uploadBase64(payload.attachmentBase64, 'school-erp/assignments');
    attachments.push({
      name: payload.attachmentName || payload.title,
      url: upload.url,
      publicId: upload.publicId
    });
  }

  return Assignment.create({
    title: payload.title,
    description: payload.description,
    domainId: payload.domainId,
    classId: payload.classId,
    subjectId: payload.subjectId,
    teacherId,
    dueDate: payload.dueDate,
    attachments
  });
}

async function assignmentsByClass(classId, query, user) {
  if (user.role === ROLES.TEACHER) {
    await ensureTeacherClassAccess(user, classId);
  }

  const { page, limit, skip } = parsePagination(query);

  const [data, total] = await Promise.all([
    Assignment.find({ classId })
      .populate('teacherId', 'name email')
      .populate('subjectId', 'name code')
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(limit),
    Assignment.countDocuments({ classId })
  ]);

  return { data, total, page, limit };
}

async function assignmentsByStudent(studentId, query, user) {
  const student = await Student.findById(studentId);
  await ensureStudentAccess(user, student);

  const { page, limit, skip } = parsePagination(query);
  const [data, total] = await Promise.all([
    Assignment.find({ classId: student.classId })
      .populate('teacherId', 'name email')
      .populate('subjectId', 'name code')
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(limit),
    Assignment.countDocuments({ classId: student.classId })
  ]);

  return { data, total, page, limit };
}

module.exports = {
  createAssignment,
  assignmentsByClass,
  assignmentsByStudent
};
