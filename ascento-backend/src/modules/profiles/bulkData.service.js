const StudentBulkData = require('../../models/studentBulkData.model');
const Student = require('../../models/student.model');

const createBulkStudentData = async (teacherId, studentId, bulkData) => {
  const student = await Student.findById(studentId);
  if (!student) throw { status: 404, message: 'Student not found' };
  
  const data = await StudentBulkData.findOne({ teacherId, studentId });
  
  if (data) {
    Object.assign(data, bulkData);
    await data.save();
    return data;
  }
  
  return StudentBulkData.create({ teacherId, studentId, ...bulkData });
};

const getBulkStudentData = async (teacherId, studentId) => {
  const data = await StudentBulkData.findOne({ teacherId, studentId })
    .populate('studentId', 'fullName rollNumber class');
  if (!data) throw { status: 404, message: 'Data not found' };
  return data;
};

const getTeacherStudentBulkData = async (teacherId) => {
  return StudentBulkData.find({ teacherId }).populate('studentId', 'fullName rollNumber class');
};

const updateBulkStudentData = async (dataId, updateData) => {
  const data = await StudentBulkData.findByIdAndUpdate(dataId, updateData, { new: true });
  if (!data) throw { status: 404, message: 'Data not found' };
  return data;
};

const deleteBulkStudentData = async (dataId) => {
  const data = await StudentBulkData.findByIdAndDelete(dataId);
  if (!data) throw { status: 404, message: 'Data not found' };
  return data;
};

module.exports = { createBulkStudentData, getBulkStudentData, getTeacherStudentBulkData, updateBulkStudentData, deleteBulkStudentData };
