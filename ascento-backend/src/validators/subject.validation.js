const { Joi, objectId } = require('./common');

const createSubjectSchema = Joi.object({
  domainId: objectId.required(),
  classId: objectId.required(),
  name: Joi.string().trim().required(),
  code: Joi.string().trim().allow('', null)
});

const assignTeacherSubjectSchema = Joi.object({
  teacherId: objectId.required()
});

module.exports = {
  createSubjectSchema,
  assignTeacherSubjectSchema
};
