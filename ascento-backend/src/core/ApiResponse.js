'use strict';

/**
 * Standardised API response envelope.
 *
 * Usage:
 *   new ApiResponse(200, 'OK', data).send(res)
 *   new ApiResponse(201, 'Created', created).send(res)
 */
class ApiResponse {
  /**
   * @param {number} statusCode  HTTP status code
   * @param {string} message     Human-readable message
   * @param {*}      [data]      Response payload (omitted when null)
   */
  constructor(statusCode, message, data = null) {
    this.success = statusCode >= 200 && statusCode < 400;
    this.status = statusCode;
    this.message = message;
    if (data !== null && data !== undefined) {
      this.data = data;
    }
  }

  send(res) {
    return res.status(this.status).json(this);
  }
}

module.exports = ApiResponse;
