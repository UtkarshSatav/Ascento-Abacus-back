'use strict';

const AppError = require('../../core/AppError');
const AcademicYear = require('../../models/AcademicYear.model');

const normalizeDate = (value, fieldName) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError(`${fieldName} must be a valid date.`, 400);
  }

  parsedDate.setUTCHours(0, 0, 0, 0);
  return parsedDate;
};

const validateDateRange = (startDate, endDate) => {
  if (startDate >= endDate) {
    throw new AppError('endDate must be later than startDate.', 400);
  }
};

const deactivateOtherAcademicYears = async (excludeId, adminId) => {
  const filter = { status: 'active' };
  if (excludeId) {
    filter._id = { $ne: excludeId };
  }

  await AcademicYear.updateMany(filter, {
    status: 'inactive',
    updatedBy: adminId,
  });
};

const create = async (data, adminId) => {
  const startDate = normalizeDate(data.startDate, 'startDate');
  const endDate = normalizeDate(data.endDate, 'endDate');
  validateDateRange(startDate, endDate);

  const academicYear = await AcademicYear.create({
    ...data,
    startDate,
    endDate,
    createdBy: adminId,
    updatedBy: adminId,
  });

  if (academicYear.status === 'active') {
    await deactivateOtherAcademicYears(academicYear._id, adminId);
  }

  return academicYear;
};

const list = async ({ page = 1, limit = 20, status } = {}) => {
  const numericPage = Math.max(Number(page) || 1, 1);
  const numericLimit = Math.max(Number(limit) || 20, 1);
  const filter = {};

  if (status) {
    filter.status = status;
  }

  const skip = (numericPage - 1) * numericLimit;
  const [data, total] = await Promise.all([
    AcademicYear.find(filter).sort({ startDate: -1, createdAt: -1 }).skip(skip).limit(numericLimit),
    AcademicYear.countDocuments(filter),
  ]);

  return { data, total, page: numericPage, limit: numericLimit };
};

const getById = async (id) => {
  const academicYear = await AcademicYear.findById(id);
  if (!academicYear) {
    throw new AppError('Academic year not found.', 404);
  }

  return academicYear;
};

const getActive = async () => {
  const academicYear = await AcademicYear.findOne({ status: 'active' })
    .select('_id name startDate endDate status')
    .sort({ startDate: -1, createdAt: -1 });

  if (!academicYear) {
    throw new AppError('No active academic year found.', 404);
  }

  return academicYear;
};

const update = async (id, data, adminId) => {
  const existing = await AcademicYear.findById(id);
  if (!existing) {
    throw new AppError('Academic year not found.', 404);
  }

  const startDate = data.startDate ? normalizeDate(data.startDate, 'startDate') : existing.startDate;
  const endDate = data.endDate ? normalizeDate(data.endDate, 'endDate') : existing.endDate;
  validateDateRange(startDate, endDate);

  const academicYear = await AcademicYear.findByIdAndUpdate(
    id,
    {
      ...data,
      startDate,
      endDate,
      updatedBy: adminId,
    },
    { new: true, runValidators: true },
  );

  if (academicYear.status === 'active') {
    await deactivateOtherAcademicYears(academicYear._id, adminId);
  }

  return academicYear;
};

const remove = async (id) => {
  const academicYear = await AcademicYear.findByIdAndDelete(id);
  if (!academicYear) {
    throw new AppError('Academic year not found.', 404);
  }
};

module.exports = { create, list, getById, getActive, update, remove };