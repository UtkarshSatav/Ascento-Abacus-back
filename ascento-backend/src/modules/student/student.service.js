'use strict';

const crypto = require('crypto');
const AppError = require('../../core/AppError');
const Domain = require('../../models/domain.model');
const Session = require('../../models/Session.model');
const Student = require('../../models/student.model');

const studentPopulate = {
  path: 'domainId',
};

const ensureDomainExists = async (domainId) => {
  const domain = await Domain.findById(domainId);
  if (!domain) {
    throw new AppError('Domain not found.', 404);
  }
  return domain;
};

const sanitiseStudent = (student) => {
  const obj = student.toObject ? student.toObject() : { ...student };
  delete obj.password;
  return obj;
};

const normalizeStudentPayload = (payload) => {
  const normalized = { ...payload };

  if (!normalized.dateOfBirth && normalized.dob) {
    normalized.dateOfBirth = normalized.dob;
  }

  delete normalized.dob;

  if (normalized.age !== undefined) {
    const numericAge = Number(normalized.age);
    if (!Number.isInteger(numericAge) || numericAge < 1 || numericAge > 120) {
      throw new AppError('age must be an integer between 1 and 120.', 400);
    }

    normalized.age = numericAge;
  }

  return normalized;
};

const create = async (data, adminId) => {
  const normalizedData = normalizeStudentPayload(data);
  await ensureDomainExists(normalizedData.domainId);

  // Student onboarding always starts with a temporary password.
  const tempPassword = `Stu@${crypto.randomBytes(4).toString('hex')}`;
  const student = await Student.create({
    ...normalizedData,
    password: tempPassword,
    parentEmail: normalizedData.parentEmail.toLowerCase().trim(),
    isPasswordTemporary: true,
    createdBy: adminId,
    updatedBy: adminId,
  });

  const createdStudent = await Student.findById(student._id)
    .select('-password')
    .populate(studentPopulate);

  return {
    student: sanitiseStudent(createdStudent),
    studentLoginEmail: createdStudent.parentEmail,
    temporaryPassword: tempPassword,
  };
};

const changePassword = async (studentId, { currentPassword, newPassword }) => {
  if (!currentPassword || !newPassword) {
    throw new AppError('currentPassword and newPassword are required.', 400);
  }

  if (currentPassword === newPassword) {
    throw new AppError('New password must be different from the current password.', 400);
  }

  if (newPassword.length < 6) {
    throw new AppError('New password must be at least 6 characters.', 400);
  }

  const student = await Student.findById(studentId).select('+password');
  if (!student) {
    throw new AppError('Student not found.', 404);
  }

  const isMatch = await student.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect.', 401);
  }

  student.password = newPassword;
  student.isPasswordTemporary = false;
  student.updatedBy = student._id;
  await student.save();

  return sanitiseStudent(student);
};

const list = async ({ page = 1, limit = 20, domainId, status, search } = {}) => {
  const numericPage = Math.max(Number(page) || 1, 1);
  const numericLimit = Math.max(Number(limit) || 20, 1);
  const filter = {};

  if (domainId) {
    filter.domainId = domainId;
  }

  if (status) {
    filter.status = status;
  }

  if (search) {
    const value = search.trim();
    filter.$or = [
      { fullName: { $regex: value, $options: 'i' } },
      { parentName: { $regex: value, $options: 'i' } },
      { parentEmail: { $regex: value, $options: 'i' } },
      { rollNumber: { $regex: value, $options: 'i' } },
    ];
  }

  const skip = (numericPage - 1) * numericLimit;
  const [data, total] = await Promise.all([
    Student.find(filter)
      .select('-password')
      .populate(studentPopulate)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(numericLimit),
    Student.countDocuments(filter),
  ]);

  return {
    data: data.map(sanitiseStudent),
    total,
    page: numericPage,
    limit: numericLimit,
  };
};

const getById = async (id) => {
  const student = await Student.findById(id)
    .select('-password')
    .populate(studentPopulate);

  if (!student) {
    throw new AppError('Student not found.', 404);
  }

  return sanitiseStudent(student);
};

const update = async (id, data, adminId) => {
  const updateData = { ...normalizeStudentPayload(data), updatedBy: adminId };

  delete updateData.password;
  delete updateData.sessionKey;
  delete updateData.role;
  delete updateData.rollNumber;

  if (updateData.parentEmail) {
    updateData.parentEmail = updateData.parentEmail.toLowerCase().trim();
  }

  if (updateData.domainId) {
    await ensureDomainExists(updateData.domainId);
  }

  const student = await Student.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true },
  )
    .select('-password')
    .populate(studentPopulate);

  if (!student) {
    throw new AppError('Student not found.', 404);
  }

  if (student.status === 'inactive') {
    await Session.updateMany(
      { userId: student._id, userModel: 'Student', isActive: true },
      { isActive: false },
    );
    await Student.findByIdAndUpdate(student._id, { sessionKey: null });
    student.sessionKey = null;
  }

  return sanitiseStudent(student);
};

const remove = async (id) => {
  const student = await Student.findByIdAndDelete(id).select('-password');

  if (!student) {
    throw new AppError('Student not found.', 404);
  }

  await Session.deleteMany({ userId: student._id, userModel: 'Student' });
};

module.exports = { create, list, getById, update, remove, changePassword };