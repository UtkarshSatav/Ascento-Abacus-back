const { Joi, objectId } = require('./common');

const scheduleOnlineClassSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().allow('', null),
  domainId: objectId.required(),
  classId: objectId.required(),
  subjectId: objectId.allow(null),
  date: Joi.date().required(),
  startTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  endTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  meetingLink: Joi.string().uri().required()
});

module.exports = {
  scheduleOnlineClassSchema
};
