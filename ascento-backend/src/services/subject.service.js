const Subject = require('../models/subject.model');
const Domain = require('../models/domain.model');
const ClassModel = require('../models/class.model');
const Teacher = require('../models/teacher.model');
const { parsePagination } = require('../utils/pagination');

async function createSubject(payload) {
  const [domain, classDoc] = await Promise.all([
    Domain.findById(payload.domainId),
    ClassModel.findById(payload.classId)
  ]);

  if (!domain) throw { status: 404, message: 'Domain not found' };
  if (!classDoc) throw { status: 404, message: 'Class not found' };

  if (classDoc.domainId.toString() !== domain._id.toString()) {
    throw { status: 400, message: 'Class does not belong to selected domain' };
  }

  return Subject.create(payload);
}

async function listSubjects(query) {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.domainId) filter.domainId = query.domainId;
  if (query.classId) filter.classId = query.classId;
  if (query.name) filter.name = new RegExp(query.name, 'i');

  const [data, total] = await Promise.all([
    Subject.find(filter)
      .populate('domainId', 'name code')
      .populate('classId', 'className section')
      .populate('teacherId', 'name email')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit),
    Subject.countDocuments(filter)
  ]);

  return { data, total, page, limit };
}

async function assignTeacherToSubject(subjectId, teacherId) {
  const [subject, teacher] = await Promise.all([
    Subject.findById(subjectId),
    Teacher.findById(teacherId)
  ]);

  if (!subject) throw { status: 404, message: 'Subject not found' };
  if (!teacher) throw { status: 404, message: 'Teacher not found' };

  subject.teacherId = teacher._id;
  await subject.save();

  await Teacher.findByIdAndUpdate(teacher._id, {
    $addToSet: {
      subjectIds: subject._id,
      assignedClassIds: subject.classId,
      domainIds: subject.domainId
    }
  });

  return subject;
}

module.exports = {
  createSubject,
  listSubjects,
  assignTeacherToSubject
};
