const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { generateTranscriptPdf } = require('../services/core-api/src/pdf-service');
const { calculateMasterGpa } = require('../services/core-api/src/lmd-engine');

async function main() {
  const student = {
    name: 'MUKENDI KALONJI Adolphe',
    matricule: '2026-M2-ISI-088',
    email: 'adolphe.mukendi@iumorave-ac.org'
  };

  const program = {
    code: 'M-ISI',
    title: 'Master en Sciences et Technologie — Mention Ingénierie Sécurité Informatique',
    level: 'Master (120 ECTS / 4 Semestres)'
  };

  const grades = [
    // Master 1 - Semestre 1 (30 ECTS)
    { semester: 1, courseCode: 'ROI2111', courseTitle: 'Recherche opérationnelle pour ingénieur informaticien', credits: 4, score: 15, volumeCours: 40, volumeTdTp: '15+25+70', status: 'validated' },
    { semester: 1, courseCode: 'TPI2111', courseTitle: 'Théories de probabilités pour ingénieur informaticien', credits: 4, score: 14, volumeCours: 40, volumeTdTp: '15+25+70', status: 'validated' },
    { semester: 1, courseCode: 'AGT2111', courseTitle: 'Anglais technique-1', credits: 3, score: 16, volumeCours: 30, volumeTdTp: '15+15+45', status: 'validated' },
    { semester: 1, courseCode: 'LFS2111', courseTitle: 'Langage formel et compilation', credits: 5, score: 14, volumeCours: 45, volumeTdTp: '20+20+85', status: 'validated' },
    { semester: 1, courseCode: 'LAS2111', courseTitle: 'Langage système', credits: 5, score: 15, volumeCours: 45, volumeTdTp: '20+20+85', status: 'validated' },
    { semester: 1, courseCode: 'ALG2111', courseTitle: 'Algorithmes et structures de données avancées', credits: 5, score: 17, volumeCours: 45, volumeTdTp: '20+20+85', status: 'validated' },
    { semester: 1, courseCode: 'SOR2111', courseTitle: 'Système d\'objets répartis', credits: 4, score: 14, volumeCours: 40, volumeTdTp: '15+25+70', status: 'validated' },

    // Master 1 - Semestre 2 (30 ECTS)
    { semester: 2, courseCode: 'TCO2121', courseTitle: 'Théorie du codage', credits: 4, score: 16, volumeCours: 40, volumeTdTp: '15+25+70', status: 'validated' },
    { semester: 2, courseCode: 'SSE2122', courseTitle: 'Sécurité des systèmes d\'exploitation', credits: 4, score: 15, volumeCours: 40, volumeTdTp: '15+25+70', status: 'validated' },
    { semester: 2, courseCode: 'CRY2121', courseTitle: 'Cryptologie', credits: 4, score: 17, volumeCours: 40, volumeTdTp: '15+25+70', status: 'validated' },
    { semester: 2, courseCode: 'MSD2121', courseTitle: 'Méthodes de sécurisation des données', credits: 4, score: 15, volumeCours: 40, volumeTdTp: '15+25+70', status: 'validated' },
    { semester: 2, courseCode: 'SAR2121', courseTitle: 'Sécurité des applications et des réseaux', credits: 4, score: 16, volumeCours: 40, volumeTdTp: '15+25+70', status: 'validated' },
    { semester: 2, courseCode: 'PRP2121', courseTitle: 'Programmation parallèle', credits: 4, score: 15, volumeCours: 40, volumeTdTp: '15+25+70', status: 'validated' },
    { semester: 2, courseCode: 'INFA11', courseTitle: 'Projet-4 & Application pratique', credits: 6, score: 17, volumeCours: 20, volumeTdTp: '00+40+90', status: 'validated' },

    // Master 2 - Semestre 3 (30 ECTS)
    { semester: 3, courseCode: 'DLC2131', courseTitle: 'Développement de logiciels cryptographiques', credits: 4, score: 16, volumeCours: 40, volumeTdTp: '15+25+70', status: 'validated' },
    { semester: 3, courseCode: 'CRA2131', courseTitle: 'Cryptologie avancée', credits: 6, score: 17, volumeCours: 50, volumeTdTp: '20+30+100', status: 'validated' },
    { semester: 3, courseCode: 'PRR2131', courseTitle: 'Programmation réseaux', credits: 6, score: 15, volumeCours: 50, volumeTdTp: '20+30+100', status: 'validated' },
    { semester: 3, courseCode: 'MTR2131', courseTitle: 'Méthodes et techniques de rédaction scientifique', credits: 4, score: 16, volumeCours: 40, volumeTdTp: '15+25+70', status: 'validated' },
    { semester: 3, courseCode: 'DIR2131', courseTitle: 'Détection des intrusions et réponses aux incidents', credits: 5, score: 17, volumeCours: 45, volumeTdTp: '20+20+85', status: 'validated' },
    { semester: 3, courseCode: 'IRD2131', courseTitle: 'Interconnexion et routage dynamique', credits: 5, score: 15, volumeCours: 45, volumeTdTp: '20+20+85', status: 'validated' },

    // Master 2 - Semestre 4 (30 ECTS)
    { semester: 4, courseCode: 'CEI2141', courseTitle: 'Contrôle d\'accès et extraction d\'information', credits: 3, score: 16, volumeCours: 30, volumeTdTp: '10+15+50', status: 'validated' },
    { semester: 4, courseCode: 'APS2141', courseTitle: 'Audit et plan de la sécurité informatique', credits: 2, score: 17, volumeCours: 20, volumeTdTp: '10+10+30', status: 'validated' },
    { semester: 4, courseCode: 'SSL2141', courseTitle: 'Sécurité des services en ligne', credits: 3, score: 15, volumeCours: 30, volumeTdTp: '10+15+50', status: 'validated' },
    { semester: 4, courseCode: 'ENT2141', courseTitle: 'Entrepreneuriat-2', credits: 2, score: 16, volumeCours: 20, volumeTdTp: '10+10+30', status: 'validated' },
    { semester: 4, courseCode: 'ISI2141', courseTitle: 'Stage académique en entreprise / laboratoire', credits: 10, score: 18, volumeCours: 0, volumeTdTp: '00+150+100', status: 'validated' },
    { semester: 4, courseCode: 'PTS2141', courseTitle: 'Projet tutoré & Soutenance du Mémoire de Master', credits: 10, score: 18, volumeCours: 0, volumeTdTp: '00+150+100', status: 'validated' }
  ];

  const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);
  const totalPoints = grades.reduce((sum, g) => sum + (g.score * g.credits), 0);
  const weightedAverage = Number((totalPoints / totalCredits).toFixed(2));

  const verificationCode = 'IUM-2026-M2-ISI-088';
  const secret = process.env.DOCUMENT_SECURITY_SECRET || 'ium-morave-secret-key-2026';
  const integrityHash = crypto.createHmac('sha256', secret).update(`${student.matricule}:${weightedAverage}:${verificationCode}`).digest('hex');

  const transcript = {
    documentType: 'releve-master-isi',
    facultyName: 'Faculté des Sciences et Technologies',
    verificationCode,
    student,
    program,
    academicYear: '2026-2027 / 2027-2028',
    weightedAverage,
    decision: 'ADMIS (Mention TRÈS BIEN - Mention B)',
    issuedAt: new Date().toISOString(),
    integrityHash,
    grades,
    qrCodeDataUrl: `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://iumorave-ac.org/verify?code=${verificationCode}`
  };

  const pdfBuffer = await generateTranscriptPdf(transcript);
  const outputPath = '/home/adolphe/.gemini/antigravity/brain/59883e0f-828c-43b0-bdba-6070ff711be0/releve_mukendi_kalonji_adolphe.pdf';
  fs.writeFileSync(outputPath, pdfBuffer);

  console.log(`✅ PDF généré avec succès : ${outputPath}`);
  console.log(`Moyenne pondérée : ${weightedAverage}/20`);
  console.log(`Crédits obtenus : ${totalCredits}/120 ECTS`);
  console.log(`Code de vérification : ${verificationCode}`);
  console.log(`Integrity Hash : ${integrityHash}`);

  process.exit(0);
}

main().catch(err => {
  console.error('Erreur génération :', err);
  process.exit(1);
});
