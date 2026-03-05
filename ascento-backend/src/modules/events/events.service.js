const Event = require('../../models/event.model');

const createEvent = async (data) => Event.create(data);
const upcoming = async () => Event.find({ startDate: { $gte: new Date() } }).sort('startDate');

module.exports = { createEvent, upcoming };
