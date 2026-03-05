const { Joi, objectId } = require('./common');

const createExamSchema = Joi.object({
  name: Joi.string().trim().required(),
  examType: Joi.string().valid('UNIT_TEST', 'MID_TERM', 'FINAL_EXAM').required(),
  domainId: objectId.required(),
  classId: objectId.required(),
  section: Joi.string().allow('', null),
  examDate: Joi.date().required()
});

module.exports = {
  createExamSchema
};
