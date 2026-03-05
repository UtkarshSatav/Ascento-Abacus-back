const StudentProfile = require('../../models/studentProfile.model');
const Student = require('../../models/student.model');

const createOrUpdateStudentProfile = async (studentId, profileData) => {
  let profile = await StudentProfile.findOne({ studentId });
  
  if (profile) {
    Object.assign(profile, profileData);
    await profile.save();
    return profile;
  }
  
  profile = await StudentProfile.create({ studentId, ...profileData });
  return profile;
};

const getStudentProfile = async (studentId) => {
  const profile = await StudentProfile.findOne({ studentId }).populate('studentId', 'fullName rollNumber class');
  if (!profile) throw { status: 404, message: 'Student profile not found' };
  return profile;
};

const getAllStudentProfiles = async (filters = {}) => {
  const profiles = await StudentProfile.find(filters).populate('studentId', 'fullName rollNumber class');
  return profiles;
};

const deleteStudentProfile = async (studentId) => {
  const result = await StudentProfile.findOneAndDelete({ studentId });
  if (!result) throw { status: 404, message: 'Student profile not found' };
  return result;
};

module.exports = { createOrUpdateStudentProfile, getStudentProfile, getAllStudentProfiles, deleteStudentProfile };
