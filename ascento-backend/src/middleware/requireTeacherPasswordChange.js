'use strict';

const AppError = require('../core/AppError');

const requireTeacherPasswordChange = (req, res, next) => {
  if (!req.user || req.user.role !== 'teacher') {
    return next();
  }

  if (req.user.mustChangePassword || req.user.isPasswordTemporary) {
    return next(new AppError('Password change required before accessing teacher resources.', 403));
  }

  return next();
};

module.exports = requireTeacherPasswordChange;