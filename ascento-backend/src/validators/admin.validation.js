const { Joi, objectId } = require('./common');

const assignTeacherSchema = Joi.object({
  teacherId: objectId.required(),
  classId: objectId,
  subjectId: objectId
}).or('classId', 'subjectId');

module.exports = {
  assignTeacherSchema
};
