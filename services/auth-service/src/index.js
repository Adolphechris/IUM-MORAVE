require('dotenv').config();
const express = require('express');
const { findUserByEmail, createUser, validatePassword, safeUser } = require('./user-store');
const { signToken, verifyToken } = require('./token');

const PORT = process.env.PORT || 4001;
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

app.post('/auth/register', (req, res) => {
  try {
    const { email, password, role, firstName, lastName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = createUser({ email, password, role, firstName, lastName });
    const token = signToken({ sub: user.id, email: user.email, role: user.role });

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

  const user = findUserByEmail(email);
  if (!user || !validatePassword(user, password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken({ sub: user.id, email: user.email, role: user.role });
  res.json({ user: safeUser(user), token });
});

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or invalid' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/auth/profile', authenticate, (req, res) => {
  const user = findUserByEmail(req.user.email);
  res.json({ user: safeUser(user) });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`auth-service listening on http://localhost:${PORT}`);
});
