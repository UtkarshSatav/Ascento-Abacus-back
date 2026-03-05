const { Joi, objectId } = require('./common');

const createAssignmentSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().allow('', null),
  domainId: objectId.required(),
  classId: objectId.required(),
  subjectId: objectId.required(),
  teacherId: objectId,
  dueDate: Joi.date().required(),
  attachmentBase64: Joi.string().allow('', null),
  attachmentName: Joi.string().allow('', null)
});

module.exports = {
  createAssignmentSchema
};
