const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');

const configuredSecret = process.env.JWT_SECRET;
if (!configuredSecret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be configured in production');
}

const JWT_SECRET = configuredSecret || randomBytes(32).toString('hex');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const RESET_SECRET = process.env.RESET_SECRET || randomBytes(32).toString('hex');
const RESET_EXPIRES_IN = '1h';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function signResetToken(payload) {
  return jwt.sign(payload, RESET_SECRET, { expiresIn: RESET_EXPIRES_IN });
}

function verifyResetToken(token) {
  return jwt.verify(token, RESET_SECRET);
}

module.exports = { signToken, verifyToken, signResetToken, verifyResetToken, RESET_SECRET };
