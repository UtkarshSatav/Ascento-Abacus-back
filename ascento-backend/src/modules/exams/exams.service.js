const Exam = require('../../models/exam.model');

const createExam = async (data) => Exam.create(data);

const enterMarks = async (examId, marksArray) => {
  const exam = await Exam.findById(examId);
  if (!exam) throw { status: 404, message: 'Exam not found' };
  marksArray.forEach(m => {
    const idx = exam.marks.findIndex(x => x.studentId.toString() === m.studentId);
    if (idx >= 0) exam.marks[idx].obtained = m.obtained; else exam.marks.push({ studentId: m.studentId, obtained: m.obtained });
  });
  await exam.save();
  return exam;
};

const getStudentResult = async (studentId) => {
  const docs = await Exam.aggregate([
    { $unwind: '$marks' },
    { $match: { 'marks.studentId': require('mongoose').Types.ObjectId(studentId) } },
    { $group: { _id: '$name', totalObtained: { $sum: '$marks.obtained' }, totalMax: { $sum: '$totalMarks' }, exams: { $push: { exam: '$name', obtained: '$marks.obtained', max: '$totalMarks' } } } }
  ]);
  // total and percentage across exams
  let totalObtained = 0, totalMax = 0;
  docs.forEach(d => { totalObtained += d.totalObtained; totalMax += d.totalMax; });
  const percentage = totalMax ? (totalObtained / totalMax) * 100 : 0;
  return { exams: docs, totalObtained, totalMax, percentage };
};

module.exports = { createExam, enterMarks, getStudentResult };
