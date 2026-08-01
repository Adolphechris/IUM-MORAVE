const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');
const jwt = require('jsonwebtoken');

const ROLES = new Set(['student', 'teacher', 'admin', 'finance']);
const users = [
  {
    id: 1,
    email: 'admin@ium-morave.edu',
    passwordHash: bcrypt.hashSync('ChangeMe123!', 12),
    role: 'admin',
    firstName: 'Admin',
    lastName: 'IUM',
    emailVerified: true,
    resetToken: null,
    resetExpiresAt: null
  }
];

const tokenBlacklist = new Set();

function findUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

function findUserById(id) {
  return users.find((user) => user.id === id);
}

function listUsers() {
  return users.map(safeUser);
}

function createUser({ email, password, role = 'student', firstName = '', lastName = '' }) {
  const existing = findUserByEmail(email);
  if (existing) {
    throw new Error('User already exists');
  }
  if (!ROLES.has(role)) {
    throw new Error('Invalid role');
  }

  const id = users.length + 1;
  const passwordHash = bcrypt.hashSync(password, 12);
  const newUser = { id, email, passwordHash, role, firstName, lastName, emailVerified: false, resetToken: null, resetExpiresAt: null };
  users.push(newUser);
  return newUser;
}

function validatePassword(user, password) {
  return bcrypt.compareSync(password, user.passwordHash);
}

function safeUser(user) {
  if (!user) return null;
  const { passwordHash, resetToken, resetExpiresAt, ...rest } = user;
  return rest;
}

function generateResetToken() {
  const token = randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 3600000;
  return { token, expiresAt };
}

function blacklistToken(token) {
  tokenBlacklist.add(token);
}

function isTokenBlacklisted(token) {
  return tokenBlacklist.has(token);
}

module.exports = {
  ROLES,
  findUserByEmail,
  findUserById,
  listUsers,
  createUser,
  validatePassword,
  safeUser,
  generateResetToken,
  blacklistToken,
  isTokenBlacklisted
};
