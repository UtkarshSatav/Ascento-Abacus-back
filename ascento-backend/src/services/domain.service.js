const Domain = require('../models/domain.model');

async function createDomain(payload) {
  const name = String(payload.name || '').trim();
  const code = String(payload.code || '')
    .trim()
    .toUpperCase();

  const exists = await Domain.findOne({ $or: [{ name }, { code }] });
  if (exists) {
    throw { status: 409, message: 'Domain already exists' };
  }

  return Domain.create({
    ...payload,
    name,
    code
  });
}

async function listDomains() {
  return Domain.find().sort({ createdAt: 1 });
}

module.exports = {
  createDomain,
  listDomains
};
