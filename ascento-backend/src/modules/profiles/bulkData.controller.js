const { createBulkStudentData, getBulkStudentData, getTeacherStudentBulkData, updateBulkStudentData, deleteBulkStudentData } = require('./bulkData.service');

const uploadBulkStudentData = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const { studentId } = req.params;
    const data = await createBulkStudentData(teacherId, studentId, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getStudentData = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const { studentId } = req.params;
    const data = await getBulkStudentData(teacherId, studentId);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getMyStudentsData = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const data = await getTeacherStudentBulkData(teacherId);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const updateStudentData = async (req, res, next) => {
  try {
    const { dataId } = req.params;
    const data = await updateBulkStudentData(dataId, req.body);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const deleteStudentData = async (req, res, next) => {
  try {
    const { dataId } = req.params;
    const data = await deleteBulkStudentData(dataId);
    res.status(200).json({ success: true, message: 'Data deleted successfully', data });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadBulkStudentData, getStudentData, getMyStudentsData, updateStudentData, deleteStudentData };
