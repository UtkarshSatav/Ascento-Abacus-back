const Attendance = require('../../models/attendance.model');
const mongoose = require('mongoose');

const mark = async ({ studentId, date, status, remarks }) => {
  const d = new Date(date);
  return Attendance.findOneAndUpdate({ studentId, date: d }, { status, remarks }, { upsert: true, new: true });
};

const fetchDaily = async ({ date, classFilter }) => {
  const d = new Date(date);
  const start = new Date(d.setHours(0,0,0,0));
  const end = new Date(d.setHours(23,59,59,999));
  const docs = await Attendance.find({ date: { $gte: start, $lte: end } }).populate('studentId');
  return docs;
};

const weeklySummary = async ({ studentId, weekStart }) => {
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const docs = await Attendance.find({ studentId, date: { $gte: start, $lte: end } });
  return docs;
};

const monthlyPercentage = async ({ studentId, year, month }) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  const total = await Attendance.countDocuments({ studentId, date: { $gte: start, $lte: end } });
  const present = await Attendance.countDocuments({ studentId, date: { $gte: start, $lte: end }, status: 'present' });
  const percent = total ? (present / total) * 100 : 0;
  return { total, present, percent };
};

module.exports = { mark, fetchDaily, weeklySummary, monthlyPercentage };
