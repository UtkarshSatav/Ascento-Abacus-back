const { Joi, objectId } = require('./common');

const markAttendanceSchema = Joi.object({
  date: Joi.date().required(),
  classId: objectId.required(),
  note: Joi.string().allow('', null),
  records: Joi.array()
    .items(
      Joi.object({
        studentId: objectId.required(),
        status: Joi.string().valid('present', 'absent', 'late').required()
      })
    )
    .min(1)
    .required()
});

module.exports = {
  markAttendanceSchema
};
