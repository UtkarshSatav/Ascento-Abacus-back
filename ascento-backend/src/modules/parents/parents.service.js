const bcrypt = require('bcrypt');
const Parent = require('../../models/parent.model');
const SALT_ROUNDS = 10;

const createParent = async (data) => {
  const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);
  data.password = hashed;
  return Parent.create(data);
};

const listParents = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const docs = await Parent.find().skip(skip).limit(limit).populate('children');
  const total = await Parent.countDocuments();
  return { docs, total, page, limit };
};

module.exports = { createParent, listParents };
