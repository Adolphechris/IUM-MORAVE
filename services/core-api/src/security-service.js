const crypto = require('crypto');

function requireProductionSecrets() {
  if (process.env.NODE_ENV === 'production') {
    const missing = [];
    if (!process.env.WATERMARK_SECRET) missing.push('WATERMARK_SECRET');
    if (!process.env.TIMESTAMP_SECRET) missing.push('TIMESTAMP_SECRET');
    if (!process.env.ADVANCED_SIGN_SECRET) missing.push('ADVANCED_SIGN_SECRET');
    if (missing.length > 0) {
      throw new Error(`Missing production secrets: ${missing.join(', ')}`);
    }
  }
}

const WATERMARK_SECRET = process.env.WATERMARK_SECRET || process.env.TRANSCRIPT_SIGNING_SECRET || 'dev-watermark';
const TIMESTAMP_SECRET = process.env.TIMESTAMP_SECRET || process.env.TRANSCRIPT_SIGNING_SECRET || 'dev-timestamp';
const ADVANCED_SIGN_SECRET = process.env.ADVANCED_SIGN_SECRET || process.env.TRANSCRIPT_SIGNING_SECRET || 'dev-advanced-sign';

function createWatermark({ studentName, matricule, documentType, issuedAt }) {
  const ts = issuedAt || 'static-watermark-time';
  const payload = `${documentType}:${studentName}:${matricule}:${ts}`;
  return crypto.createHmac('sha256', WATERMARK_SECRET).update(payload).digest('hex');
}

function createTimestamp({ verificationCode, documentType, issuedAt }) {
  const ts = issuedAt || 'static-timestamp-time';
  const payload = `${documentType}:${verificationCode}:${ts}`;
  return crypto.createHmac('sha256', TIMESTAMP_SECRET).update(payload).digest('hex');
}

function signDocumentAdvanced({ documentType, verificationCode, integrityHash, studentName, matricule, issuedAt }) {
  const watermark = createWatermark({ studentName, matricule, documentType, issuedAt });
  const timestamp = createTimestamp({ verificationCode, documentType, issuedAt });
  const payload = `${documentType}:${verificationCode}:${integrityHash}:${watermark}:${timestamp}`;
  return crypto.createHmac('sha256', ADVANCED_SIGN_SECRET).update(payload).digest('hex');
}

function validateDocumentSecurity({ documentType, verificationCode, integrityHash, documentSignature, watermark, timestamp, studentName, matricule, issuedAt }) {
  const expectedWatermark = createWatermark({ studentName, matricule, documentType, issuedAt });
  const expectedTimestamp = createTimestamp({ verificationCode, documentType, issuedAt });
  const expectedSignature = signDocumentAdvanced({ documentType, verificationCode, integrityHash, studentName, matricule, issuedAt });

  return {
    watermarkValid: watermark === expectedWatermark,
    timestampValid: timestamp === expectedTimestamp,
    signatureValid: documentSignature === expectedSignature,
    allValid: watermark === expectedWatermark && timestamp === expectedTimestamp && documentSignature === expectedSignature
  };
}

module.exports = {
  createWatermark,
  createTimestamp,
  signDocumentAdvanced,
  validateDocumentSecurity,
  requireProductionSecrets
};
