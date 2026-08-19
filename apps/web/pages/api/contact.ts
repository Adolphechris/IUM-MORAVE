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
    recipientAccount: 'secretariat@iumorave-ac.org',
    subject,
    message,
    status: 'NOUVEAU',
    createdAt: new Date().toISOString()
  };

  // 1. Save to Firestore DB
  try {
    const { db } = getFirebaseAdmin();
    if (db) {
      await db.collection('contact_messages').add(messageDoc);
    }
  } catch (err) {
    console.warn('[api/contact] Firestore save fallback:', err);
  }

  // 2. SMTP Email Dispatch to Zoho Mail App on phone (if ZOHO_SMTP_PASSWORD set)
  const smtpPass = process.env.ZOHO_SMTP_PASSWORD || process.env.SMTP_PASSWORD;
  if (smtpPass) {
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.ZOHO_SMTP_USER || 'secretariat@iumorave-ac.org',
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: `"Portail Web IUM-MORAVE" <${process.env.ZOHO_SMTP_USER || 'secretariat@iumorave-ac.org'}>`,
        to: 'secretariat@iumorave-ac.org, contact@iumorave-ac.org',
        replyTo: email,
        subject: `[Formulaire Web] ${subject}`,
        text: `Nouveau message reçu depuis le site officiel iumorave-ac.org:\n\nExpéditeur : ${name} <${email}>\nObjet : ${subject}\n\nMessage :\n${message}\n\nDate : ${new Date().toLocaleString('fr-FR')}`
      });
    } catch (smtpErr) {
      console.warn('[api/contact] SMTP email dispatch warning:', smtpErr);
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Votre message a été transmis avec succès à l’administration de l’IUM-MORAVE. Nous vous répondrons dans les plus brefs délais.'
  });
}
