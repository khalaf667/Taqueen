const express = require('express');
const router = express.Router();
const userController = require('../modules/users/userController');
const { adminOnly } = require('../middlewares/roleMiddleware');

router.get('/', adminOnly, userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', adminOnly, userController.deleteUser);

module.exports = router;
