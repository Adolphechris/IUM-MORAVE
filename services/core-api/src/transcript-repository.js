const { from, usePostgres } = require('./db');

async function findTranscriptByVerificationCode(verificationCode) {
  // usePostgres() is synchronous — safe to use without await.
  // initDatabase() is async (returns a Promise) so !initDatabase() is always false.
  if (!usePostgres()) return null;
  const db = await from('transcripts');
  const { data } = await db.selectEq('verification_code', verificationCode);
  return data || null;
}

async function insertTranscript(payload) {
  if (!usePostgres()) return { data: payload, error: null };
  const db = await from('transcripts');
  const { data } = await db.insert({
    verification_code: payload.verificationCode,
    student_name: payload.student?.name,
    matricule: payload.student?.matricule,
    program_code: payload.program?.code,
    program_title: payload.program?.title,
    program_level: payload.program?.level,
    academic_year: payload.academicYear,
    grades: payload.grades,
    weighted_average: payload.weightedAverage,
    decision: payload.decision,
    issued_at: payload.issuedAt,
    integrity_hash: payload.integrityHash,
    qr_code_data_url: payload.qrCodeDataUrl,
    document_signature: payload.documentSignature
  });
  return { data: data || payload, error: null };
}

async function listTranscripts() {
  if (!usePostgres()) return [];
  const db = await from('transcripts');
  const { data } = await db.select('verification_code, student_name, program_title, academic_year, weighted_average, decision');
  return (data || []).map((item) => ({
    verificationCode: item.verification_code,
    studentName: item.student_name,
    programTitle: item.program_title,
    academicYear: item.academic_year,
    weightedAverage: item.weighted_average,
    decision: item.decision
  }));
}

module.exports = {
  findTranscriptByVerificationCode,
  insertTranscript,
  listTranscripts
};
