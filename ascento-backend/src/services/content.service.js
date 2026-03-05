const Content = require('../models/content.model');
const { parsePagination } = require('../utils/pagination');
const { uploadBase64 } = require('../utils/cloudinary');
const { ensureTeacherClassAccess, getTeacherByUserId, getStudentByUserId } = require('./access.service');

async function publishContent(payload, user) {
  const teacher = await ensureTeacherClassAccess(user, payload.classId);

  const file = payload.file || {};
  if (payload.fileBase64) {
    const upload = await uploadBase64(payload.fileBase64, 'school-erp/content');
    file.url = upload.url;
    file.publicId = upload.publicId;
  }

  return Content.create({
    title: payload.title,
    description: payload.description,
    contentType: payload.contentType,
    domainId: payload.domainId,
    classId: payload.classId,
    subjectId: payload.subjectId || null,
    file,
    videoLink: payload.videoLink,
    teacherId: teacher._id,
    isPublished: true
  });
}

async function publishAnnouncement(payload, user) {
  return publishContent(
    {
      ...payload,
      contentType: 'announcement',
      subjectId: payload.subjectId || null
    },
    user
  );
}

async function studentContent(user, query) {
  const student = await getStudentByUserId(user.userId);
  if (!student) throw { status: 404, message: 'Student profile not found' };

  const { page, limit, skip } = parsePagination(query);
  const filter = {
    domainId: student.domainId,
    classId: student.classId,
    isPublished: true
  };

  if (query.contentType) filter.contentType = query.contentType;
  if (query.subjectId) filter.subjectId = query.subjectId;
  if (query.search) {
    filter.$or = [
      { title: new RegExp(query.search, 'i') },
      { description: new RegExp(query.search, 'i') }
    ];
  }

  const [data, total] = await Promise.all([
    Content.find(filter)
      .populate('teacherId', 'name email')
      .populate('subjectId', 'name code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Content.countDocuments(filter)
  ]);

  return { data, total, page, limit };
}

module.exports = {
  publishContent,
  publishAnnouncement,
  studentContent
};
