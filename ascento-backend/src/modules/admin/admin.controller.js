'use strict';

const adminService = require('./admin.service');
const ApiResponse = require('../../core/ApiResponse');
const asyncHandler = require('../../core/asyncHandler');
const AppError = require('../../core/AppError');

// ─── POST /api/auth/admin/login ───────────────────────────────────────────────

/**
 * Body: { email, password }
 * Response: { sessionKey, expiresAt, adminProfile }
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('email and password are required.', 400);
  }

  const ipAddress = req.ip || req.headers['x-forwarded-for'] || null;
  const userAgent = req.headers['user-agent'] || null;

  const result = await adminService.login({ email, password }, { ipAddress, userAgent });

  return new ApiResponse(200, 'Admin login successful', result).send(res);
});

// ─── POST /api/auth/admin/logout ──────────────────────────────────────────────

/**
 * Header: x-session-key
 * Invalidates the current admin session.
 */
const logout = asyncHandler(async (req, res) => {
  await adminService.logout(req.sessionKey);
  return new ApiResponse(200, 'Logged out successfully').send(res);
});

// ─── GET /api/admin/profile ───────────────────────────────────────────────────

/**
 * Header: x-session-key
 * Returns the full admin profile; password field is never included.
 */
const getProfile = asyncHandler(async (req, res) => {
  const profile = await adminService.getProfile(req.user._id);
  return new ApiResponse(200, 'Admin profile', profile).send(res);
});

// ─── PUT /api/admin/change-password ──────────────────────────────────────────

/**
 * Header: x-session-key
 * Body:   { currentPassword, newPassword }
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  await adminService.changePassword(req.user._id, { currentPassword, newPassword });

  return new ApiResponse(200, 'Password changed successfully').send(res);
});

module.exports = { login, logout, getProfile, changePassword };
