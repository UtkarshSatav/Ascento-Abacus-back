const ClassModel = require('../models/class.model');
const StudentAdmission = require('../models/studentAdmission.model');
const { uploadBase64 } = require('../utils/cloudinary');
const { parsePagination } = require('../utils/pagination');
const { generateUniquePublicId } = require('../utils/public-id');
const studentService = require('./student.service');

async function buildUploadedDocuments(documentUploads) {
  if (!documentUploads || !documentUploads.length) return [];

  const uploads = [];
  for (const item of documentUploads) {
    const result = await uploadBase64(item.base64, 'school-erp/student-admissions/documents');
    uploads.push({
      name: item.name,
      url: result.url,
      publicId: result.publicId
    });
  }

  return uploads;
}

async function applyAdmission(payload) {
  const parentEmail = payload.parentEmail ? payload.parentEmail.toLowerCase() : undefined;

  const duplicateFilter = {
    studentFullName: payload.studentFullName,
    status: { $in: ['pending', 'approved'] },
    $or: [{ parentPhone: payload.parentPhone }]
  };

  if (parentEmail) {
    duplicateFilter.$or.push({ parentEmail });
  }

  const duplicate = await StudentAdmission.findOne(duplicateFilter);
  if (duplicate) {
    throw { status: 409, message: 'Admission application already exists for this student/parent contact' };
  }

  let profilePhoto = payload.profilePhoto || null;
  if (payload.profilePhotoBase64) {
    const upload = await uploadBase64(
      payload.profilePhotoBase64,
      'school-erp/student-admissions/profile'
    );
    profilePhoto = {
      url: upload.url,
      publicId: upload.publicId
    };
  }

  const uploadedDocuments = await buildUploadedDocuments(payload.documentUploads);
  const applicationCode = await generateUniquePublicId('ADM', StudentAdmission, 'applicationCode');

  return StudentAdmission.create({
    applicationCode,
    studentFullName: payload.studentFullName,
    dateOfBirth: payload.dateOfBirth,
    gender: payload.gender,
    academicYear: payload.academicYear,
    bloodGroup: payload.bloodGroup,
    domainId: payload.domainId,
    classId: payload.classId || null,
    parentName: payload.parentName,
    guardianRelation: payload.guardianRelation,
    parentPhone: payload.parentPhone,
    alternatePhone: payload.alternatePhone,
    parentEmail,
    occupation: payload.occupation,
    annualIncome: payload.annualIncome,
    address: payload.address,
    previousSchool: payload.previousSchool,
    previousMarks: payload.previousMarks || [],
    documents: [...(payload.documents || []), ...uploadedDocuments],
    profilePhoto,
    medicalNotes: payload.medicalNotes,
    note: payload.note,
    status: 'pending'
  });
}

async function listAdmissionApplications(query) {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.domainId) filter.domainId = query.domainId;
  if (query.classId) filter.classId = query.classId;
  if (query.search) {
    filter.$or = [
      { applicationCode: new RegExp(query.search, 'i') },
      { studentFullName: new RegExp(query.search, 'i') },
      { parentName: new RegExp(query.search, 'i') },
      { parentPhone: new RegExp(query.search, 'i') },
      { parentEmail: new RegExp(query.search, 'i') }
    ];
  }

  const [data, total] = await Promise.all([
    StudentAdmission.find(filter)
      .populate('domainId', 'name code')
      .populate('classId', 'className section')
      .populate('approvedClassId', 'className section')
      .populate('reviewedBy', 'fullName email')
      .populate('createdStudentId', 'fullName rollNumber studentCode')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    StudentAdmission.countDocuments(filter)
  ]);

  return { data, total, page, limit };
}

async function approveAdmissionApplication(applicationId, adminUserId, payload) {
  const application = await StudentAdmission.findById(applicationId);
  if (!application) {
    throw { status: 404, message: 'Student admission application not found' };
  }

  if (application.status !== 'pending') {
    throw { status: 400, message: 'Only pending applications can be approved' };
  }

  const classDoc = await ClassModel.findById(payload.classId);
  if (!classDoc) {
    throw { status: 404, message: 'Class not found' };
  }

  const domainId = payload.domainId || application.domainId || classDoc.domainId;
  if (classDoc.domainId.toString() !== domainId.toString()) {
    throw { status: 400, message: 'Selected class does not belong to the selected domain' };
  }

  const created = await studentService.createStudent({
    fullName: application.studentFullName,
    dateOfBirth: application.dateOfBirth,
    gender: application.gender,
    domainId,
    classId: classDoc._id,
    className: classDoc.className,
    section: classDoc.section || 'A',
    rollNumber: payload.rollNumber,
    parentName: application.parentName,
    parentPhone: application.parentPhone,
    parentEmail: application.parentEmail,
    address: application.address,
    admissionDate: payload.admissionDate || new Date(),
    previousSchool: application.previousSchool,
    previousMarks: application.previousMarks || [],
    documents: application.documents || [],
    profilePhoto: application.profilePhoto && application.profilePhoto.url
      ? application.profilePhoto.url
      : undefined
  });

  application.status = 'approved';
  application.reviewedBy = adminUserId;
  application.reviewRemark = payload.remark || 'Approved by admin';
  application.createdStudentId = created.student._id;
  application.approvedClassId = classDoc._id;
  application.approvedRollNumber = created.student.rollNumber;
  await application.save();

  return {
    application,
    student: created.student,
    studentCredentials: created.studentCredentials,
    parentCredentials: created.parentCredentials
  };
}

async function rejectAdmissionApplication(applicationId, adminUserId, remark) {
  const application = await StudentAdmission.findById(applicationId);
  if (!application) {
    throw { status: 404, message: 'Student admission application not found' };
  }

  if (application.status !== 'pending') {
    throw { status: 400, message: 'Only pending applications can be rejected' };
  }

  application.status = 'rejected';
  application.reviewedBy = adminUserId;
  application.reviewRemark = remark || 'Rejected by admin';
  await application.save();

  return application;
}

module.exports = {
  applyAdmission,
  listAdmissionApplications,
  approveAdmissionApplication,
  rejectAdmissionApplication
};
