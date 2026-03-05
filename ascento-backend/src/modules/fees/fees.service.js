const Fee = require('../../models/fee.model');

const addFee = async (data) => Fee.create(data);

const markPaid = async (id) => {
  const fee = await Fee.findById(id);
  if (!fee) throw { status: 404, message: 'Fee not found' };
  fee.paid = true; fee.paidAt = new Date(); await fee.save(); return fee;
};

const fetchStatus = async ({ studentId }) => {
  const fees = await Fee.find({ studentId });
  const paid = fees.filter(f => f.paid).length;
  const pending = fees.length - paid;
  return { fees, paid, pending };
};

module.exports = { addFee, markPaid, fetchStatus };
