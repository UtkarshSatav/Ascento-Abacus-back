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

const applyStudentAdmissionSchema = Joi.object({
  studentFullName: Joi.string().trim().required(),
  dateOfBirth: Joi.date().required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  academicYear: Joi.string().trim().allow('', null),
  bloodGroup: Joi.string().trim().allow('', null),
  domainId: objectId.required(),
  classId: objectId.allow(null),
  parentName: Joi.string().trim().required(),
  guardianRelation: Joi.string().trim().allow('', null),
  parentPhone: Joi.string().min(8).max(20).required(),
  alternatePhone: Joi.string().min(8).max(20).allow('', null),
  parentEmail: Joi.string().email().allow('', null),
  occupation: Joi.string().allow('', null),
  annualIncome: Joi.number().min(0).allow(null),
  address: Joi.string().allow('', null),
  previousSchool: Joi.string().allow('', null),
  previousMarks: Joi.array().items(previousMarksSchema).default([]),
  documents: Joi.array().items(documentSchema).default([]),
  profilePhoto: Joi.object({
    url: Joi.string().uri().required(),
    publicId: Joi.string().allow('', null)
  }).allow(null),
  profilePhotoBase64: Joi.string().allow('', null),
  documentUploads: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        base64: Joi.string().required()
      })
    )
    .default([]),
  medicalNotes: Joi.string().allow('', null),
  note: Joi.string().allow('', null)
});

const approveStudentApplicationSchema = Joi.object({
  classId: objectId.required(),
  rollNumber: Joi.string().trim().required(),
  domainId: objectId.allow(null),
  admissionDate: Joi.date().allow(null),
  remark: Joi.string().allow('', null)
});

module.exports = {
  applyStudentAdmissionSchema,
  approveStudentApplicationSchema
};
