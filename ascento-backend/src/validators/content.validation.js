const { Joi, objectId } = require('./common');

const publishContentSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().allow('', null),
  contentType: Joi.string().valid('notes', 'pdf', 'video', 'assignment', 'announcement').required(),
  domainId: objectId.required(),
  classId: objectId.required(),
  subjectId: objectId.allow(null),
  file: Joi.object({ url: Joi.string().uri().required(), publicId: Joi.string().allow('', null) }).allow(null),
  fileBase64: Joi.string().allow('', null),
  videoLink: Joi.string().uri().allow('', null)
});

const publishAnnouncementSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().allow('', null),
  domainId: objectId.required(),
  classId: objectId.required(),
  subjectId: objectId.allow(null),
  file: Joi.object({ url: Joi.string().uri().required(), publicId: Joi.string().allow('', null) }).allow(null),
  fileBase64: Joi.string().allow('', null),
  videoLink: Joi.string().uri().allow('', null)
});

module.exports = {
  publishContentSchema,
  publishAnnouncementSchema
};
