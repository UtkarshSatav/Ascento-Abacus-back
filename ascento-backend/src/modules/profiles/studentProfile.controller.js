const { createOrUpdateStudentProfile, getStudentProfile, getAllStudentProfiles, deleteStudentProfile } = require('./studentProfile.service');

const createStudentProfile = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const profile = await createOrUpdateStudentProfile(studentId, req.body);
    res.status(201).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const profile = await getStudentProfile(studentId);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

const getStudentProfileById = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const profile = await getStudentProfile(studentId);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

const getAllProfiles = async (req, res, next) => {
  try {
    const profiles = await getAllStudentProfiles();
    res.status(200).json({ success: true, data: profiles });
  } catch (err) {
    next(err);
  }
};

const updateStudentProfile = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const profile = await createOrUpdateStudentProfile(studentId, req.body);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

const deleteProfile = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const result = await deleteStudentProfile(studentId);
    res.status(200).json({ success: true, message: 'Profile deleted successfully', data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { createStudentProfile, getMyProfile, getStudentProfileById, getAllProfiles, updateStudentProfile, deleteProfile };
