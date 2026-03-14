'use strict';

const AppError = require('../core/AppError');
const logger = require('../utils/logger');
const env = require('../config/env');

// ─── Mongoose / driver error mappers ────────────────────────────────────────

const handleCastError = (err) =>
  new AppError(`Invalid value for field '${err.path}': ${err.value}`, 400);

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || 'field';
  return new AppError(`Duplicate value: '${err.keyValue[field]}' already exists for ${field}`, 409);
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors)
    .map((e) => e.message)
    .join('. ');
  return new AppError(messages, 400);
};

// ─── JWT error mappers ───────────────────────────────────────────────────────

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Token expired. Please log in again.', 401);

// ─── Central error handler ───────────────────────────────────────────────────

/**
 * Express four-argument error-handling middleware.
 * Must be registered LAST via app.use(errorHandler).
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  let error = err;

  if (err.name === 'CastError') error = handleCastError(err);
  else if (err.code === 11000) error = handleDuplicateKeyError(err);
  else if (err.name === 'ValidationError') error = handleValidationError(err);
  else if (err.name === 'JsonWebTokenError') error = handleJWTError();
  else if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  const statusCode = error.statusCode || 500;
  const isOperational = Boolean(error.isOperational);
  const message = isOperational ? error.message : 'An unexpected error occurred';

  // Only log 5xx errors as errors; 4xx are operational and expected
  if (statusCode >= 500) {
    logger.error(err.stack || err.message);
  }

  const body = {
    success: false,
    status: statusCode,
    message,
  };

  // Expose stack trace in development for non-operational errors
  if (env.NODE_ENV === 'development' && !isOperational) {
    body.stack = err.stack;
  }

  return res.status(statusCode).json(body);
};

module.exports = errorHandler;
