const bcrypt = require('bcrypt');
const Teacher = require('../../models/teacher.model');
const SALT_ROUNDS = 10;

const createTeacher = async (data) => {
  const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);
  data.password = hashed;
  return Teacher.create(data);
};

const listTeachers = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const docs = await Teacher.find().skip(skip).limit(limit);
  const total = await Teacher.countDocuments();
  return { docs, total, page, limit };
};

module.exports = { createTeacher, listTeachers };
