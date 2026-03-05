const { Joi } = require('./common');

const createDomainSchema = Joi.object({
  name: Joi.string().trim().required(),
  code: Joi.string().valid('VEDIC_MATH', 'ABACUS', 'GENERIC_SCHOOL').required(),
  description: Joi.string().allow('', null)
});

module.exports = {
  createDomainSchema
};
