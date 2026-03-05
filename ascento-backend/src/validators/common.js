const Joi = require('joi');

const objectId = Joi.string()
  .pattern(/^[a-fA-F0-9]{24}$/)
  .message('Invalid ObjectId');

module.exports = {
  Joi,
  objectId
};
