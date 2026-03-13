const { Joi } = require('./common');

const createDomainSchema = Joi.object({
  name: Joi.string().trim().required(),
  code: Joi.string().trim().uppercase().pattern(/^[A-Z0-9_]{2,50}$/).required(),
  description: Joi.string().allow('', null)
});

module.exports = {
  createDomainSchema
};
