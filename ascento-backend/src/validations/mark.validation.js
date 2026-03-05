const { Joi, objectId } = require('./common');

const createMarkSchema = Joi.object({
  examId: objectId.required(),
  studentId: objectId.required(),
  subjectId: objectId.required(),
  obtainedMarks: Joi.number().min(0).required(),
  totalMarks: Joi.number().min(1).required()
});

module.exports = {
  createMarkSchema
};
