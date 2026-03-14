'use strict';

/**
 * Wraps an async route handler so that any rejected promise is
 * forwarded to Express's next(err) error pipeline automatically.
 *
 * @param {Function} fn  Async (req, res, next) handler
 * @returns {Function}   Standard Express middleware
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
