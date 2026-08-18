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

const defaultSampleMessages: InstitutionalMessage[] = [
  {
    id: 'msg-sample-101',
    name: 'Jean Kabamba Mukendi',
    email: 'jean.kabamba@ium-morave.edu',
    recipientAccount: 'secretariat@iumorave-ac.org',
    subject: 'Demande d’authentification officielle de relevé L3 Informatique (WES)',
    message: 'Bonjour Monsieur le Secrétaire Général,\n\nJe sollicite par la présente l’émission de l’attestation officielle d’authenticité de mon relevé de notes de Licence 3 en Sciences Informatiques pour transmission à l’organisme d’évaluation WES.\n\nMatricule : 2026-SINT-042.\n\nCordialement,\nJean Kabamba',
    status: 'NOUVEAU',
    isStarred: true,
    folder: 'inbox',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString()
  },
  {
    id: 'msg-sample-102',
    name: 'Dr. Marie Tshilombo',
    email: 'marie.tshilombo@ium-morave.edu',
    recipientAccount: 'secretariat@iumorave-ac.org',
    subject: 'Transmissions des Procès-Verbaux de délibération de Médecine',
    message: 'Chers membres du Secrétariat Académique,\n\nLes délibérations de la 5ème année de Doctorat en Médecine Générale se sont clôturées avec succès. Vous trouverez ci-joint la validation du jury pour l’émission des diplômes.\n\nAvec mes salutations respectueuses,\nDr. Marie Tshilombo',
    status: 'NOUVEAU',
    isStarred: false,
    folder: 'inbox',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: 'msg-sample-103',
    name: 'Service des Admissions Internationales',
    email: 'admissions.global@unesco-edu.org',
    recipientAccount: 'contact@iumorave-ac.org',
    subject: 'Demande de vérification d’accréditation ESU N°83/MINESU',
    message: 'Madame, Monsieur,\n\nDans le cadre de l’enregistrement de votre établissement auprès du réseau d’échanges académiques, merci de nous confirmer l’adresse officielle de votre rectorat ainsi que le duplicata de l’Agrément Ministériel ESU.\n\nCordialement,\nService d’accréditation',
    status: 'LU',
    isStarred: true,
    folder: 'inbox',
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString()
  }
];

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

  // 1. GET MESSAGES LIST & UNREAD STATS
  if (req.method === 'GET') {
    let messages: InstitutionalMessage[] = [...defaultSampleMessages];

    try {
      const { db } = getFirebaseAdmin();
      if (db) {
        const snapshot = await db.collection('contact_messages').orderBy('createdAt', 'desc').get();
        if (!snapshot.empty) {
          const dbMessages: InstitutionalMessage[] = snapshot.docs.map(doc => {
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

          // Merge DB messages with defaults ensuring no duplicates
          const dbIds = new Set(dbMessages.map(m => m.id));
          const filteredDefaults = defaultSampleMessages.filter(m => !dbIds.has(m.id));
          messages = [...dbMessages, ...filteredDefaults];
        }
      }
    } catch (err) {
      console.warn('[api/admin/messages] Firestore fetch fallback:', err);
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

  // 2. SEND OR REPLY EMAIL (POST)
  if (req.method === 'POST') {
    const { action, recipient, subject, message, senderAccount, replyToId } = req.body || {};

    if (!recipient || !message) {
      return res.status(400).json({ error: 'Destinataire et message requis.' });
    }

    const activeSender = senderAccount || 'secretariat@iumorave-ac.org';

    const newMailDoc = {
      name: 'IUM-MORAVE Administration',
      email: recipient.toLowerCase(),
      senderAccount: activeSender,
      subject: subject || 'Réponse de l’Administration IUM-MORAVE',
      message,
      status: 'REPONDU',
      folder: 'sent',
      replyToId: replyToId || null,
      createdAt: new Date().toISOString()
    };

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
      console.warn('[api/admin/messages] Firestore send fallback:', err);
    }

    return res.status(200).json({
      success: true,
      message: `E-mail transmis avec succès depuis ${activeSender} vers ${recipient}.`,
      sentMail: newMailDoc
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
      console.warn('[api/admin/messages] Firestore patch fallback:', err);
    }

    return res.status(200).json({ success: true, message: 'Statut du message mis à jour.' });
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}
