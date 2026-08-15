const crypto = require('crypto');

function signDocument({ documentType, verificationCode, integrityHash }) {
  const secret = process.env.DOCUMENT_SECURITY_SECRET || process.env.TRANSCRIPT_SIGNING_SECRET || 'dev-document-sign';
  const payload = `${documentType}:${verificationCode}:${integrityHash}`;
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Moteur LMD (Licence — Master — Doctorat)
 * 
 * Implémente les règles académiques du système LMD :
 * - Calcul de la moyenne pondérée par UE et globale
 * - Règles de compensation entre UE (moyenne >= 10 pour validation)
 * - Règles de rachat (note >= 8 pour éligibilité au rachat)
 * - Génération de PV de délibération
 * - Attribution des crédits ECTS
 */

/**
 * Calcule la moyenne pondérée d'un ensemble de notes.
 * @param {Array} items - Notes avec { score, credits }
 * @returns {number} Moyenne pondérée arrondie à 2 décimales
 */
function calculateWeightedAverage(items) {
  const totalCredits = items.reduce((total, item) => total + item.credits, 0);
  const totalPoints = items.reduce((total, item) => total + (item.score * item.credits), 0);
  return totalCredits === 0 ? 0 : Number((totalPoints / totalCredits).toFixed(2));
}

/**
 * Regroupe les notes par UE (Unité d'Enseignement) en fonction du semestre.
 * @param {Array} grades - Notes avec { courseCode, courseTitle, credits, score, status, semester }
 * @returns {Array} UE groupées par semestre
 */
function groupByUE(grades) {
  const ueMap = new Map();

  for (const grade of grades) {
    const semester = grade.semester || 1;
    const ueKey = `UE-S${semester}`;

    if (!ueMap.has(ueKey)) {
      ueMap.set(ueKey, {
        code: ueKey,
        semester,
        courses: [],
        totalCredits: 0,
        validatedCredits: 0
      });
    }

    const ue = ueMap.get(ueKey);
    ue.courses.push(grade);
    ue.totalCredits += grade.credits;
    if (grade.status === 'validated') {
      ue.validatedCredits += grade.credits;
    }
  }

  for (const ue of ueMap.values()) {
    ue.weightedAverage = calculateWeightedAverage(ue.courses);
    ue.status = ue.weightedAverage >= 10 ? 'validated' : 'pending';
  }

  return Array.from(ueMap.values()).sort((a, b) => a.semester - b.semester);
}

/**
 * Évalue la décision de délibération selon les règles LMD.
 * 
 * Règles :
 * - Moyenne globale >= 10 → "validated" (admis)
 * - Moyenne globale >= 8 et < 10 → "rachat" (éligible au rachat)
 * - Moyenne globale < 8 → "rejected" (ajourné)
 * - Aucune note < 8 n'est compensable
 * 
 * @param {Array} grades - Notes de l'étudiant
 * @returns {object} Décision { decision, weightedAverage, totalCredits, details }
 */
function evaluateDeliberation(grades) {
  if (!grades || grades.length === 0) {
    return {
      decision: 'rejected',
      weightedAverage: 0,
      totalCredits: 0,
      validatedCredits: 0,
      reason: 'Aucune note disponible',
      ues: []
    };
  }

  const weightedAverage = calculateWeightedAverage(grades);
  const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);
  const validatedCredits = grades
    .filter((g) => g.status === 'validated')
    .reduce((sum, g) => sum + g.credits, 0);

  // Vérifier les notes éliminatoires (< 8)
  const failingGrades = grades.filter((g) => g.score < 8);
  const hasEliminatoryGrade = failingGrades.length > 0;

  const ues = groupByUE(grades);

  let decision;
  let reason;

  if (weightedAverage >= 10 && !hasEliminatoryGrade) {
    decision = 'validated';
    reason = 'Admis — moyenne >= 10/20 et aucune note éliminatoire';
  } else if (weightedAverage >= 10 && hasEliminatoryGrade) {
    decision = 'rachat';
    reason = `Moyenne >= 10 mais ${failingGrades.length} note(s) < 8/20 — rachat requis`;
  } else if (weightedAverage >= 8) {
    decision = 'rachat';
    reason = 'Moyenne entre 8 et 10 — éligible au rachat';
  } else {
    decision = 'rejected';
    reason = 'Moyenne < 8/20 — ajourné';
  }

  return {
    decision,
    weightedAverage,
    totalCredits,
    validatedCredits,
    reason,
    failingGrades: failingGrades.map((g) => ({ courseCode: g.courseCode, courseTitle: g.courseTitle, score: g.score })),
    ues
  };
}

/**
 * Génère un procès-verbal de délibération au format JSON.
 * 
 * @param {object} params - { enrollment, program, grades, decision, finalizedBy }
 * @returns {object} PV de délibération structuré
 */
function generateDeliberationPV({ enrollment, program, grades, decision, finalizedBy }) {
  const evaluation = evaluateDeliberation(grades);
  const pvNumber = `PV-${new Date().getFullYear()}-${String(enrollment.id).padStart(4, '0')}`;
  const issuedAt = new Date().toISOString();

  return {
    documentType: 'procès-verbal-délibération',
    pvNumber,
    institution: 'Institut Universitaire Morave de Mwene-Ditu',
    academicYear: enrollment.academicYear,
    student: {
      name: enrollment.studentName,
      matricule: enrollment.matricule,
      email: enrollment.studentEmail
    },
    program: {
      code: program.code,
      title: program.title,
      level: program.level
    },
    deliberation: {
      decision: decision || evaluation.decision,
      weightedAverage: evaluation.weightedAverage,
      totalCredits: evaluation.totalCredits,
      validatedCredits: evaluation.validatedCredits,
      reason: evaluation.reason,
      failingGrades: evaluation.failingGrades
    },
    units: evaluation.ues.map((ue) => ({
      code: ue.code,
      semester: ue.semester,
      weightedAverage: ue.weightedAverage,
      status: ue.status,
      totalCredits: ue.totalCredits,
      validatedCredits: ue.validatedCredits,
      courses: ue.courses.map((c) => ({
        code: c.courseCode,
        title: c.courseTitle,
        credits: c.credits,
        score: c.score,
        status: c.status
      }))
    })),
    finalizedBy,
    issuedAt,
    mention: getMention(evaluation.weightedAverage)
  };
}

/**
 * Détermine la mention académique selon la moyenne.
 * @param {number} average - Moyenne pondérée
 * @returns {string} Mention
 */
function getMention(average) {
  if (average >= 16) return 'Très Bien';
  if (average >= 14) return 'Bien';
  if (average >= 12) return 'Assez Bien';
  if (average >= 10) return 'Passable';
  if (average >= 8) return 'Rachat';
  return 'Ajourné';
}

function generateDiplomaData({ enrollment, program, deliberation }) {
  const year = new Date().getFullYear();
  const diplomaNumber = `DIP-${year}-${String(enrollment.id).padStart(4, '0')}`;
  const verificationCode = `DIP-VRF-${year}-${enrollment.matricule.replace(/[^A-Z0-9]/gi, '')}`;
  const secret = process.env.DOCUMENT_SECURITY_SECRET || process.env.TRANSCRIPT_SIGNING_SECRET || 'dev-diploma';

  return {
    diplomaNumber,
    studentName: enrollment.studentName,
    studentEmail: enrollment.studentEmail,
    matricule: enrollment.matricule,
    programCode: program.code,
    programTitle: program.title,
    level: program.level,
    academicYear: enrollment.academicYear,
    weightedAverage: deliberation.weightedAverage,
    mention: getMention(deliberation.weightedAverage),
    issuedDate: new Date().toISOString().slice(0, 10),
    status: 'issued',
    verificationCode,
    issuedBy: 'IUM-MORAVE',
    integrityHash: crypto.createHmac('sha256', secret).update(diplomaNumber).digest('hex'),
    documentSignature: signDocument({ documentType: 'diploma', verificationCode, integrityHash: diplomaNumber })
  };
}

module.exports = {
  calculateWeightedAverage,
  groupByUE,
  evaluateDeliberation,
  generateDeliberationPV,
  generateDiplomaData,
  getMention
};