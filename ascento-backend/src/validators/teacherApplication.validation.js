const { Joi, objectId } = require('./common');

const teacherApplySchema = Joi.object({
  fullName: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(8).max(20).required(),
  qualification: Joi.string().allow('', null),
  experience: Joi.number().min(0).default(0),
  subjects: Joi.array().items(Joi.string()).default([]),
  domainId: objectId.allow(null),
  resume: Joi.object({ url: Joi.string().uri().required(), publicId: Joi.string().allow('', null) }).allow(null),
  profilePhoto: Joi.object({ url: Joi.string().uri().required(), publicId: Joi.string().allow('', null) }).allow(null),
  resumeBase64: Joi.string().allow('', null),
  profilePhotoBase64: Joi.string().allow('', null)
});

const rejectApplicationSchema = Joi.object({
  remark: Joi.string().allow('', null)
});

module.exports = {
  teacherApplySchema,
  rejectApplicationSchema
};
