const express = require('express');
const cors = require('cors');
const { authenticate, requireRole } = require('../../../shared/auth');

const app = express();
const PORT = process.env.PORT || 4004;

app.use(cors({ origin: true }));
app.use(express.json());

let templates = [
  {
    id: 'grade_published',
    channel: ['email'],
    subject: 'Nouvelle note publiée — IUM-MORAVE',
    template: 'Bonjour {studentName}, une nouvelle note a été publiée pour le cours {courseTitle}. Note: {score}/20. Connectez-vous à votre espace étudiant pour plus de détails.'
  },
  {
    id: 'financial_reminder',
    channel: ['email', 'sms'],
    subject: 'Rappel de paiement — IUM-MORAVE',
    template: 'Bonjour {studentName}, un paiement de {amount} FCFA est dû pour votre scolarité. Merci de régulariser votre situation.'
  },
  {
    id: 'attendance_alert',
    channel: ['email'],
    subject: 'Alerte d\'absence — IUM-MORAVE',
    template: 'Bonjour {studentName}, un ou plusieurs absences ont été enregistrées lors du cours {courseTitle} du {date}. Merci de vous rapprocher du service pédagogique.'
  }
];

let notifications = [];

app.get('/health', (req, res) => res.json({ status: 'OK', service: 'notification-service' }));

app.use(authenticate);
app.use(requireRole('admin', 'finance', 'teacher'));

app.get('/templates', (req, res) => {
  res.json(templates);
});

app.get('/templates/:id', (req, res) => {
  const tmpl = templates.find(t => t.id === req.params.id);
  if (!tmpl) return res.status(404).json({ error: 'Template introuvable.' });
  res.json(tmpl);
});

app.post('/send/:templateId', (req, res) => {
  const tmpl = templates.find(t => t.id === req.params.templateId);
  if (!tmpl) return res.status(404).json({ error: 'Template introuvable.' });

  const { recipient, data } = req.body;
  const notification = {
    id: notifications.length + 1,
    templateId: req.params.templateId,
    recipient,
    channels: tmpl.channel,
    status: 'sent',
    sentAt: new Date().toISOString()
  };
  notifications.push(notification);

  console.log(`[NOTIFICATION] ${tmpl.template.replace(/{(\w+)}/g, (m, key) => data[key] || m)}`);
  res.status(201).json(notification);
});

app.post('/send-bulk/:templateId', (req, res) => {
  const tmpl = templates.find(t => t.id === req.params.templateId);
  if (!tmpl) return res.status(404).json({ error: 'Template introuvable.' });

  const { recipients, data } = req.body;
  const sent = recipients.map((recipient, index) => {
    const notification = {
      id: notifications.length + 1 + index,
      templateId: req.params.templateId,
      recipient,
      channels: tmpl.channel,
      status: 'sent',
      sentAt: new Date().toISOString()
    };
    notifications.push(notification);
    return notification;
  });

  res.status(201).json(sent);
});

app.get('/notifications', (req, res) => {
  res.json(notifications);
});

app.listen(PORT, () => {
  console.log(`Notification Service running on http://localhost:${PORT}`);
});

module.exports = app;
