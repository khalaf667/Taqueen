const express = require('express');
const router = express.Router();
const authController = require('../modules/auth/authController');
const { validateEmail, validatePassword, handleValidationErrors } = require('../utils/validators');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.post('/register',
  validateEmail(),
  validatePassword(),
  handleValidationErrors,
  authController.register
);

router.post('/login',
  validateEmail(),
  handleValidationErrors,
  authController.login
);

router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.post('/logout', authMiddleware, authController.logout);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
