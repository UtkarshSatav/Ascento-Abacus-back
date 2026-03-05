const { Joi, objectId } = require('./common');

const createClassSchema = Joi.object({
  domainId: objectId.required(),
  className: Joi.string().trim().required(),
  standardNumber: Joi.number().integer().min(1).max(12).allow(null),
  section: Joi.string().trim().default('A')
});

const assignTeacherClassSchema = Joi.object({
  teacherId: objectId.required()
});

module.exports = {
  createClassSchema,
  assignTeacherClassSchema
};
