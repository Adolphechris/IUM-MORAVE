import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirebaseAdmin } from '../../lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { name, email, subject, message, website } = req.body || {};

  // Spam protection honeypot
  if (website) {
    return res.status(200).json({ success: true, message: 'Message reçu.' });
  }

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis.' });
  }

  const messageDoc = {
    name,
    email: email.toLowerCase(),
    subject,
    message,
    status: 'NOUVEAU',
    createdAt: new Date().toISOString()
  };

  try {
    const { db } = getFirebaseAdmin();
    if (db) {
      await db.collection('contact_messages').add(messageDoc);
    }
  } catch (err) {
    console.warn('[api/contact] Firestore save fallback:', err);
  }

  return res.status(200).json({
    success: true,
    message: 'Votre message a été transmis avec succès à l’administration de l’IUM-MORAVE. Nous vous répondrons dans les plus brefs délais.'
  });
}
