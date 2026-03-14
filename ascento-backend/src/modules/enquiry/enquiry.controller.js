'use strict';

const ApiResponse = require('../../core/ApiResponse');
const AppError = require('../../core/AppError');
const asyncHandler = require('../../core/asyncHandler');
const enquiryService = require('./enquiry.service');

const create = asyncHandler(async (req, res) => {
  const { fullName, email, phoneNumber, classInterested, message, status } = req.body;

  if (!fullName || !email || !phoneNumber || !classInterested || !message) {
    throw new AppError('fullName, email, phoneNumber, classInterested, and message are required.', 400);
  }

  const enquiry = await enquiryService.create({
    fullName,
    email,
    phoneNumber,
    classInterested,
    message,
    status,
  });

  return new ApiResponse(201, 'Enquiry submitted successfully', enquiry).send(res);
});

const listForAdmin = asyncHandler(async (req, res) => {
  const result = await enquiryService.listForAdmin(req.query);
  return new ApiResponse(200, 'Enquiries fetched', result).send(res);
});

const update = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.update(req.params.id, req.body, req.user._id);
  return new ApiResponse(200, 'Enquiry updated', enquiry).send(res);
});

const remove = asyncHandler(async (req, res) => {
  await enquiryService.remove(req.params.id);
  return new ApiResponse(200, 'Enquiry deleted').send(res);
});

module.exports = {
  create,
  listForAdmin,
  update,
  remove,
};
