let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
}

const transporter = nodemailer ? nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: Number(process.env.SMTP_PORT || 25),
  secure: false,
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  } : undefined,
  tls: { rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false' }
}) : {
  sendMail: async (options) => {
    console.log('[document-email-service fallback] Email mock sent:', options.subject, 'to:', options.to);
    return { messageId: 'mock-doc-id-' + Date.now() };
  }
};

function buildDocumentEmail({ to, subject, text, attachments }) {
  return {
    from: process.env.SMTP_FROM || 'IUM-MORAVE <no-reply@ium-morave.edu>',
    to,
    subject,
    text,
    html: text.replace(/\n/g, '<br>'),
    attachments
  };
}

async function sendDocumentEmail({ to, subject, text, attachments }) {
  const message = buildDocumentEmail({ to, subject, text, attachments });
  try {
    const info = await transporter.sendMail(message);
    return { accepted: info.accepted, rejected: info.rejected, messageId: info.messageId };
  } catch (error) {
    console.error('[notification-service] Failed to send document email:', error);
    throw new Error('EMAIL_SEND_FAILED');
  }
}

module.exports = {
  sendDocumentEmail,
  buildDocumentEmail
};
