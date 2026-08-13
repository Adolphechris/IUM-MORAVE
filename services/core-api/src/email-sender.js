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
    console.log('[email-sender fallback] Email mock sent:', options.subject, 'to:', options.to);
    return { messageId: 'mock-id-' + Date.now() };
  }
};

function buildTranscriptEmail({ to, studentName, verificationCode, pdfBuffer }) {
  const subject = `Votre relevé de notes — IUM-MORAVE`;
  const text = `Bonjour ${studentName},\n\nVotre relevé de notes est disponible.\nCode de vérification : ${verificationCode}\n\nConservez ce code pour toute vérification ultérieure.\n\nInstitut Universitaire Morave de Mwene-Ditu`;

  return {
    from: process.env.SMTP_FROM || 'IUM-MORAVE <no-reply@ium-morave.edu>',
    to,
    subject,
    text,
    attachments: [
      {
        filename: `releve-${verificationCode}.pdf`,
        content: pdfBuffer
      }
    ]
  };
}

function buildDiplomaEmail({ to, studentName, diplomaNumber, pdfBuffer }) {
  const subject = `Votre diplôme — IUM-MORAVE`;
  const text = `Bonjour ${studentName},\n\nVotre diplôme officiel a été émis.\nNuméro : ${diplomaNumber}\n\nConservez ce numéro pour toute vérification ultérieure.\n\nInstitut Universitaire Morave de Mwene-Ditu`;

  return {
    from: process.env.SMTP_FROM || 'IUM-MORAVE <no-reply@ium-morave.edu>',
    to,
    subject,
    text,
    attachments: [
      {
        filename: `diplome-${diplomaNumber}.pdf`,
        content: pdfBuffer
      }
    ]
  };
}

async function sendEmail(message) {
  try {
    const info = await transporter.sendMail(message);
    return { accepted: info.accepted, rejected: info.rejected, messageId: info.messageId };
  } catch (error) {
    console.error('[core-api] Email send failed:', error);
    throw new Error('EMAIL_SEND_FAILED');
  }
}

module.exports = {
  buildTranscriptEmail,
  buildDiplomaEmail,
  sendEmail
};
