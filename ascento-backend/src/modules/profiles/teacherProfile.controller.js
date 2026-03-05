const { createOrUpdateTeacherProfile, getTeacherProfile, getAllTeacherProfiles, deleteTeacherProfile } = require('./teacherProfile.service');

const createTeacherProfile = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const profile = await createOrUpdateTeacherProfile(teacherId, req.body);
    res.status(201).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const profile = await getTeacherProfile(teacherId);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

const getTeacherProfileById = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const profile = await getTeacherProfile(teacherId);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

const getAllProfiles = async (req, res, next) => {
  try {
    const profiles = await getAllTeacherProfiles();
    res.status(200).json({ success: true, data: profiles });
  } catch (err) {
    next(err);
  }
};

const updateTeacherProfile = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const profile = await createOrUpdateTeacherProfile(teacherId, req.body);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

const deleteProfile = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const result = await deleteTeacherProfile(teacherId);
    res.status(200).json({ success: true, message: 'Profile deleted successfully', data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTeacherProfile, getMyProfile, getTeacherProfileById, getAllProfiles, updateTeacherProfile, deleteProfile };
