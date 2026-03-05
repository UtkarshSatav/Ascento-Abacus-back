const domainService = require('../services/domain.service');
const asyncHandler = require('../utils/async-handler');

const createDomain = asyncHandler(async (req, res) => {
  const data = await domainService.createDomain(req.body);
  res.status(201).json(data);
});

const listDomains = asyncHandler(async (req, res) => {
  const data = await domainService.listDomains();
  res.json(data);
});

module.exports = {
  createDomain,
  listDomains
};
