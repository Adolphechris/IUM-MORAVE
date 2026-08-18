const express = require('express');
const cors = require('cors');
const { authenticate, requireRole } = require('../../../shared/auth');
const { listTemplates, findTemplateById, insertNotification, listNotifications } = require('./notification-repository');
const { rateLimit } = require('../../../shared/rate-limiter');

const app = express();
const PORT = process.env.PORT || 4004;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'https://iumorave-ac.org' }));
app.use(express.json());

const notificationRateLimiter = rateLimit({
  windowMs: 60000,
  max: 120,
  keyGenerator: (req) => req.user?.email || req.ip || 'anonymous'
});

app.get('/health', (req, res) => res.json({ status: 'OK', service: 'notification-service' }));

app.use(authenticate);
app.use(requireRole('admin', 'finance', 'teacher'));
app.use(notificationRateLimiter);

app.get('/templates', async (req, res) => {
  const templates = await listTemplates();
  res.json(templates);
});

app.get('/templates/:id', async (req, res) => {
  const tmpl = await findTemplateById(req.params.id);
  if (!tmpl) return res.status(404).json({ error: 'Template introuvable.' });
  res.json(tmpl);
});

app.post('/send/:templateId', async (req, res) => {
  const tmpl = await findTemplateById(req.params.templateId);
  if (!tmpl) return res.status(404).json({ error: 'Template introuvable.' });

  const { recipient, data } = req.body;
  const notification = await insertNotification({
    recipient,
    subject: tmpl.subject,
    body: tmpl.body,
    templateId: req.params.templateId,
    status: 'sent',
    metadata: data || {}
  });

  if (notification.error) return res.status(500).json({ error: notification.error.message || 'Send failed' });

  console.log(`[NOTIFICATION] ${(tmpl.body || '').replace(/{(\w+)}/g, (m, key) => (data && data[key]) || m)}`);
  res.status(201).json(notification.data);
});

app.post('/send-bulk/:templateId', async (req, res) => {
  const tmpl = await findTemplateById(req.params.templateId);
  if (!tmpl) return res.status(404).json({ error: 'Template introuvable.' });

  const { recipients, data } = req.body;
  const sent = [];
  for (const recipient of recipients) {
    const notification = await insertNotification({
      recipient,
      subject: tmpl.subject,
      body: tmpl.body,
      templateId: req.params.templateId,
      status: 'sent',
      metadata: data || {}
    });
    if (!notification.error) sent.push(notification.data);
  }

  res.status(201).json(sent);
});

app.get('/notifications', async (req, res) => {
  const notifications = await listNotifications();
  res.json(notifications);
});

app.listen(PORT, () => {
  console.log(`Notification Service running on http://localhost:${PORT}`);
});

module.exports = app;
