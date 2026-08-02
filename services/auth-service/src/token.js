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
const REFRESH_SECRET = process.env.REFRESH_SECRET || randomBytes(32).toString('hex');
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || '7d';
const EMAIL_VERIFY_SECRET = process.env.EMAIL_VERIFY_SECRET || randomBytes(32).toString('hex');
const EMAIL_VERIFY_EXPIRES_IN = '24h';

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

function signRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

function signEmailVerifyToken(payload) {
  return jwt.sign(payload, EMAIL_VERIFY_SECRET, { expiresIn: EMAIL_VERIFY_EXPIRES_IN });
}

function verifyEmailVerifyToken(token) {
  return jwt.verify(token, EMAIL_VERIFY_SECRET);
}

module.exports = {
  signToken,
  verifyToken,
  signResetToken,
  verifyResetToken,
  signRefreshToken,
  verifyRefreshToken,
  signEmailVerifyToken,
  verifyEmailVerifyToken,
  RESET_SECRET
};
