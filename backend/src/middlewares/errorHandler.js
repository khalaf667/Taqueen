const logger = require('../utils/logger');
const { errorResponse } = require('../utils/responses');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);
  
  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }
  
  if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = err.message;
  }
  
  if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = err.message;
  }
  
  if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = err.message;
  }
  
  errorResponse(res, message, statusCode, { error: err.details || {} });
};

module.exports = errorHandler;
