import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { getFirebaseAdmin } from '../../../lib/firebase-admin';

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

  // 1. GET MESSAGES LIST & UNREAD STATS FROM FIRESTORE
  if (req.method === 'GET') {
    let messages: InstitutionalMessage[] = [];

    try {
      const { db } = getFirebaseAdmin();
      if (db) {
        const snapshot = await db.collection('contact_messages').orderBy('createdAt', 'desc').get();
        if (!snapshot.empty) {
          messages = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || 'Expéditeur',
              email: data.email || '',
              recipientAccount: data.recipientAccount || 'secretariat@iumorave-ac.org',
              subject: data.subject || '(Sans objet)',
              message: data.message || '',
              status: data.status || 'NOUVEAU',
              isStarred: Boolean(data.isStarred),
              folder: data.folder || 'inbox',
              createdAt: data.createdAt || new Date().toISOString(),
              replies: data.replies || []
            };
          });
        }
      }
    } catch (err) {
      console.warn('[api/admin/messages] Firestore fetch warning:', err);
    }

    const unreadCount = messages.filter(m => m.status === 'NOUVEAU' && m.folder !== 'trash').length;
    const starredCount = messages.filter(m => m.isStarred && m.folder !== 'trash').length;

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

  // 2. COMPOSE NEW EMAIL OR SEND REPLY (POST)
  if (req.method === 'POST') {
    const { action, recipient, subject, message, senderAccount, replyToId } = req.body || {};

    if (!recipient || !message) {
      return res.status(400).json({ error: 'Adresse destinataire et contenu du message requis.' });
    }

    const activeSender = senderAccount || 'secretariat@iumorave-ac.org';

    const newMailDoc = {
      name: 'Administration IUM-MORAVE',
      email: recipient.toLowerCase(),
      senderAccount: activeSender,
      subject: subject || 'Message Officiel de l’IUM-MORAVE',
      message,
      status: 'REPONDU',
      folder: 'sent',
      replyToId: replyToId || null,
      createdAt: new Date().toISOString()
    };

    // 2a. Save to Firestore
    try {
      const { db } = getFirebaseAdmin();
      if (db) {
        await db.collection('contact_messages').add(newMailDoc);

        if (replyToId) {
          const originalRef = db.collection('contact_messages').doc(replyToId);
          const originalSnap = await originalRef.get();
          if (originalSnap.exists) {
            const currentReplies = originalSnap.data()?.replies || [];
            currentReplies.push({
              id: 'rep-' + Date.now(),
              sender: activeSender,
              message,
              sentAt: new Date().toISOString()
            });
            await originalRef.update({
              status: 'REPONDU',
              replies: currentReplies
            });
          }
        }
      }
    } catch (err) {
      console.warn('[api/admin/messages] Firestore send warning:', err);
    }

    // 2b. Dispatch real SMTP email via Zoho Mail (smtp.zoho.com)
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
        console.warn('[api/admin/messages] Real SMTP email send error:', smtpErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: emailDispatched
        ? `E-mail rédigé et transmis directement par serveur SMTP depuis ${activeSender} vers ${recipient}.`
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
      const { db } = getFirebaseAdmin();
      if (db) {
        const updateData: Record<string, any> = {};
        if (status !== undefined) updateData.status = status;
        if (isStarred !== undefined) updateData.isStarred = isStarred;
        if (folder !== undefined) updateData.folder = folder;

        await db.collection('contact_messages').doc(id).update(updateData);
      }
    } catch (err) {
      console.warn('[api/admin/messages] Firestore patch warning:', err);
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
      const { db } = getFirebaseAdmin();
      if (db) {
        await db.collection('contact_messages').doc(id).delete();
      }
    } catch (err) {
      console.warn('[api/admin/messages] Firestore delete warning:', err);
    }

    return res.status(200).json({ success: true, message: 'Message supprimé définitivement.' });
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}
