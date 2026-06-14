const express = require('express');
const router = express.Router();
const branchController = require('../modules/branches/branchController');
const { managerOrAbove } = require('../middlewares/roleMiddleware');

router.post('/', managerOrAbove, branchController.createBranch);
router.get('/', branchController.getAllBranches);
router.get('/:id', branchController.getBranchById);
router.put('/:id', managerOrAbove, branchController.updateBranch);
router.delete('/:id', managerOrAbove, branchController.deleteBranch);

module.exports = router;
