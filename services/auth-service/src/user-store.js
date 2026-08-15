const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');
const jwt = require('jsonwebtoken');
const { blacklistToken: blacklistTokenDb, isTokenBlacklisted: isTokenBlacklistedDb } = require('./token-blacklist-repository');

const ROLES = new Set(['student', 'teacher', 'admin', 'finance']);

function getDefaultAdminPassword() {
  if (process.env.NODE_ENV === 'production') {
    return process.env.ADMIN_DEFAULT_PASSWORD || null;
  }
  return process.env.ADMIN_DEFAULT_PASSWORD || 'ChangeMe123!';
}

const defaultAdminPassword = getDefaultAdminPassword();

const users = [
  {
    id: 1,
    email: 'admin@ium-morave.edu',
    passwordHash: defaultAdminPassword ? bcrypt.hashSync(defaultAdminPassword, 12) : bcrypt.hashSync(randomBytes(32).toString('hex'), 12),
    role: 'admin',
    firstName: 'Admin',
    lastName: 'IUM',
    emailVerified: true,
    resetToken: null,
    resetExpiresAt: null,
    forcePasswordChange: !defaultAdminPassword
  }
];

const tokenBlacklist = new Set();
let isInitialized = false;
let dbAvailable = false;

async function syncFromSupabase() {
  if (isInitialized) return;
  isInitialized = true;

  try {
    const { getSupabase } = require('../../../shared/supabaseClient');
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: usersData, error } = await supabase.from('users').select();
    if (!error && usersData) {
      users.length = 0;
      usersData.forEach(u => {
        users.push({
          id: u.id,
          email: u.email,
          passwordHash: u.password_hash,
          role: u.role,
          firstName: u.first_name || '',
          lastName: u.last_name || '',
          emailVerified: true,
          resetToken: u.reset_token || null,
          resetExpiresAt: u.reset_expires_at || null,
          metadata: u.metadata
        });
      });
      console.log('[auth-service] Users synced from Supabase');
    }
  } catch (err) {
    console.error('[auth-service] Failed to sync from Supabase:', err.message);
  }
}

async function persistUserToSupabase(user) {
  try {
    const { getSupabase } = require('../../../shared/supabaseClient');
    const supabase = getSupabase();
    if (!supabase) return;

    await supabase.from('users').insert({
      email: user.email,
      password_hash: user.passwordHash,
      role: user.role,
      first_name: user.firstName,
      last_name: user.lastName,
      email_verified: user.emailVerified,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    });
  } catch (err) {
    console.error('[auth-service] Failed to persist user to Supabase:', err.message);
  }
}

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

  persistUserToSupabase(newUser);

  return newUser;
}

function validatePassword(user, password) {
  return bcrypt.compareSync(password, user.passwordHash);
}

function updatePassword(user, newPassword) {
  user.passwordHash = bcrypt.hashSync(newPassword, 12);
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
  const expiresAt = Date.now() + 3600000;
  blacklistTokenDb(token, new Date(expiresAt).toISOString());
  tokenBlacklist.add(token);
}

async function isTokenBlacklisted(token) {
  if (tokenBlacklist.has(token)) {
    return true;
  }
  try {
    return await isTokenBlacklistedDb(token);
  } catch {
    return false;
  }
}

module.exports = {
  ROLES,
  findUserByEmail,
  findUserById,
  listUsers,
  createUser,
  validatePassword,
  updatePassword,
  safeUser,
  generateResetToken,
  blacklistToken,
  isTokenBlacklisted,
  syncFromSupabase
};
