import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { fetchGistMessages, saveGistMessages } from '../../../lib/gist-db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_ium_morave_2026_super_secure_key';

export type InstitutionalMessage = {
  id: string;
  name: string;
  email: string;
  recipientAccount: string; // 'secretariat@iumorave-ac.org' | 'contact@iumorave-ac.org'
  subject: string;
  message: string;
  status: 'NOUVEAU' | 'LU' | 'ARCHIVE' | 'REPONDU';
  isStarred?: boolean;
  folder?: 'inbox' | 'sent' | 'starred' | 'drafts' | 'archive' | 'trash';
  createdAt: string;
  replyToId?: string;
  replies?: Array<{
    id: string;
    sender: string;
    message: string;
    sentAt: string;
  }>;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Authentication check
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Accès non autorisé. Token manquant.' });
  }

  const token = authHeader.substring(7);
  try {
    jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Session expirée ou token invalide.' });
  }

  // 1. GET MESSAGES FROM CLOUD PERSISTENT DB (GIST)
  if (req.method === 'GET') {
    let messages: InstitutionalMessage[] = [];
    try {
      messages = await fetchGistMessages();
    } catch (err) {
      console.warn('[api/admin/messages] Gist fetch error:', err);
    }

    const unreadCount = messages.filter(m => m.status === 'NOUVEAU' && m.folder !== 'archive').length;
    const starredCount = messages.filter(m => m.isStarred && m.folder !== 'archive').length;

    return res.status(200).json({
      messages,
      counts: {
        unread: unreadCount,
        starred: starredCount,
        total: messages.length
      },
      accounts: [
        { email: 'secretariat@iumorave-ac.org', name: 'Secrétariat Académique & Direction', isPrimary: true },
        { email: 'contact@iumorave-ac.org', name: 'Contact Général & Admissions', isPrimary: false }
      ]
    });
  }

  // 2. COMPOSE NEW EMAIL OR REPLY (POST)
  if (req.method === 'POST') {
    const { action, recipient, subject, message, senderAccount, replyToId } = req.body || {};

    if (!recipient || !message) {
      return res.status(400).json({ error: 'Adresse destinataire et contenu du message requis.' });
    }

    const activeSender = senderAccount || 'secretariat@iumorave-ac.org';

    const newMailDoc: InstitutionalMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      name: 'Administration IUM-MORAVE',
      email: recipient.toLowerCase(),
      recipientAccount: activeSender,
      subject: subject || 'Message Officiel de l’IUM-MORAVE',
      message,
      status: 'REPONDU',
      folder: 'sent',
      replyToId: replyToId || undefined,
      createdAt: new Date().toISOString(),
      replies: []
    };

    // Save to Cloud Gist DB
    try {
      const messages = await fetchGistMessages();
      if (replyToId) {
        const orig = messages.find(m => m.id === replyToId);
        if (orig) {
          if (!orig.replies) orig.replies = [];
          orig.replies.push({
            id: 'rep-' + Date.now(),
            sender: activeSender,
            message,
            sentAt: new Date().toISOString()
          });
          orig.status = 'REPONDU';
        }
      }
      messages.unshift(newMailDoc);
      await saveGistMessages(messages);
    } catch (err) {
      console.warn('[api/admin/messages] Gist save error:', err);
    }

    // Dispatch real SMTP email via Zoho Mail (smtp.zoho.com)
    let emailDispatched = false;
    const smtpPass = process.env.ZOHO_SMTP_PASSWORD || process.env.SMTP_PASSWORD;
    if (smtpPass) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
          port: 465,
          secure: true,
          auth: {
            user: activeSender,
            pass: smtpPass
          }
        });

        await transporter.sendMail({
          from: `"Administration IUM-MORAVE" <${activeSender}>`,
          to: recipient,
          replyTo: activeSender,
          subject: subject || 'Message Officiel IUM-MORAVE',
          text: message
        });
        emailDispatched = true;
      } catch (smtpErr: any) {
        console.warn('[api/admin/messages] SMTP send error:', smtpErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: emailDispatched
        ? `E-mail transmis directement par serveur SMTP depuis ${activeSender} vers ${recipient}.`
        : `Message enregistré dans le dossier Envoyés (${activeSender} ➔ ${recipient}).`,
      sentMail: newMailDoc,
      emailDispatched
    });
  }

  // 3. UPDATE MESSAGE STATUS (PATCH)
  if (req.method === 'PATCH') {
    const { id, status, isStarred, folder } = req.body || {};

    if (!id) {
      return res.status(400).json({ error: 'ID du message requis.' });
    }

    try {
      const messages = await fetchGistMessages();
      const target = messages.find(m => m.id === id);
      if (target) {
        if (status !== undefined) target.status = status;
        if (isStarred !== undefined) target.isStarred = isStarred;
        if (folder !== undefined) target.folder = folder;
        await saveGistMessages(messages);
      }
    } catch (err) {
      console.warn('[api/admin/messages] Gist patch error:', err);
    }

    return res.status(200).json({ success: true, message: 'Statut du message mis à jour.' });
  }

  // 4. DELETE MESSAGE (DELETE)
  if (req.method === 'DELETE') {
    const { id } = req.query || req.body || {};

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID du message à supprimer requis.' });
    }

    try {
      let messages = await fetchGistMessages();
      messages = messages.filter(m => m.id !== id);
      await saveGistMessages(messages);
    } catch (err) {
      console.warn('[api/admin/messages] Gist delete error:', err);
    }

    return res.status(200).json({ success: true, message: 'Message supprimé définitivement.' });
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}
