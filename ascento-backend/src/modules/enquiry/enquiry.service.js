const Enquiry = require('../../models/enquiry.model');

const createEnquiry = async (data) => Enquiry.create(data);
const listEnquiries = async ({ page=1, limit=20 }) => { const skip=(page-1)*limit; const docs=await Enquiry.find().skip(skip).limit(limit); const total=await Enquiry.countDocuments(); return { docs, total, page, limit }; };

module.exports = { createEnquiry, listEnquiries };
