const QRCode = require('qrcode');
const crypto = require('crypto');

function signQrPayload(payload) {
  const secret = process.env.QR_SIGNING_SECRET || process.env.TRANSCRIPT_SIGNING_SECRET || 'dev-qr-sign';
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

function buildQrPayload({ type, verificationCode, expiresAt }) {
  const payload = JSON.stringify({ type, verificationCode, expiresAt });
  const signature = signQrPayload(payload);
  return Buffer.from(`${payload}.${signature}`).toString('base64url');
}

function parseQrPayload(encoded) {
  try {
    const decoded = Buffer.from(encoded, 'base64url').toString('utf8');
    const [payload, signature] = decoded.split('.');
    const expectedSignature = signQrPayload(payload);
    if (signature !== expectedSignature) return null;

    const data = JSON.parse(payload);
    if (data.expiresAt && Date.now() > Number(data.expiresAt)) return null;
    return data;
  } catch {
    return null;
  }
}

async function generateVerificationQR({ type, verificationCode, ttlMs = 365 * 24 * 60 * 60 * 1000 }) {
  const expiresAt = Date.now() + ttlMs;
  const encoded = buildQrPayload({ type, verificationCode, expiresAt });
  const baseUrl = process.env.PUBLIC_VERIFICATION_URL || 'https://ium-morave.vercel.app/verify';
  const url = `${baseUrl}?payload=${encodeURIComponent(encoded)}`;

  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#071e38',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    });

    return dataUrl;
  } catch (error) {
    console.error('[qr-service] Failed to generate QR code:', error);
    throw new Error('QR_CODE_GENERATION_FAILED');
  }
}

async function generateDiplomaQR(diplomaNumber) {
  return generateVerificationQR({
    type: 'diploma',
    verificationCode: diplomaNumber
  });
}

module.exports = {
  generateVerificationQR,
  generateDiplomaQR,
  parseQrPayload,
  buildQrPayload
};
