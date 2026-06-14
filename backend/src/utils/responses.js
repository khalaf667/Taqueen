const sendResponse = (res, statusCode, data = {}, message = '', success = true) => {
  res.status(statusCode).json({
    success,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  sendResponse(res, statusCode, data, message, true);
};

const errorResponse = (res, message = 'Error', statusCode = 400, data = {}) => {
  sendResponse(res, statusCode, data, message, false);
};

const createdResponse = (res, data, message = 'Created successfully') => {
  sendResponse(res, 201, data, message, true);
};

const noContentResponse = (res) => {
  res.status(204).send();
};

const notFoundResponse = (res, message = 'Resource not found') => {
  sendResponse(res, 404, {}, message, false);
};

const unauthorizedResponse = (res, message = 'Unauthorized') => {
  sendResponse(res, 401, {}, message, false);
};

const forbiddenResponse = (res, message = 'Forbidden') => {
  sendResponse(res, 403, {}, message, false);
};

const paginatedResponse = (res, data, page, limit, total, message = 'Success') => {
  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  sendResponse,
  successResponse,
  errorResponse,
  createdResponse,
  noContentResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  paginatedResponse
};
