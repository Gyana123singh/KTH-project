const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'kth_kitchen_talent_hub_secret_key_2026_v1';

/**
 * Generates a signed JWT token for user authentication.
 * @param {Object} payload - Data payload to encode in token (id, role, email)
 * @param {String} expiresIn - Expiration duration (default '7d')
 * @returns {String} Signed JWT token string
 */
function generateToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, SECRET, {
    expiresIn,
  });
}

/**
 * Verifies and decodes a JWT token.
 * @param {String} token - JWT token string from Authorization header
 * @returns {Object|null} Decoded token payload if valid, null if invalid or expired
 */
function verifyToken(token) {
  try {
    if (!token) return null;
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
