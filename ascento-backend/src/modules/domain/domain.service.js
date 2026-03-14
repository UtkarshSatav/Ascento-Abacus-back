'use strict';

const AppError = require('../../core/AppError');
const Domain = require('../../models/domain.model.js');

// ─── Create ───────────────────────────────────────────────────────────────────

const create = async (data, adminId) => {
  const domain = await Domain.create({
    ...data,
    createdBy: adminId,
    updatedBy: adminId,
  });
  return domain;
};

// ─── List ─────────────────────────────────────────────────────────────────────

const list = async ({ page = 1, limit = 20, status } = {}) => {
  const filter = {};
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Domain.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Domain.countDocuments(filter),
  ]);

  return { data, total, page: Number(page), limit: Number(limit) };
};

// ─── Get by ID ────────────────────────────────────────────────────────────────

const getById = async (id) => {
  const domain = await Domain.findById(id);
  if (!domain) throw new AppError('Domain not found.', 404);
  return domain;
};

// ─── Update ───────────────────────────────────────────────────────────────────

const update = async (id, data, adminId) => {
  const domain = await Domain.findByIdAndUpdate(
    id,
    { ...data, updatedBy: adminId },
    { new: true, runValidators: true },
  );
  if (!domain) throw new AppError('Domain not found.', 404);
  return domain;
};

// ─── Delete ───────────────────────────────────────────────────────────────────

const remove = async (id) => {
  const domain = await Domain.findByIdAndDelete(id);
  if (!domain) throw new AppError('Domain not found.', 404);
};

module.exports = { create, list, getById, update, remove };
