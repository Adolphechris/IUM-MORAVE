const { randomUUID } = require('crypto');

function createInstitutionalEmail({ to, subject, text, category }) {
  if (!to || !subject || !text) {
    throw new Error('to, subject and text are required');
  }

  return {
    id: randomUUID(),
    from: process.env.MAIL_FROM || 'noreply@ium-morave.edu',
    to,
    subject,
    text,
    category,
    createdAt: new Date().toISOString(),
    delivery: process.env.EMAIL_PROVIDER ? 'pending-provider-delivery' : 'development-preview'
  };
}

function sendInstitutionalEmail(message) {
  if (process.env.NODE_ENV === 'production' && !process.env.EMAIL_PROVIDER) {
    throw new Error('EMAIL_PROVIDER must be configured in production');
  }

  // A provider adapter is deliberately required in production. Development
  // returns a preview rather than silently attempting to deliver real email.
  console.info(`Institutional email preview: ${message.id} -> ${message.to}`);
  return message;
}

module.exports = { createInstitutionalEmail, sendInstitutionalEmail };
