const { forbiddenResponse } = require('../utils/responses');

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return forbiddenResponse(res, 'User not authenticated');
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return forbiddenResponse(res, `This action requires one of these roles: ${allowedRoles.join(', ')}`);
    }
    
    next();
  };
};

const superAdminOnly = roleMiddleware('SUPER_ADMIN');
const adminOnly = roleMiddleware('ADMIN', 'SUPER_ADMIN');
const managerOrAbove = roleMiddleware('MANAGER', 'ADMIN', 'SUPER_ADMIN');

module.exports = {
  roleMiddleware,
  superAdminOnly,
  adminOnly,
  managerOrAbove
};
