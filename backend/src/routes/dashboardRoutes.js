const express = require('express');
const router = express.Router();
const dashboardController = require('../modules/dashboard/dashboardController');

router.get('/overview', dashboardController.getDashboardOverview);
router.get('/sales', dashboardController.getSalesData);
router.get('/top-items', dashboardController.getTopSellingItems);
router.get('/inventory-report', dashboardController.getInventoryReport);
router.get('/staff-performance', dashboardController.getStaffPerformance);

module.exports = router;
