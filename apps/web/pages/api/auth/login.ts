import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_ium_morave_2026_super_secure_key';

const defaultAdminPasswordHash = bcrypt.hashSync('ChangeMe123!', 10);

const users = [
  {
    id: 1,
    email: 'admin@ium-morave.edu',
    passwordHash: defaultAdminPasswordHash,
    role: 'admin',
    firstName: 'Admin',
    lastName: 'IUM'
  },
  {
    id: 2,
    email: 'jean.kabamba@ium-morave.edu',
    passwordHash: defaultAdminPasswordHash,
    role: 'student',
    firstName: 'Jean',
    lastName: 'Kabamba'
  },
  {
    id: 3,
    email: 'prof.mukendi@ium-morave.edu',
    passwordHash: defaultAdminPasswordHash,
    role: 'teacher',
    firstName: 'Prof.',
    lastName: 'Mukendi'
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Activer CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Adresse email et mot de passe requis.' });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Identifiants invalides (utilisateur non trouvé).' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Identifiants invalides (mot de passe incorrect).' });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    },
    token
  });
}
