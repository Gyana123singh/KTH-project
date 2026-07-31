// Role authorization middleware factory
const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No user identity found.',
      });
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}. Current role: ${req.user.role}`,
    });
  };
};

const adminOnly = requireRoles('admin');
const employeeOnly = requireRoles('employee');
const employerOnly = requireRoles('employer');

module.exports = {
  requireRoles,
  adminOnly,
  employeeOnly,
  employerOnly,
};
