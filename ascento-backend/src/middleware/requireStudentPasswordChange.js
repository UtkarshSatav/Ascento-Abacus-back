'use strict';

const AppError = require('../core/AppError');

const requireStudentPasswordChange = (req, res, next) => {
  if (!req.user || req.user.role !== 'student') {
    return next();
  }

  if (req.user.isPasswordTemporary) {
    return next(new AppError('Password change required before accessing student resources.', 403));
  }

  return next();
};

module.exports = requireStudentPasswordChange;
