const Domain = require('../models/domain.model');

async function createDomain(payload) {
  const exists = await Domain.findOne({ $or: [{ name: payload.name }, { code: payload.code }] });
  if (exists) {
    throw { status: 409, message: 'Domain already exists' };
  }

  return Domain.create(payload);
}

async function listDomains() {
  return Domain.find().sort({ createdAt: 1 });
}

module.exports = {
  createDomain,
  listDomains
};
