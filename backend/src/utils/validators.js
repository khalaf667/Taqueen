const { body, param, query, validationResult } = require('express-validator');

const validateEmail = () => body('email').isEmail().normalizeEmail();

const validatePassword = () => body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  .withMessage('Password must contain uppercase, lowercase, number, and special character');

const validatePhoneNumber = () => body('phone')
  .matches(/^[+]?[0-9\s\-()]{10,}$/)
  .withMessage('Invalid phone number');

const validateURL = () => body('url').isURL();

const validateRequiredString = (fieldName) => body(fieldName)
  .trim()
  .notEmpty()
  .withMessage(`${fieldName} is required`);

const validateRequiredNumber = (fieldName) => body(fieldName)
  .notEmpty()
  .isNumeric()
  .withMessage(`${fieldName} must be a number`);

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateURL,
  validateRequiredString,
  validateRequiredNumber,
  handleValidationErrors
};
