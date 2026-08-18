import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'GET only' });
  }

  const smtpPass = process.env.ZOHO_SMTP_PASSWORD;
  const smtpUser = process.env.ZOHO_SMTP_USER;
  const smtpHost = process.env.ZOHO_SMTP_HOST;

  if (!smtpPass || !smtpUser) {
    return res.status(500).json({
      error: 'Variables SMTP manquantes',
      ZOHO_SMTP_PASSWORD: smtpPass ? '✅ définie' : '❌ MANQUANTE',
      ZOHO_SMTP_USER: smtpUser ? '✅ ' + smtpUser : '❌ MANQUANTE',
      ZOHO_SMTP_HOST: smtpHost || '❌ MANQUANTE'
    });
  }

  const results: any[] = [];

  // Test plusieurs configurations SMTP Zoho
  const configs = [
    { host: 'smtppro.zoho.com', port: 465, secure: true, label: 'smtppro:465 SSL' },
    { host: 'smtp.zoho.com', port: 465, secure: true, label: 'smtp:465 SSL' },
    { host: 'smtppro.zoho.com', port: 587, secure: false, label: 'smtppro:587 TLS' },
    { host: 'smtp.zoho.com', port: 587, secure: false, label: 'smtp:587 TLS' },
  ];

  const nodemailer = require('nodemailer');

  for (const cfg of configs) {
    try {
      const transporter = nodemailer.createTransport({
        host: cfg.host,
        port: cfg.port,
        secure: cfg.secure,
        auth: { user: smtpUser, pass: smtpPass },
        connectionTimeout: 6000,
        greetingTimeout: 5000,
        socketTimeout: 8000,
      });

      await transporter.verify();
      results.push({ config: cfg.label, status: '✅ CONNEXION OK' });
      
      // Si connexion OK, essayer d'envoyer un e-mail de test
      try {
        await transporter.sendMail({
          from: `"Test IUM-MORAVE" <${smtpUser}>`,
          to: smtpUser,
          subject: '✅ Test SMTP IUM-MORAVE - Connexion réussie',
          text: `Test envoyé avec succès via ${cfg.label} à ${new Date().toLocaleString('fr-FR')}`,
        });
        results.push({ config: cfg.label, status: '✅ EMAIL ENVOYÉ avec succès!' });
      } catch (sendErr: any) {
        results.push({ config: cfg.label, sendError: sendErr.message });
      }
      break; // Arrêter dès qu'une config fonctionne
    } catch (err: any) {
      results.push({ config: cfg.label, status: '❌ Échec', error: err.message });
    }
  }

  return res.status(200).json({ smtpUser, smtpHost, results });
}
