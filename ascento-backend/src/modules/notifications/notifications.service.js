const Notification = require('../../models/notification.model');

const createNotification = async (data) => Notification.create(data);
const fetchForUser = async ({ role, classNo, section }) => {
  const filter = { $or: [ { targetRoles: { $in: [role] } }, { audience: 'all' } ] };
  if (classNo) filter.$or.push({ targetClass: Number(classNo) });
  if (section) filter.$or.push({ targetSection: section });
  return Notification.find(filter).sort('-createdAt');
};

module.exports = { createNotification, fetchForUser };
