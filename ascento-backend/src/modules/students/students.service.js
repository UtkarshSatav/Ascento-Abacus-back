const bcrypt = require('bcrypt');
const Student = require('../../models/student.model');
const Parent = require('../../models/parent.model');

const SALT_ROUNDS = 10;

// Validation: Abacus allowed only for class >=3 or class === 0(UKG). Vedic allowed only for class >=11
const validateStream = (student) => {
  if (student.stream === 'abacus') {
    if (!(student.class >= 3 || student.class === 0)) throw { status: 400, message: 'Abacus allowed only for class >=3 or UKG' };
  }
  if (student.stream === 'vedic') {
    if (!(student.class >= 11)) throw { status: 400, message: 'Vedic allowed only for class >=11' };
  }
};

const createStudent = async (data) => {
  validateStream(data);
  const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);
  data.password = hashed;
  const student = await Student.create(data);
  // attach to parents
  if (data.parentIds && data.parentIds.length) {
    await Parent.updateMany({ _id: { $in: data.parentIds } }, { $addToSet: { children: student._id } });
  }
  return student;
};

const listStudents = async ({ page = 1, limit = 20, q }) => {
  const skip = (page - 1) * limit;
  const filter = {};
  if (q) filter.$or = [{ fullName: new RegExp(q, 'i') }, { rollNumber: q }];
  const docs = await Student.find(filter).skip(skip).limit(limit);
  const total = await Student.countDocuments(filter);
  return { docs, total, page, limit };
};

const getStudent = async (id) => Student.findById(id).populate('parentIds');

const updateStudent = async (id, data) => {
  if (data.stream || data.class) validateStream({ ...data, class: data.class });
  return Student.findByIdAndUpdate(id, data, { new: true });
};

const removeStudent = async (id) => Student.findByIdAndDelete(id);

module.exports = { createStudent, listStudents, getStudent, updateStudent, removeStudent };
