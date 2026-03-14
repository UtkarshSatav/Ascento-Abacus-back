'use strict';

const express = require('express');
const controller = require('./auth.controller');
const validateSession = require('../middleware/validateSession');
const validateRole = require('../middleware/validateRole');

const router = express.Router();

// ── Public ────────────────────────────────────────────────────────────────────

// POST /api/auth/login
// Body: { email, password, role }
router.post('/login', controller.login);

// ── Protected (requires valid x-session-key header) ───────────────────────────

// GET  /api/auth/me          — any authenticated role
router.get(
  '/me',
  validateSession,
  validateRole('admin', 'teacher', 'student', 'parent'),
  controller.getMe,
);

// POST /api/auth/logout      — invalidate current session
router.post(
  '/logout',
  validateSession,
  validateRole('admin', 'teacher', 'student', 'parent'),
  controller.logout,
);

// POST /api/auth/logout-all  — invalidate ALL sessions for current user
router.post(
  '/logout-all',
  validateSession,
  validateRole('admin', 'teacher', 'student', 'parent'),
  controller.logoutAll,
);

module.exports = router;
