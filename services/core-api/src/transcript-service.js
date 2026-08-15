const { createHmac, randomUUID } = require('crypto');
const { generateVerificationQR } = require('./qr-service');

function signDocument({ documentType, verificationCode, integrityHash }) {
  const secret = process.env.DOCUMENT_SECURITY_SECRET || process.env.TRANSCRIPT_SIGNING_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('DOCUMENT_SECURITY_SECRET must be configured in production');
  }
  const payload = `${documentType}:${verificationCode}:${integrityHash}`;
  return createHmac('sha256', secret || 'dev-document-sign').update(payload).digest('hex');
}

function calculateWeightedAverage(items) {
  const totalCredits = items.reduce((total, item) => total + item.credits, 0);
  const totalPoints = items.reduce((total, item) => total + (item.score * item.credits), 0);
  return totalCredits === 0 ? 0 : Number((totalPoints / totalCredits).toFixed(2));
}

function buildTranscript({ enrollment, program, grades }) {
  const issuedAt = new Date().toISOString();
  const verificationCode = randomUUID();
  const average = calculateWeightedAverage(grades);
  const status = grades.every((grade) => grade.status === 'validated') ? 'validated' : 'pending';
  const body = {
    documentType: 'releve-de-notes',
    institution: 'Institut Universitaire Morave',
    student: {
      name: enrollment.studentName,
      matricule: enrollment.matricule
    },
    program: {
      code: program.code,
      title: program.title,
      level: program.level
    },
    academicYear: enrollment.academicYear,
    grades,
    weightedAverage: average,
    decision: status === 'validated' ? 'Résultats validés' : 'Résultats en attente de validation',
    issuedAt,
    verificationCode
  };

  const secret = process.env.TRANSCRIPT_SIGNING_SECRET || process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('TRANSCRIPT_SIGNING_SECRET must be configured in production');
  }

  const signingSecret = secret || 'development-only-transcript-signing-secret';
  const integrityHash = createHmac('sha256', signingSecret)
    .update(JSON.stringify(body))
    .digest('hex');

  return {
    ...body,
    integrityHash,
    documentSignature: signDocument({ documentType: body.documentType, verificationCode, integrityHash })
  };
}

module.exports = { buildTranscript, calculateWeightedAverage };
