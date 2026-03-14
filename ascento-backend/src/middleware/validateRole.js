'use strict';

const AppError = require('../core/AppError');

/**
 * validateRole — Role-based access control middleware factory.
 *
 * Must be used AFTER validateSession so that req.user is populated.
 *
 * @param {...string} roles  One or more allowed roles
 *
 * Usage:
 *   router.get('/admin-only', validateSession, validateRole('admin'), handler)
 *   router.get('/staff',      validateSession, validateRole('admin', 'teacher'), handler)
 */
const validateRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(
      new AppError(
        `Access denied. Allowed role(s): ${roles.join(', ')}`,
        403,
      ),
    );
  }

  return next();
};

module.exports = validateRole;
