'use strict';

/**
 * Operational application error.
 * Only instances of AppError are treated as expected/safe errors;
 * all other Error instances are treated as programmer mistakes.
 */
class AppError extends Error {
  /**
   * @param {string} message     Human-readable error message
   * @param {number} statusCode  HTTP status code (default 500)
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
