const Timetable = require('../../models/timetable.model');

const createOrUpdate = async (data) => {
  return Timetable.findOneAndUpdate({ class: data.class, section: data.section }, data, { upsert: true, new: true });
};

const fetchForStudent = async ({ classNo, section }) => {
  return Timetable.findOne({ class: classNo, section });
};

module.exports = { createOrUpdate, fetchForStudent };
