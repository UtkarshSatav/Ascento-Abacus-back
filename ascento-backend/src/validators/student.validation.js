const { Joi, objectId } = require('./common');

const previousMarksSchema = Joi.object({
  examName: Joi.string().allow('', null),
  percentage: Joi.number().min(0).max(100).allow(null),
  year: Joi.number().integer().min(2000).max(2100).allow(null)
});

const documentSchema = Joi.object({
  name: Joi.string().required(),
  url: Joi.string().uri().required(),
  publicId: Joi.string().allow('', null)
});

const createStudentSchema = Joi.object({
  fullName: Joi.string().trim().required(),
  dateOfBirth: Joi.date().required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  domainId: objectId.required(),
  classId: objectId.required(),
  className: Joi.string().trim().required(),
  section: Joi.string().trim().required(),
  rollNumber: Joi.string().trim().required(),
  parentName: Joi.string().trim().required(),
  parentPhone: Joi.string().min(8).max(20).required(),
  parentEmail: Joi.string().email().allow('', null),
  address: Joi.string().allow('', null),
  admissionDate: Joi.date().allow(null),
  previousSchool: Joi.string().allow('', null),
  previousMarks: Joi.array().items(previousMarksSchema).default([]),
  documents: Joi.array().items(documentSchema).default([]),
  profilePhoto: Joi.string().uri().allow('', null),
  profilePhotoBase64: Joi.string().allow('', null),
  documentUploads: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        base64: Joi.string().required()
      })
    )
    .default([])
});

const updateStudentSchema = Joi.object({
  fullName: Joi.string().trim(),
  dateOfBirth: Joi.date(),
  gender: Joi.string().valid('male', 'female', 'other'),
  domainId: objectId,
  classId: objectId,
  className: Joi.string().trim(),
  section: Joi.string().trim(),
  parentName: Joi.string().trim(),
  parentPhone: Joi.string().min(8).max(20),
  parentEmail: Joi.string().email().allow('', null),
  address: Joi.string().allow('', null),
  admissionDate: Joi.date(),
  previousSchool: Joi.string().allow('', null),
  previousMarks: Joi.array().items(previousMarksSchema),
  documents: Joi.array().items(documentSchema),
  profilePhoto: Joi.string().uri().allow('', null),
  profilePhotoBase64: Joi.string().allow('', null),
  documentUploads: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      base64: Joi.string().required()
    })
  ),
  improvementNotes: Joi.string().allow('', null)
});

module.exports = {
  createStudentSchema,
  updateStudentSchema
};
