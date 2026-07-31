const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Extract token from Bearer header, x-access-token header, or token query param
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers['x-access-token']) {
    token = req.headers['x-access-token'];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided in Authorization header or token query.',
    });
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Token is invalid or has expired.',
      });
    }

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. User account associated with this token no longer exists.',
      });
    }

    return next();
  } catch (error) {
    console.error('[Auth Middleware Verification Error]:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized. JWT token verification failed.',
      error: error.message,
    });
  }
};

module.exports = { protect };
