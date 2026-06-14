const express = require('express');
const router = express.Router();
const staffController = require('../modules/staff/staffController');
const { adminOnly } = require('../middlewares/roleMiddleware');

router.post('/', adminOnly, staffController.createStaff);
router.get('/', staffController.getAllStaff);
router.get('/:id', staffController.getStaffById);
router.put('/:id', staffController.updateStaff);
router.delete('/:id', adminOnly, staffController.deleteStaff);

// Shifts
router.post('/:id/shifts', staffController.createShift);
router.get('/:id/shifts', staffController.getStaffShifts);

module.exports = router;
