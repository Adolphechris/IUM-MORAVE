const bcrypt = require('bcryptjs');

const ROLES = new Set(['student', 'teacher', 'admin', 'finance']);

const users = [
  {
    id: 1,
    email: 'admin@ium-morave.edu',
    passwordHash: bcrypt.hashSync('ChangeMe123!', 10),
    role: 'admin',
    firstName: 'Admin',
    lastName: 'IUM'
  }
];

function findUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

function findUserById(id) {
  return users.find((user) => user.id === id);
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
  const passwordHash = bcrypt.hashSync(password, 10);
  const newUser = { id, email, passwordHash, role, firstName, lastName };
  users.push(newUser);
  return newUser;
}

function validatePassword(user, password) {
  return bcrypt.compareSync(password, user.passwordHash);
}

function safeUser(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

module.exports = {
  ROLES,
  findUserByEmail,
  findUserById,
  createUser,
  validatePassword,
  safeUser
};
