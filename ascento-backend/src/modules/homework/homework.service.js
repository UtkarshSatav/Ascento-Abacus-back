const Homework = require('../../models/homework.model');

const createHomework = async (data) => Homework.create(data);

const getByClassSection = async ({ classNo, section, page=1, limit=20 }) => {
  const skip = (page-1)*limit;
  const filter = { class: classNo };
  if (section) filter.section = section;
  const docs = await Homework.find(filter).skip(skip).limit(limit);
  const total = await Homework.countDocuments(filter);
  return { docs, total, page, limit };
};

module.exports = { createHomework, getByClassSection };
