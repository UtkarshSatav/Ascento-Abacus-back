const User = require('../models/user.model');
const Teacher = require('../models/teacher.model');
const Student = require('../models/student.model');
const Parent = require('../models/parent.model');
const Otp = require('../models/otp.model');
const { ROLES } = require('../config/constants');
const { comparePassword } = require('../utils/password');
const { generateOtp, otpExpiry } = require('../utils/otp');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} = require('../utils/jwt');

function authPayload(user) {
  return {
    userId: user._id.toString(),
    role: user.role,
    profileId: user.profileId ? user.profileId.toString() : null
  };
}

function userResponse(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    username: user.username,
    role: user.role,
    profileId: user.profileId
  };
}

async function issueAuthTokens(user) {
  const payload = authPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  user.lastLoginAt = new Date();
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: userResponse(user)
  };
}

async function adminLogin({ email, password }) {
  const user = await User.findOne({ email, role: ROLES.ADMIN });
  if (!user || !(await comparePassword(password, user.password))) {
    throw { status: 401, message: 'Invalid admin credentials' };
  }

  return issueAuthTokens(user);
}

async function teacherLogin({ identifier, password }) {
  const normalizedIdentifier = typeof identifier === 'string' ? identifier.trim() : '';
  const normalizedEmail = normalizedIdentifier.toLowerCase();
  const teacher = await Teacher.findOne({
    $or: [{ email: normalizedEmail }, { teacherCode: normalizedIdentifier }]
  });
  if (!teacher) {
    throw { status: 401, message: 'Invalid teacher credentials' };
  }

  const user = await User.findOne({ _id: teacher.userId, role: ROLES.TEACHER });
  if (!user || !(await comparePassword(password, user.password))) {
    throw { status: 401, message: 'Invalid teacher credentials' };
  }

  return issueAuthTokens(user);
}

async function studentLogin({ identifier, password }) {
  let user = await User.findOne({ role: ROLES.STUDENT, username: identifier });

  if (!user) {
    const student = await Student.findOne({
      $or: [{ rollNumber: identifier }, { studentCode: identifier }]
    });
    if (student) {
      user = await User.findOne({ _id: student.userId, role: ROLES.STUDENT });
    }
  }

  if (!user || !(await comparePassword(password, user.password))) {
    throw { status: 401, message: 'Invalid student credentials' };
  }

  return issueAuthTokens(user);
}

async function resolveParentAccount({ phone, email }) {
  if (phone) {
    const parent = await Parent.findOne({ phone });
    if (parent) return parent;
  }

  if (email) {
    const parent = await Parent.findOne({ email: email.toLowerCase() });
    if (parent) return parent;
  }

  return null;
}

async function requestParentOtp({ phone, email }) {
  const parent = await resolveParentAccount({ phone, email });
  if (!parent) {
    throw { status: 404, message: 'Parent account not found' };
  }

  const code = generateOtp();
  await Otp.create({ phone: parent.phone, code, expiresAt: otpExpiry(10) });

  return {
    message: 'OTP generated and sent',
    otpCodeForTesting: code,
    destinationPhone: parent.phone
  };
}

async function parentLogin({ phone, email, password, otp }) {
  const parent = await resolveParentAccount({ phone, email });
  if (!parent) {
    throw { status: 401, message: 'Invalid parent credentials' };
  }

  const user = await User.findOne({ _id: parent.userId, role: ROLES.PARENT });
  if (!user) {
    throw { status: 401, message: 'Invalid parent credentials' };
  }

  if (otp) {
    const record = await Otp.findOne({ phone: parent.phone, code: otp, consumed: false }).sort({ createdAt: -1 });
    if (!record || record.expiresAt < new Date()) {
      throw { status: 401, message: 'Invalid or expired OTP' };
    }

    record.consumed = true;
    await record.save();
  } else {
    const ok = await comparePassword(password, user.password);
    if (!ok) {
      throw { status: 401, message: 'Invalid parent credentials' };
    }
  }

  return issueAuthTokens(user);
}

async function refreshAccessToken({ refreshToken }) {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new Error('Invalid user');
    }

    return {
      accessToken: signAccessToken(authPayload(user))
    };
  } catch (error) {
    throw { status: 401, message: 'Invalid refresh token' };
  }
}

async function currentUser(userContext) {
  const user = await User.findById(userContext.userId).select('-password').lean();
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }
  return user;
}

module.exports = {
  adminLogin,
  teacherLogin,
  studentLogin,
  requestParentOtp,
  parentLogin,
  refreshAccessToken,
  currentUser
};
