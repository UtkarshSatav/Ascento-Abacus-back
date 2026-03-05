const { Joi } = require('./common');

const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const teacherLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const studentLoginSchema = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().min(6).required()
});

const parentLoginSchema = Joi.object({
  phone: Joi.string().min(8).max(20),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  otp: Joi.string().length(6)
})
  .or('phone', 'email')
  .or('password', 'otp');

const parentOtpRequestSchema = Joi.object({
  phone: Joi.string().min(8).max(20),
  email: Joi.string().email()
}).or('phone', 'email');

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});

module.exports = {
  adminLoginSchema,
  teacherLoginSchema,
  studentLoginSchema,
  parentLoginSchema,
  parentOtpRequestSchema,
  refreshTokenSchema
};
