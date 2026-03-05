const Domain = require('../models/domain.model');
const ClassModel = require('../models/class.model');
const Teacher = require('../models/teacher.model');
const { parsePagination } = require('../utils/pagination');

async function createClass(payload) {
  const domain = await Domain.findById(payload.domainId);
  if (!domain) {
    throw { status: 404, message: 'Domain not found' };
  }

  if (domain.code === 'GENERIC_SCHOOL') {
    if (!payload.standardNumber || payload.standardNumber < 1 || payload.standardNumber > 12) {
      throw { status: 400, message: 'Generic School supports Class 1 to Class 12 only' };
    }
  }

  return ClassModel.create(payload);
}

async function listClasses(query) {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.domainId) filter.domainId = query.domainId;
  if (query.className) filter.className = new RegExp(query.className, 'i');
  if (query.section) filter.section = query.section;

  const [data, total] = await Promise.all([
    ClassModel.find(filter)
      .populate('domainId', 'name code')
      .populate('homeroomTeacherId', 'name email')
      .sort({ className: 1, section: 1 })
      .skip(skip)
      .limit(limit),
    ClassModel.countDocuments(filter)
  ]);

  return { data, total, page, limit };
}

async function assignTeacherToClass(classId, teacherId) {
  const [classDoc, teacher] = await Promise.all([
    ClassModel.findById(classId),
    Teacher.findById(teacherId)
  ]);

  if (!classDoc) throw { status: 404, message: 'Class not found' };
  if (!teacher) throw { status: 404, message: 'Teacher not found' };

  classDoc.homeroomTeacherId = teacher._id;
  await classDoc.save();

  await Teacher.findByIdAndUpdate(teacher._id, {
    $addToSet: { assignedClassIds: classDoc._id }
  });

  return classDoc;
}

module.exports = {
  createClass,
  listClasses,
  assignTeacherToClass
};
