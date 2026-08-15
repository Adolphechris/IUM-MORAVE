require('dotenv').config({ override: false });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { ROLES, findUserByEmail, findUserById, createUser, listUsers, validatePassword, safeUser, generateResetToken, blacklistToken, isTokenBlacklisted, updatePassword, syncFromSupabase } = require('./user-store');
const { signToken, verifyToken, signResetToken, verifyResetToken, signRefreshToken, verifyRefreshToken, signEmailVerifyToken, verifyEmailVerifyToken } = require('./token');

const PORT = process.env.PORT || 4001;
const app = express();

app.use(cors({ origin: process.env.WEB_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

const rateLimits = new Map();

syncFromSupabase();

function rateLimit(key, max = 5, windowMs = 60000) {
  const now = Date.now();
  const attempts = rateLimits.get(key) || [];
  const recent = attempts.filter((ts) => now - ts < windowMs);
  rateLimits.set(key, recent);
  if (recent.length >= max) {
    return false;
  }
  recent.push(now);
  rateLimits.set(key, recent);
  return true;
}

async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or invalid' });
  }

  const token = header.split(' ')[1];
  if (await isTokenBlacklisted(token)) {
    return res.status(401).json({ error: 'Token revoked' });
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: requires one of [${roles.join(', ')}]` });
    }
    next();
  };
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

app.post('/auth/register', (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (password.length < 12) {
      return res.status(400).json({ error: 'Password must contain at least 12 characters' });
    }
    if (!rateLimit(`register:${email}`, 3, 3600000)) {
      return res.status(429).json({ error: 'Too many registration attempts. Try again later.' });
    }

    const user = createUser({ email, password, role: 'student', firstName, lastName });
    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: false
    });

    res.status(201).json({ user: safeUser(user), token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (!rateLimit(`login:${email}`, 5, 60000)) {
    return res.status(429).json({ error: 'Too many login attempts. Try again later.' });
  }

  const user = findUserByEmail(email);
  if (!user || !validatePassword(user, password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    emailVerified: Boolean(user.emailVerified)
  });

  const refreshToken = signRefreshToken({
    sub: user.id,
    email: user.email,
    role: user.role
  });

  res.json({ user: safeUser(user), token, refreshToken });
});

// ── Refresh token endpoint ────────────────────────────────────────────────────

app.post('/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'refreshToken is required' });
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }

  const user = findUserByEmail(payload.email);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const newToken = signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    emailVerified: Boolean(user.emailVerified)
  });

  res.json({ token: newToken });
});

// ── Email verification endpoints ──────────────────────────────────────────────

app.post('/auth/verify-email/request', authenticate, (req, res) => {
  const user = findUserByEmail(req.user.email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (user.emailVerified) {
    return res.json({ message: 'Email already verified' });
  }

  const verifyToken = signEmailVerifyToken({ email: user.email });
  // En production, envoyer un email avec le lien de vérification
  // Pour le MVP, on retourne le token dans la réponse
  res.json({ message: 'Verification email sent', verifyToken });
});

app.post('/auth/verify-email/confirm', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Verification token is required' });
  }

  let payload;
  try {
    payload = verifyEmailVerifyToken(token);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid or expired verification token' });
  }

  const user = findUserByEmail(payload.email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.emailVerified = true;
  res.json({ message: 'Email verified successfully', user: safeUser(user) });
});

app.post('/auth/logout', authenticate, (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  blacklistToken(token);
  res.json({ message: 'Logged out successfully' });
});

app.post('/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!rateLimit(`forgot:${email}`, 3, 3600000)) {
    return res.status(429).json({ error: 'Too many requests. Try again later.' });
  }

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(200).json({ message: 'If the email exists, a reset link will be sent.' });
  }

  const resetToken = signResetToken({ email: user.email });
  user.resetToken = resetToken;
  user.resetExpiresAt = Date.now() + 3600000;

  res.status(200).json({ message: 'If the email exists, a reset link will be sent.', resetToken });
});

app.post('/auth/reset-password', (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Token and password are required' });
  }
  if (password.length < 12) {
    return res.status(400).json({ error: 'Password must contain at least 12 characters' });
  }

  let payload;
  try {
    payload = verifyResetToken(token);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }

  const user = findUserByEmail(payload.email);
  if (!user || user.resetToken !== token || Date.now() > user.resetExpiresAt) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }

  updatePassword(user, password);
  user.resetToken = null;
  user.resetExpiresAt = null;

  res.json({ message: 'Password reset successfully' });
});

app.get('/auth/profile', authenticate, (req, res) => {
  const user = findUserByEmail(req.user.email);
  res.json({ user: safeUser(user) });
});

app.get('/auth/users', authenticate, requireRole('admin'), (req, res) => {
  res.json(listUsers());
});

app.post('/auth/users', authenticate, requireRole('admin'), (req, res) => {
  try {
    const { email, password, role, firstName, lastName } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password and role are required' });
    }
    if (!ROLES.has(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    if (password.length < 12) {
      return res.status(400).json({ error: 'Password must contain at least 12 characters' });
    }

    const user = createUser({ email, password, role, firstName, lastName });
    res.status(201).json({ user: safeUser(user) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`auth-service listening on http://0.0.0.0:${PORT}`);
});
