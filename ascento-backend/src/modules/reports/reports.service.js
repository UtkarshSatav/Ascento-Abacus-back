const Attendance = require('../../models/attendance.model');
const Exam = require('../../models/exam.model');
const Fee = require('../../models/fee.model');

const studentSummary = async (studentId) => {
  // attendance % for current month
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23,59,59,999);
  const total = await Attendance.countDocuments({ studentId, date: { $gte: start, $lte: end } });
  const present = await Attendance.countDocuments({ studentId, date: { $gte: start, $lte: end }, status: 'present' });
  const attendancePercent = total ? (present/total)*100 : 0;

  // exam percentage overall
  const exams = await Exam.aggregate([
    { $unwind: '$marks' },
    { $match: { 'marks.studentId': require('mongoose').Types.ObjectId(studentId) } },
    { $group: { _id: null, obtained: { $sum: '$marks.obtained' }, max: { $sum: '$totalMarks' } } }
  ]);
  const obtained = exams[0]?.obtained || 0;
  const max = exams[0]?.max || 0;
  const examPercent = max ? (obtained/max)*100 : 0;

  // fee status
  const fees = await Fee.find({ studentId });
  const paid = fees.filter(f => f.paid).length; const pending = fees.length - paid;

  return { attendancePercent, examPercent, fees: { paid, pending } };
};

module.exports = { studentSummary };
