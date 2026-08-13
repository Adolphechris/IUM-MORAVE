const { initDatabase } = require('../../../shared/db');

const defaultTemplates = [
  { id: 'grade_published', channel: 'email', subject: 'Nouvelle note publiée', body: 'Bonjour {{name}}, votre note de {{course}} a été publiée: {{grade}}/20.', active: true },
  { id: 'deliberation_notice', channel: 'email', subject: 'Résultat de délibération', body: 'Bonjour {{name}}, les résultats de délibération sont publiés.', active: true },
  { id: 'tuition_reminder', channel: 'email', subject: 'Rappel de frais de scolarité', body: 'Bonjour {{name}}, un échéancier de paiement requiert votre attention.', active: true },
  { id: 'financial_reminder', channel: 'email', subject: 'Rappel financier', body: 'Bonjour {{name}}, rappel de paiement de {{amount}} USD.', active: true }
];

const inMemoryNotifications = [];
const inMemoryTemplates = [...defaultTemplates];

function getDb() {
  return initDatabase();
}

async function insertNotification(payload) {
  try {
    const db = getDb();
    if (db) {
      const { data } = await db.from('notifications').insert({
        recipient: payload.recipient,
        subject: payload.subject,
        body: payload.body,
        channel: payload.channel || 'email',
        status: payload.status || 'sent',
        template_id: payload.templateId,
        metadata: payload.metadata || {}
      }).select().single();
      return { data, error: null };
    }
  } catch (error) {}

  const notification = {
    id: inMemoryNotifications.length + 1,
    recipient: payload.recipient,
    subject: payload.subject,
    body: payload.body,
    channel: payload.channel || 'email',
    status: payload.status || 'sent',
    template_id: payload.templateId,
    metadata: payload.metadata || {},
    sent_at: new Date().toISOString()
  };
  inMemoryNotifications.push(notification);
  return { data: notification, error: null };
}

async function listNotifications() {
  try {
    const db = getDb();
    if (db) {
      const { data } = await db.from('notifications').select('*').order('sent_at', { ascending: false });
      if (data && data.length) return data;
    }
  } catch (error) {}

  return inMemoryNotifications;
}

async function insertTemplate(payload) {
  try {
    const db = getDb();
    if (db) {
      const { data } = await db.from('notification_templates').insert({
        id: payload.id,
        channel: payload.channel || 'email',
        subject: payload.subject,
        body: payload.body,
        active: payload.active !== false
      }).select().single();
      return { data, error: null };
    }
  } catch (error) {}

  const tmpl = {
    id: payload.id,
    channel: payload.channel || 'email',
    subject: payload.subject,
    body: payload.body,
    active: payload.active !== false
  };
  inMemoryTemplates.push(tmpl);
  return { data: tmpl, error: null };
}

async function listTemplates() {
  try {
    const db = getDb();
    if (db) {
      const { data } = await db.from('notification_templates').select('*');
      if (data && data.length) return data;
    }
  } catch (error) {}

  return inMemoryTemplates;
}

async function findTemplateById(id) {
  try {
    const db = getDb();
    if (db) {
      const { data } = await db.from('notification_templates').select('*').eq('id', id).maybeSingle();
      if (data) return data;
    }
  } catch (error) {}

  return inMemoryTemplates.find(t => t.id === id) || null;
}

module.exports = {
  insertNotification,
  listNotifications,
  insertTemplate,
  listTemplates,
  findTemplateById
};
