const { from, initDatabase } = require('./db');

async function findDiplomaByNumber(diplomaNumber) {
  if (!initDatabase()) return null;
  const db = await from('diplomas');
  const { data } = await db.selectEq('diploma_number', diplomaNumber);
  return data || null;
}

async function insertDiploma(payload) {
  if (!initDatabase()) return { data: payload, error: null };
  const db = await from('diplomas');
  const { data } = await db.insert({
    user_id: null,
    program_id: null,
    diploma_number: payload.diplomaNumber,
    issued_date: payload.issuedDate,
    status: payload.status || 'issued',
    verification_code_hash: payload.integrityHash,
    student_name: payload.studentName,
    student_email: payload.studentEmail,
    matricule: payload.matricule,
    program_code: payload.programCode,
    program_title: payload.programTitle,
    program_level: payload.level,
    academic_year: payload.academicYear,
    weighted_average: payload.weightedAverage,
    mention: payload.mention,
    issued_by: payload.issuedBy,
    qr_code_data_url: payload.qrCodeDataUrl,
    document_signature: payload.documentSignature
  });
  return { data: data || payload, error: null };
}

async function listDiplomas() {
  if (!initDatabase()) return [];
  const db = await from('diplomas');
  const { data } = await db.select('diploma_number, student_name, program_title, program_level, mention, issued_date');
  return (data || []).map((item) => ({
    diplomaNumber: item.diploma_number,
    studentName: item.student_name,
    programTitle: item.program_title,
    level: item.program_level,
    mention: item.mention,
    issuedDate: item.issued_date
  }));
}

module.exports = {
  findDiplomaByNumber,
  insertDiploma,
  listDiplomas
};
