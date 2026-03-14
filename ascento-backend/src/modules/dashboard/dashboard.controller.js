'use strict';

const ApiResponse = require('../../core/ApiResponse');
const asyncHandler = require('../../core/asyncHandler');
const dashboardService = require('./dashboard.service');

const getDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardAnalytics();
  return new ApiResponse(200, 'Dashboard analytics fetched', data).send(res);
});

module.exports = {
  getDashboard,
};