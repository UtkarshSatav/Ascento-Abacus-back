const TeacherProfile = require('../../models/teacherProfile.model');
const Teacher = require('../../models/teacher.model');

const createOrUpdateTeacherProfile = async (teacherId, profileData) => {
  let profile = await TeacherProfile.findOne({ teacherId });
  
  if (profile) {
    Object.assign(profile, profileData);
    await profile.save();
    return profile;
  }
  
  profile = await TeacherProfile.create({ teacherId, ...profileData });
  return profile;
};

const getTeacherProfile = async (teacherId) => {
  const profile = await TeacherProfile.findOne({ teacherId }).populate('teacherId', 'fullName email');
  if (!profile) throw { status: 404, message: 'Teacher profile not found' };
  return profile;
};

const getAllTeacherProfiles = async (filters = {}) => {
  const profiles = await TeacherProfile.find(filters).populate('teacherId', 'fullName email');
  return profiles;
};

const deleteTeacherProfile = async (teacherId) => {
  const result = await TeacherProfile.findOneAndDelete({ teacherId });
  if (!result) throw { status: 404, message: 'Teacher profile not found' };
  return result;
};

module.exports = { createOrUpdateTeacherProfile, getTeacherProfile, getAllTeacherProfiles, deleteTeacherProfile };
