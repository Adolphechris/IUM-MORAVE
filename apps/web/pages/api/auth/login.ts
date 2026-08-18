import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getFirebaseAdmin } from '../../../lib/firebase-admin';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_ium_morave_2026_super_secure_key';
const defaultAdminPasswordHash = bcrypt.hashSync('ChangeMe123!', 10);

const fallbackUsers = [
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

  let user: any = null;

  try {
    const { db } = getFirebaseAdmin();
    if (db) {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('email', '==', email.toLowerCase()).get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        if (data.passwordHash && bcrypt.compareSync(password, data.passwordHash)) {
          user = { id: doc.id, ...data };
        }
      }
    }
  } catch (err) {
    console.warn('[firebase-login] Firestore check fallback:', err);
  }

  // Fallback to initial seed users if not found in Firestore or during offline testing
  if (!user) {
    const foundFallback = fallbackUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundFallback && bcrypt.compareSync(password, foundFallback.passwordHash)) {
      user = foundFallback;
    }
  }

  if (!user) {
    return res.status(401).json({ error: 'Identifiants invalides (email ou mot de passe incorrect).' });
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
