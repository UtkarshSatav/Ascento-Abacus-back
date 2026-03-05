const bcrypt = require('bcrypt');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../utils/jwt');
const Admin = require('../../models/admin.model');
const Teacher = require('../../models/teacher.model');
const Student = require('../../models/student.model');
const Parent = require('../../models/parent.model');
const RefreshToken = require('../../models/refreshToken.model');

const SALT_ROUNDS = 10;

const login = async ({ role, identifier, password }) => {
  let model;
  if (role === 'admin') model = Admin;
  if (role === 'teacher') model = Teacher;
  if (role === 'student') model = Student;
  if (role === 'parent') model = Parent;
  if (!model) throw { status: 400, message: 'Invalid role' };

  let user;
  if (role === 'student') user = await model.findOne({ rollNumber: identifier });
  else if (role === 'parent') user = await model.findOne({ phone: identifier });
  else user = await model.findOne({ email: identifier });

  if (!user) throw { status: 401, message: 'Invalid credentials' };
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw { status: 401, message: 'Invalid credentials' };

  const payload = { id: user._id, role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await RefreshToken.create({ token: refreshToken, userId: user._id, role, expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000) });

  return { accessToken, refreshToken, user };
};

const refresh = async (token) => {
  try {
    const decoded = verifyRefreshToken(token);
    const stored = await RefreshToken.findOne({ token });
    if (!stored) throw { status: 401, message: 'Invalid refresh token' };
    const payload = { id: decoded.id, role: decoded.role };
    const accessToken = signAccessToken(payload);
    return { accessToken };
  } catch (err) {
    throw { status: 401, message: 'Invalid refresh token' };
  }
};

const logout = async (token) => {
  await RefreshToken.deleteOne({ token });
};

const seedAdmin = async ({ fullName, email, password }) => {
  const existing = await Admin.findOne({ email });
  if (existing) return existing;
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  return Admin.create({ fullName, email, password: hashed });
};

module.exports = { login, refresh, logout, seedAdmin };
