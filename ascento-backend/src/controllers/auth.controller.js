const authService = require('../services/auth.service');
const asyncHandler = require('../utils/async-handler');

const adminLogin = asyncHandler(async (req, res) => {
  const data = await authService.adminLogin(req.body);
  res.json(data);
});

const teacherLogin = asyncHandler(async (req, res) => {
  const data = await authService.teacherLogin(req.body);
  res.json(data);
});

const studentLogin = asyncHandler(async (req, res) => {
  const data = await authService.studentLogin(req.body);
  res.json(data);
});

const parentRequestOtp = asyncHandler(async (req, res) => {
  const data = await authService.requestParentOtp(req.body);
  res.json(data);
});

const parentLogin = asyncHandler(async (req, res) => {
  const data = await authService.parentLogin(req.body);
  res.json(data);
});

const refresh = asyncHandler(async (req, res) => {
  const data = await authService.refreshAccessToken(req.body);
  res.json(data);
});

const me = asyncHandler(async (req, res) => {
  const data = await authService.currentUser(req.user);
  res.json(data);
});

module.exports = {
  adminLogin,
  teacherLogin,
  studentLogin,
  parentRequestOtp,
  parentLogin,
  refresh,
  me
};
