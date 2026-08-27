const puppeteer = require('puppeteer');
const crypto = require('crypto');
const { createWatermark, createTimestamp, signDocumentAdvanced, requireProductionSecrets } = require('./security-service');

let browserInstance = null;

async function getBrowser() {
  if (!browserInstance || !browserInstance.isConnected()) {
    browserInstance = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
  }
  return browserInstance;
}

function signPdfMeta({ documentType, verificationCode, integrityHash }) {
  const secret = process.env.DOCUMENT_SECURITY_SECRET || process.env.TRANSCRIPT_SIGNING_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('DOCUMENT_SECURITY_SECRET must be configured in production');
  }
  const watermark = createWatermark({ documentType, studentName: '', matricule: '', documentType });
  const timestamp = createTimestamp({ verificationCode, documentType });
  const payload = `${documentType}:${verificationCode}:${integrityHash}:${watermark}:${timestamp}`;
  return crypto.createHmac('sha256', secret || 'dev-pdf-sign').update(payload).digest('hex');
}

// ═══════════════════════════════════════════════════════════════════════════
//  SVG WATERMARK & EMBLEMS
// ═══════════════════════════════════════════════════════════════════════════
const SVG_BLASON_CREST = `
<svg width="68" height="68" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#0c2461" stroke-width="3" fill="#f8fafc"/>
  <circle cx="50" cy="50" r="41" stroke="#0c2461" stroke-width="1" stroke-dasharray="2,2"/>
  <path d="M50 16 L76 30 L76 60 Q76 78 50 86 Q24 78 24 60 L24 30 Z" fill="#0c2461" stroke="#0c2461" stroke-width="1.5"/>
  <path d="M50 20 L72 32 L72 58 Q72 73 50 81 Q28 73 28 58 L28 32 Z" fill="#ffffff"/>
  <!-- Symboles éducation & science -->
  <path d="M38 42 L50 36 L62 42 L50 48 Z" fill="#0c2461"/>
  <rect x="42" y="47" width="16" height="4" fill="#0c2461"/>
  <circle cx="50" cy="62" r="7" stroke="#0c2461" stroke-width="2" fill="none"/>
  <line x1="50" y1="52" x2="50" y2="55" stroke="#0c2461" stroke-width="2"/>
  <line x1="50" y1="69" x2="50" y2="72" stroke="#0c2461" stroke-width="2"/>
  <line x1="40" y1="62" x2="43" y2="62" stroke="#0c2461" stroke-width="2"/>
  <line x1="57" y1="62" x2="60" y2="62" stroke="#0c2461" stroke-width="2"/>
  <text x="50" y="94" font-family="'Times New Roman', serif" font-size="5" font-weight="bold" fill="#0c2461" text-anchor="middle">SCIENTIA SPLENDET</text>
</svg>
`;

const SVG_LARGE_WATERMARK = `
<svg width="420" height="420" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute; top:52%; left:50%; transform:translate(-50%,-50%); opacity:0.065; z-index:0; pointer-events:none;">
  <circle cx="200" cy="200" r="185" stroke="#000000" stroke-width="8"/>
  <circle cx="200" cy="200" r="165" stroke="#000000" stroke-width="3" stroke-dasharray="6,6"/>
  <!-- Blason central -->
  <path d="M200 70 L300 125 L300 240 Q300 310 200 345 Q100 310 100 240 L100 125 Z" fill="#000000" stroke="#000000" stroke-width="4"/>
  <path d="M200 85 L285 132 L285 235 Q285 295 200 330 Q115 295 115 235 L115 132 Z" fill="#ffffff"/>
  <!-- Flambeau et savoir -->
  <polygon points="150,170 200,145 250,170 200,195" fill="#000000"/>
  <circle cx="200" cy="250" r="30" stroke="#000000" stroke-width="8" fill="none"/>
  <text x="200" y="380" font-family="'Times New Roman', serif" font-size="16" font-weight="bold" fill="#000000" text-anchor="middle">INSTITUT UNIVERSITAIRE MORAVE WILLSAMAL</text>
</svg>
`;

const SVG_ROUND_BLUE_SEAL = `
<svg width="105" height="105" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity:0.85;">
  <circle cx="70" cy="70" r="64" stroke="#1d4ed8" stroke-width="3" stroke-dasharray="5,2"/>
  <circle cx="70" cy="70" r="58" stroke="#1d4ed8" stroke-width="1.5"/>
  <circle cx="70" cy="70" r="40" stroke="#1d4ed8" stroke-width="1.5"/>
  <path id="curveTop" d="M 22 70 A 48 48 0 0 1 118 70" fill="none"/>
  <path id="curveBottom" d="M 118 70 A 48 48 0 0 1 22 70" fill="none"/>
  <text font-family="'Times New Roman', serif" font-size="8.5" font-weight="bold" fill="#1d4ed8" letter-spacing="1">
    <textPath href="#curveTop" startOffset="50%" text-anchor="middle">INSTITUT UNIV. MORAVE</textPath>
  </text>
  <text font-family="'Times New Roman', serif" font-size="7.5" font-weight="bold" fill="#1d4ed8" letter-spacing="1">
    <textPath href="#curveBottom" startOffset="50%" text-anchor="middle">★ FAC. DES SCIENCES ★</textPath>
  </text>
  <text x="70" y="66" font-family="'Times New Roman', serif" font-size="8" font-weight="bold" fill="#1d4ed8" text-anchor="middle">SCIENTIA</text>
  <text x="70" y="77" font-family="'Times New Roman', serif" font-size="7.5" font-weight="bold" fill="#1d4ed8" text-anchor="middle">SPLENDET</text>
</svg>
`;

// ═══════════════════════════════════════════════════════════════════════════
//  FONCTION DE RENDU RELEVÉ ANNUEL (Modèle officiel ESU RDC / UNILU)
// ═══════════════════════════════════════════════════════════════════════════
function renderAnnualSheet({
  sheetTitle = 'RELEVÉ DES COTES',
  sheetNumber = '12743/304/2026',
  studentName = 'MUKENDI KALONJI ADOLPHE',
  birthPlace = 'Mwene-Ditu',
  birthDate = '15 Mars 1998',
  session = 'Première session',
  academicYear = '2026-2027',
  programLevelTitle = 'Deuxième Master en Ingénierie Sécurité Informatique',
  facultyName = 'Faculté des Sciences et Technologies',
  grades = [],
  weightedAverage = 16.06,
  totalCredits = 60,
  decision = 'Très Bien',
  verificationCode = 'IUM-2026-M2-ISI-088',
  integrityHash = '',
  issuedDate = '27 août 2026',
  secretaryName = 'Ir. Chef de Travaux / Secrétaire',
  deanName = 'Prof. Dr. Doyen de la Faculté',
  qrDataUrl = ''
}) {
  const rowsHtml = grades.map((g, idx) => {
    const num = idx + 1;
    const title = g.courseTitle || g.title || '—';
    const cours = g.volumeCours !== undefined ? g.volumeCours : (g.cours || '40');
    const tdtp = g.volumeTdTp || g.tdtp || '15+25+70';
    const credits = g.credits || 4;
    const score = g.score !== undefined ? Number(g.score).toFixed(0) : (g.côte || '15');
    return `
      <tr>
        <td class="tc" style="width: 4%;">${num}.</td>
        <td class="tl" style="width: 50%;">${title}</td>
        <td class="tc" style="width: 12%;">${cours}</td>
        <td class="tc" style="width: 16%;">${tdtp}</td>
        <td class="tc" style="width: 8%;">${credits}</td>
        <td class="tc fw" style="width: 10%;">${score}</td>
      </tr>
    `;
  }).join('');

  const percentage = (Number(weightedAverage) * 5).toFixed(2).replace('.', ',');

  return `
  <div class="annual-sheet">
    ${SVG_LARGE_WATERMARK}

    <!-- 1. EN-TÊTE OFFICIEL CONGOLAIS -->
    <table class="hdr-tbl">
      <tr>
        <td style="width: 18%; text-align: left; vertical-align: top;">
          ${SVG_BLASON_CREST}
        </td>
        <td style="width: 64%; text-align: center; vertical-align: top;">
          <div class="hdr-rep">REPUBLIQUE DEMOCRATIQUE DU CONGO</div>
          <div class="hdr-univ">INSTITUT UNIVERSITAIRE MORAVE WILLSAMAL</div>
          <div class="hdr-fac">${facultyName.toUpperCase()}</div>
          <div class="hdr-bp">B.P. 126</div>
          <div class="hdr-city">MWENE-DITU</div>
        </td>
        <td style="width: 18%; text-align: right; vertical-align: top;">
          <div class="photo-box">
            <span>PHOTO DE<br/>L'ÉTUDIANT</span>
          </div>
        </td>
      </tr>
    </table>

    <!-- 2. TITRE DU DOCUMENT -->
    <div class="doc-title-block">
      <span class="doc-title">${sheetTitle} N° <u>&nbsp;${sheetNumber}&nbsp;</u></span>
    </div>

    <!-- 3. PHRASE D'IDENTIFICATION OFFICIELLE -->
    <p class="intro-paragraph">
      Monsieur/Mademoiselle <strong>${studentName.toUpperCase()}</strong>, né(e) à <em>${birthPlace}</em>, le <em>${birthDate}</em>, a obtenu, à l'issue de la <strong>${session}</strong> de l'année académique <strong>${academicYear}</strong> aux examens portant sur les matières prévues au programme de <strong>${programLevelTitle}</strong> à la <strong>${facultyName}</strong>, les cotes ci-dessous :
    </p>

    <!-- 4. TABLEAU DES COTES (STANDARD ESU RDC / UNILU) -->
    <table class="cotes-table">
      <thead>
        <tr>
          <th rowspan="2" style="width: 4%;">N°</th>
          <th rowspan="2" style="width: 50%;">MATIERES SUIVIES</th>
          <th colspan="2" style="width: 28%;">VOLUME HORAIRE</th>
          <th rowspan="2" style="width: 8%;">CREDITS</th>
          <th rowspan="2" style="width: 10%;">COTES<br/>OBTENUES<br/>.../20</th>
        </tr>
        <tr>
          <th style="width: 12%;">COURS</th>
          <th style="width: 16%;">T.D. + T.P. + T.P.E.</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <!-- 5. SYNTHÈSE & DÉLIBÉRATION -->
    <div class="deliberation-block">
      <table class="delib-tbl">
        <tr>
          <td class="delib-lbl">Pourcentage pondéré / Moyenne</td>
          <td class="delib-dots">...........................................................................</td>
          <td class="delib-val"><strong>${percentage} % &nbsp;(${Number(weightedAverage).toFixed(2)} / 20)</strong></td>
        </tr>
        <tr>
          <td class="delib-lbl">Crédits validés</td>
          <td class="delib-dots">...........................................................................</td>
          <td class="delib-val"><strong>${totalCredits} / ${totalCredits}</strong></td>
        </tr>
        <tr>
          <td class="delib-lbl">Décision du jury</td>
          <td class="delib-dots">...........................................................................</td>
          <td class="delib-val"><strong>${decision.toUpperCase()}</strong></td>
        </tr>
      </table>
    </div>

    <!-- 6. DATE ET DOUBLE SIGNATURE OFFICIELLE -->
    <div class="date-line">Fait à Mwene-Ditu, le ${issuedDate}</div>

    <table class="signatures-tbl">
      <tr>
        <td style="width: 50%; text-align: center; vertical-align: top; position: relative;">
          <div class="sig-title">Le Secrétaire Académique de la Faculté</div>
          <div class="sig-space">
            <div style="font-family:'Brush Script MT', cursive; font-size:16pt; color:#1e3a8a; transform: rotate(-5deg); padding-top:8px;">A. Kalonji</div>
          </div>
          <div class="sig-name"><u>${secretaryName}</u></div>
        </td>
        <td style="width: 50%; text-align: center; vertical-align: top; position: relative;">
          <div class="sig-title">Le Doyen de la Faculté</div>
          <div class="sig-space" style="display:flex; justify-content:center; align-items:center;">
            <div style="font-family:'Brush Script MT', cursive; font-size:17pt; color:#0f172a; transform: rotate(3deg);">Dr. J.M. Kanda</div>
            <div style="position: absolute; right: 25px; top: -5px;">${SVG_ROUND_BLUE_SEAL}</div>
          </div>
          <div class="sig-name"><u>${deanName}</u></div>
        </td>
      </tr>
    </table>

    <!-- 7. BAS DE PAGE OFFICIEL & SÉCURITÉ CRYPTOGRAPHIQUE -->
    <div class="footer-block">
      <div class="footer-legal">
        * Ce document n'a aucune valeur administrative ; il est strictement réservé à un usage interne, EX : Excellent, TB : Très Bien, D : Distinction, S : Satisfaction, AJ : Ajourné(e).
      </div>
      <div class="footer-security">
        <div style="flex:1;">
          <strong>Vérification Cryptographique &amp; Intégrité :</strong> Code <code>${verificationCode}</code> | SHA-256 : <code>${integrityHash.substring(0, 32)}...</code><br/>
          Portail officiel de vérification : <strong>https://iumorave-ac.org/verify?code=${verificationCode}</strong>
        </div>
        <div class="qr-mini">
          <img src="${qrDataUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://iumorave-ac.org/verify?code=' + verificationCode}" alt="QR" />
        </div>
      </div>
    </div>

  </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
//  TRANSCRIPT TO HTML (Générateur multipages autonome)
// ═══════════════════════════════════════════════════════════════════════════
function transcriptToHtml(transcript) {
  const facultyName = transcript.facultyName || 'Faculté des Sciences et Technologies';
  const studentName = transcript.student?.name || transcript.studentName || 'MUKENDI KALONJI ADOLPHE';
  const birthPlace = transcript.student?.birthPlace || 'Mwene-Ditu';
  const birthDate = transcript.student?.birthDate || '15 Mars 1998';
  const verificationCode = transcript.verificationCode || 'IUM-2026-M2-ISI-088';
  const integrityHash = transcript.integrityHash || '6e94616c4251b2d400886bf3efc1c2042964fa04b3d03addcaf375835d3fbeba';
  const issuedDate = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const qrDataUrl = transcript.qrCodeDataUrl || `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://iumorave-ac.org/verify?code=${verificationCode}`;

  const allGrades = transcript.grades || [];
  const m1Grades = allGrades.filter(g => g.semester === 1 || g.semester === 2);
  const m2Grades = allGrades.filter(g => g.semester === 3 || g.semester === 4);

  let sheetsHtml = '';

  // Si on a des cours Master 1 et Master 2, on génère 2 pages distinctes (1 page par année)
  if (m1Grades.length > 0 && m2Grades.length > 0) {
    const m1Pts = m1Grades.reduce((sum, g) => sum + (g.score * g.credits), 0);
    const m1Cr = m1Grades.reduce((sum, g) => sum + g.credits, 0);
    const m1Avg = m1Cr > 0 ? (m1Pts / m1Cr).toFixed(2) : 15.46;

    const m2Pts = m2Grades.reduce((sum, g) => sum + (g.score * g.credits), 0);
    const m2Cr = m2Grades.reduce((sum, g) => sum + g.credits, 0);
    const m2Avg = m2Cr > 0 ? (m2Pts / m2Cr).toFixed(2) : 16.65;

    const sheetM1 = renderAnnualSheet({
      sheetTitle: 'RELEVÉ DES COTES',
      sheetNumber: `${verificationCode}/M1/2026`,
      studentName,
      birthPlace,
      birthDate,
      session: 'Première session',
      academicYear: '2026-2027',
      programLevelTitle: 'Premier Master en Ingénierie Sécurité Informatique',
      facultyName,
      grades: m1Grades,
      weightedAverage: m1Avg,
      totalCredits: m1Cr,
      decision: 'Distinction (Réussi)',
      verificationCode: `${verificationCode}-M1`,
      integrityHash,
      issuedDate,
      qrDataUrl
    });

    const sheetM2 = renderAnnualSheet({
      sheetTitle: 'RELEVÉ DES COTES',
      sheetNumber: `${verificationCode}/M2/2027`,
      studentName,
      birthPlace,
      birthDate,
      session: 'Première session',
      academicYear: '2027-2028',
      programLevelTitle: 'Deuxième Master en Ingénierie Sécurité Informatique',
      facultyName,
      grades: m2Grades,
      weightedAverage: m2Avg,
      totalCredits: m2Cr,
      decision: 'Très Bien (Grande Distinction)',
      verificationCode: `${verificationCode}-M2`,
      integrityHash,
      issuedDate,
      qrDataUrl
    });

    sheetsHtml = sheetM1 + '<div class="page-break"></div>' + sheetM2;
  } else {
    // Relevé annuel unique (1 seule page)
    const totalPts = allGrades.reduce((sum, g) => sum + ((g.score || 15) * (g.credits || 4)), 0);
    const totalCr = allGrades.reduce((sum, g) => sum + (g.credits || 4), 0);
    const avg = totalCr > 0 ? (totalPts / totalCr).toFixed(2) : (transcript.weightedAverage || 16.06);

    sheetsHtml = renderAnnualSheet({
      sheetTitle: 'RELEVÉ DES COTES',
      sheetNumber: `${verificationCode}/2026`,
      studentName,
      birthPlace,
      birthDate,
      session: 'Première session',
      academicYear: transcript.academicYear || '2026-2027',
      programLevelTitle: transcript.program?.title || 'Deuxième Master en Ingénierie Sécurité Informatique',
      facultyName,
      grades: allGrades,
      weightedAverage: avg,
      totalCredits: totalCr,
      decision: transcript.decision || 'Très Bien (Grande Distinction)',
      verificationCode,
      integrityHash,
      issuedDate,
      qrDataUrl
    });
  }

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Relevé Officiel des Cotes — IUM-MORAVE</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 15mm 10mm 15mm; }
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 9.5pt;
      color: #000000;
      margin: 0;
      padding: 0;
      line-height: 1.25;
      background: #ffffff;
    }

    .page-break { page-break-after: always; }

    .annual-sheet {
      position: relative;
      width: 100%;
      min-height: 270mm;
      padding: 0;
      box-sizing: border-box;
    }

    /* EN-TÊTE */
    .hdr-tbl { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    .hdr-rep { font-size: 11pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.04em; }
    .hdr-univ { font-size: 11.5pt; font-weight: bold; text-transform: uppercase; margin: 1px 0; }
    .hdr-fac { font-size: 10pt; font-weight: bold; text-transform: uppercase; }
    .hdr-bp { font-size: 9pt; font-weight: bold; }
    .hdr-city { font-size: 9.5pt; font-weight: bold; text-transform: uppercase; }

    .photo-box {
      width: 25mm;
      height: 30mm;
      border: 1pt solid #4b5563;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 6.5pt;
      color: #6b7280;
      margin-left: auto;
      background: #f9fafb;
    }

    /* TITRE */
    .doc-title-block { text-align: center; margin: 10px 0 8px 0; }
    .doc-title {
      font-size: 13pt;
      font-weight: bold;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    /* INTRO PARAGRAPH */
    .intro-paragraph {
      font-size: 9pt;
      text-align: justify;
      margin: 0 0 10px 0;
      line-height: 1.35;
    }

    /* TABLEAU DES COTES */
    .cotes-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      border: 1pt solid #000000;
      margin-bottom: 8px;
      background: transparent;
      position: relative;
      z-index: 1;
    }
    .cotes-table th {
      border: 0.8pt solid #000000;
      padding: 3px 2px;
      font-weight: bold;
      text-align: center;
      font-size: 8pt;
      text-transform: uppercase;
    }
    .cotes-table td {
      border: 0.6pt solid #000000;
      padding: 2.8px 4px;
      vertical-align: middle;
    }
    .tc { text-align: center; }
    .tl { text-align: left; }
    .fw { font-weight: bold; }

    /* DÉLIBÉRATION */
    .deliberation-block {
      margin: 8px 0 6px 120px;
      font-size: 9.5pt;
      position: relative;
      z-index: 1;
    }
    .delib-tbl { border-collapse: collapse; }
    .delib-tbl td { padding: 1.5px 0; }
    .delib-lbl { font-weight: normal; white-space: nowrap; width: 220px; }
    .delib-dots { color: #000000; font-weight: normal; padding: 0 4px; }
    .delib-val { white-space: nowrap; padding-left: 6px; }

    /* DATE & SIGNATURES */
    .date-line {
      text-align: center;
      font-size: 9.5pt;
      margin: 12px 0 6px 0;
    }
    .signatures-tbl {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
      font-size: 9pt;
      position: relative;
      z-index: 1;
    }
    .sig-title { font-weight: normal; font-size: 9pt; margin-bottom: 2px; }
    .sig-space { height: 42px; position: relative; }
    .sig-name { font-weight: bold; font-size: 9.5pt; }

    /* BAS DE PAGE */
    .footer-block {
      margin-top: 14px;
      border-top: 0.5pt solid #9ca3af;
      padding-top: 4px;
      position: relative;
      z-index: 1;
    }
    .footer-legal {
      font-size: 6.8pt;
      color: #374151;
      line-height: 1.25;
      font-style: italic;
      margin-bottom: 3px;
    }
    .footer-security {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 6.5pt;
      color: #4b5563;
      border-top: 0.5pt dashed #d1d5db;
      padding-top: 3px;
    }
    .footer-security code {
      font-family: monospace;
      font-size: 5.8pt;
      color: #111827;
    }
    .qr-mini img {
      width: 44px;
      height: 44px;
      display: block;
      border: 0.5pt solid #d1d5db;
    }
  </style>
</head>
<body>
  ${sheetsHtml}
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════════════════════
//  DIPLÔME — HTML TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════
function diplomaToHtml(diploma) {
  const qrDataUrl = diploma.qrCodeDataUrl || '';
  const watermark = createWatermark({ documentType: 'diploma', studentName: diploma.studentName, matricule: diploma.matricule });
  const timestamp = createTimestamp({ verificationCode: diploma.verificationCode, documentType: 'diploma' });
  const documentSignature = signPdfMeta({ documentType: 'diploma', verificationCode: diploma.verificationCode, integrityHash: diploma.diplomaNumber });

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Diplôme — ${diploma.diplomaNumber}</title>
      <style>
        @page { size: A4; margin: 2cm; }
        body { font-family: 'Times New Roman', Times, serif; color: #0f2340; }
        .header { text-align: center; margin-bottom: 2rem; border-bottom: 3px solid #0c2461; padding-bottom: 1rem; }
        .header h1 { font-size: 1.6rem; margin-bottom: 0.5rem; color: #0c2461; }
        .header .subtitle { color: #64748b; font-size: 0.95rem; }
        .content { margin-top: 2rem; }
        .field { margin-bottom: 1rem; }
        .field strong { display: inline-block; width: 180px; color: #334155; }
        .mention { display: inline-block; padding: 0.4rem 0.8rem; border-radius: 0.5rem; background: #fef9c3; color: #854d0e; font-weight: 700; font-size: 0.9rem; }
        .footer { margin-top: 3rem; border-top: 1px solid #e2e8f0; padding-top: 1rem; font-size: 0.8rem; color: #64748b; display: flex; justify-content: space-between; }
        .qr { margin-top: 1rem; text-align: right; }
        .qr img { width: 140px; height: 140px; }
        .seal { width: 80px; height: 80px; border-radius: 50%; border: 2px solid #0c2461; display: inline-flex; align-items: center; justify-content: center; color: #0c2461; font-weight: 900; font-size: 0.7rem; text-align: center; margin-top: 0.5rem; }
        .security { margin-top: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.5rem; font-size: 0.75rem; color: #475569; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Diplôme Officiel</h1>
        <div class="subtitle">Institut Universitaire Morave Willsamal de Mwene-Ditu — ${diploma.academicYear}</div>
      </div>

      <div class="content">
        <div class="field"><strong>Numéro :</strong> ${diploma.diplomaNumber}</div>
        <div class="field"><strong>Bénéficiaire :</strong> ${diploma.studentName}</div>
        <div class="field"><strong>Matricule :</strong> ${diploma.matricule}</div>
        <div class="field"><strong>Programme :</strong> ${diploma.programTitle} (${diploma.programCode})</div>
        <div class="field"><strong>Niveau :</strong> ${diploma.level}</div>
        <div class="field"><strong>Moyenne :</strong> ${diploma.weightedAverage}/20</div>
        <div class="field"><strong>Mention :</strong> <span class="mention">${diploma.mention}</span></div>
        <div class="field"><strong>Date d'émission :</strong> ${diploma.issuedDate}</div>
        <div class="field"><strong>Signature document :</strong> ${documentSignature}</div>
      </div>

      <div class="qr">
        <p style="font-size:0.8rem; color:#64748b; margin-bottom:0.25rem;">Vérifier ce diplôme</p>
        <img src="${qrDataUrl}" alt="QR Code de vérification" />
      </div>

      <div class="security">
        <p><strong>Sécurité avancée :</strong></p>
        <p>Watermark : ${watermark}</p>
        <p>Timestamp : ${timestamp}</p>
        <p>Signature HMAC : ${documentSignature}</p>
      </div>

      <div class="footer">
        <div>
          <p>Agrément ESU N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018</p>
          <p>Émis par IUM-MORAVE — ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
        <div class="seal">IUM-MORAVE<br/>OFFICIEL</div>
      </div>
    </body>
    </html>
  `;
}

async function generateTranscriptPdf(transcript) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    const html = transcriptToHtml(transcript);
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    return pdfBuffer;
  } finally {
    await page.close();
  }
}

async function generateDiplomaPdf(diploma) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    const html = diplomaToHtml(diploma);
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    return pdfBuffer;
  } finally {
    await page.close();
  }
}

async function closeBrowser() {
  if (browserInstance && browserInstance.isConnected()) {
    await browserInstance.close();
    browserInstance = null;
  }
}

process.on('SIGINT', async () => {
  await closeBrowser();
  process.exit(0);
});

module.exports = {
  generateTranscriptPdf,
  generateDiplomaPdf,
  closeBrowser
};
