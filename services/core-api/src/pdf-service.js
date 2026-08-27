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

function transcriptToHtml(transcript) {
  const facultyName = transcript.facultyName || 'Faculté des Sciences et Technologies';

  // ── Group grades by semester ──────────────────────────────────────────────
  const allGrades = transcript.grades || [];
  const SEMESTER_LABELS = { 1: 'SEMESTRE 1 (S1)', 2: 'SEMESTRE 2 (S2)', 3: 'SEMESTRE 3 (S3)', 4: 'SEMESTRE 4 (S4)' };
  const MASTER_YEAR_LABELS = { 1: 'MASTER 1', 2: 'MASTER 1', 3: 'MASTER 2', 4: 'MASTER 2' };

  const hasSemData = allGrades.some(g => g.semester);
  const grouped = {};
  allGrades.forEach((g, idx) => {
    const sem = hasSemData ? (g.semester || 1) : (Math.ceil((idx + 1) / 7) || 1);
    if (!grouped[sem]) grouped[sem] = [];
    grouped[sem].push(g);
  });
  const semNumbers = Object.keys(grouped).map(Number).sort((a, b) => a - b);

  // Pre-compute semester and global totals
  const semSummaries = {};
  let globalTotalPoints = 0, globalTotalCredits = 0, globalRowNum = 0;
  semNumbers.forEach(sem => {
    const rows = grouped[sem];
    const semCredits = rows.reduce((s, g) => s + (g.credits || 0), 0);
    const semPoints  = rows.reduce((s, g) => s + ((g.score !== undefined ? g.score : 0) * (g.credits || 0)), 0);
    const semAvg     = semCredits > 0 ? (semPoints / semCredits).toFixed(2) : '0.00';
    semSummaries[sem] = { rows, semCredits, semPoints, semAvg };
    globalTotalPoints  += semPoints;
    globalTotalCredits += semCredits;
  });
  const globalAvg = globalTotalCredits > 0 ? (globalTotalPoints / globalTotalCredits).toFixed(2) : '0.00';

  // Helper to render a semester block
  function renderSemesterBlock(sem) {
    if (!semSummaries[sem]) return '';
    const { rows, semCredits, semPoints, semAvg } = semSummaries[sem];
    const semLabel  = SEMESTER_LABELS[sem]  || `SEMESTRE ${sem}`;
    const yearLabel = MASTER_YEAR_LABELS[sem] || '';
    let rowsHtml = '';
    rows.forEach(grade => {
      globalRowNum++;
      const code  = grade.courseCode || grade.code || `UE-${globalRowNum}`;
      const title = grade.courseTitle || grade.title || '—';
      const cr    = grade.credits || 0;
      const sc    = grade.score !== undefined ? Number(grade.score).toFixed(1) : '—';
      const vCo   = grade.volumeCours !== undefined ? grade.volumeCours : '—';
      const vTd   = grade.volumeTdTp || '—';
      const pts   = (cr && grade.score !== undefined) ? (grade.score * cr).toFixed(1) : '—';
      rowsHtml += `<tr>
        <td class="tc">${globalRowNum}</td>
        <td class="tl"><span class="ue-code">${code}</span> &nbsp;${title}</td>
        <td class="tc">${vCo}</td>
        <td class="tc">${vTd}</td>
        <td class="tc fw">${cr}</td>
        <td class="tc fw score">${sc}</td>
        <td class="tc fw pts">${pts}</td>
      </tr>`;
    });

    return `
    <div class="sem-block">
      <div class="sem-header">
        <span class="sem-year">${yearLabel}</span>
        <span class="sem-name">${semLabel}</span>
        <span class="sem-ects">${semCredits} ECTS &nbsp;|&nbsp; ${rows.length} UE</span>
      </div>
      <table class="grades-table">
        <thead>
          <tr>
            <th style="width:4%">N°</th>
            <th style="width:40%; text-align:left; padding-left:6px;">Matières / Unités d'Enseignement (UE)</th>
            <th style="width:8%">Cours<br/>(h)</th>
            <th style="width:12%">TD+TP+TPE<br/>(h)</th>
            <th style="width:7%">Créd.</th>
            <th style="width:10%">Côte<br/>/20</th>
            <th style="width:10%">Points<br/>Pond.</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
        <tfoot>
          <tr class="sem-total">
            <td colspan="4" style="text-align:right; padding-right:8px;">SOUS-TOTAL ${semLabel} :</td>
            <td class="tc fw">${semCredits}</td>
            <td class="tc fw avg-cell">${semAvg}</td>
            <td class="tc fw pts">${semPoints.toFixed(1)}</td>
          </tr>
        </tfoot>
      </table>
    </div>`;
  }

  // ── Recap table rows ─────────────────────────────────────────────────────
  let recapRows = '';
  semNumbers.forEach(sem => {
    const { semCredits, semPoints, semAvg } = semSummaries[sem];
    recapRows += `<tr>
      <td class="tc fw">${SEMESTER_LABELS[sem] || 'S' + sem}</td>
      <td class="tc">${semCredits}</td>
      <td class="tc">${semPoints.toFixed(1)}</td>
      <td class="tc fw avg-cell">${semAvg}</td>
    </tr>`;
  });

  // ── Security metadata ────────────────────────────────────────────────────
  const watermark         = createWatermark({ documentType: transcript.documentType || 'releve', studentName: transcript.student?.name || '', matricule: transcript.student?.matricule || '' });
  const documentSignature = signPdfMeta({ documentType: transcript.documentType || 'releve', verificationCode: transcript.verificationCode || 'IUM-2026', integrityHash: transcript.integrityHash || 'SECURE-HMAC' });

  const studentName  = (transcript.student?.name || transcript.studentName || 'Étudiant IUM-MORAVE').toUpperCase();
  const matricule    = transcript.student?.matricule || transcript.matricule || '2026-IUM-001';
  const programTitle = transcript.program?.title || transcript.programTitle || 'Programme LMD';
  const programLevel = transcript.program?.level || transcript.level || '';
  const academicYear = transcript.academicYear || '2025-2026';
  const decision     = transcript.decision || 'ADMIS';
  const verifCode    = transcript.verificationCode || 'IUM-2026';
  const intHash      = transcript.integrityHash || '';
  const qrUrl        = transcript.qrCodeDataUrl || `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=https://iumorave-ac.org/verify?code=${verifCode}`;
  const dateStr      = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  // Mention badge
  let mentionBadge = 'MENTION BIEN';
  if (/TR[ÈE]S\s+BIEN/i.test(decision)) mentionBadge = 'MENTION TRÈS BIEN (B)';
  else if (/EXCELLENT/i.test(decision)) mentionBadge = 'MENTION EXCELLENT (A)';
  else if (/BIEN/i.test(decision)) mentionBadge = 'MENTION BIEN (C)';
  else if (/SATISFACTION/i.test(decision)) mentionBadge = 'MENTION SATISFACTION (D)';
  else if (/PASSABLE/i.test(decision)) mentionBadge = 'MENTION PASSABLE (E)';

  const decisionMain = 'ADMIS';

  // Render Page 1 (S1 + S2) and Page 2 (S3 + S4)
  const isMultiSemester = semNumbers.length > 2;
  const page1Blocks = isMultiSemester ? (renderSemesterBlock(1) + renderSemesterBlock(2)) : semNumbers.map(s => renderSemesterBlock(s)).join('');
  const page2Blocks = isMultiSemester ? (renderSemesterBlock(3) + renderSemesterBlock(4)) : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Relevé de Cotes Officiel — IUM-MORAVE</title>
  <style>
    @page { size: A4 portrait; margin: 10mm 12mm 8mm 12mm; }
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 8pt; color: #111827; margin: 0; padding: 0; line-height: 1.3; }

    /* PAGE BREAK */
    .page-break { page-break-after: always; }

    /* HEADER */
    .page-header { display: flex; align-items: center; border-bottom: 2pt solid #0c2461; padding-bottom: 5px; margin-bottom: 6px; }
    .logo-box { width: 55px; min-width: 55px; margin-right: 8px; display: flex; align-items: center; justify-content: center; }
    .logo-circle { width: 50px; height: 50px; border-radius: 50%; border: 2pt solid #0c2461; display: flex; align-items: center; justify-content: center; background: #eef2ff; font-weight: 900; font-size: 7.5pt; color: #0c2461; text-align: center; line-height: 1.1; }
    .header-center { flex: 1; text-align: center; }
    .hdr-republic { font-size: 6.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #374151; }
    .hdr-ministry { font-size: 6pt; color: #6b7280; margin-bottom: 1px; }
    .hdr-univ { font-size: 12.5pt; font-weight: 900; color: #0c2461; text-transform: uppercase; letter-spacing: 0.06em; margin: 1px 0; }
    .hdr-faculty { font-size: 8.5pt; font-weight: 700; color: #1e40af; }
    .hdr-agrement { font-size: 5.5pt; color: #6b7280; font-style: italic; }
    .seal-box { width: 55px; min-width: 55px; margin-left: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .seal-circle { width: 48px; height: 48px; border-radius: 50%; border: 1.2pt dashed #9ca3af; display: flex; align-items: center; justify-content: center; font-size: 5.5pt; color: #9ca3af; text-align: center; font-style: italic; }

    /* TITLE */
    .doc-title-strip { background: #0c2461; color: #fff; text-align: center; padding: 4px 0 3px 0; margin-bottom: 6px; border-radius: 2px; }
    .doc-title-strip h1 { font-size: 10.5pt; font-weight: 900; letter-spacing: 0.1em; margin: 0; text-transform: uppercase; }
    .doc-title-strip .doc-ref { font-size: 6.5pt; letter-spacing: 0.06em; opacity: 0.85; margin-top: 1px; }

    /* STUDENT CARD */
    .student-card { border: 1pt solid #d1d5db; border-radius: 3px; padding: 4px 8px; margin-bottom: 6px; background: #f9fafb; }
    .info-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 2px 12px; }
    .info-item { font-size: 7.8pt; }
    .info-item .lbl { font-weight: 700; color: #374151; }
    .info-item.full { grid-column: 1 / -1; }

    /* SEMESTER BLOCKS */
    .sem-block { margin-bottom: 6px; }
    .sem-header { background: #1e40af; color: #fff; display: flex; align-items: center; padding: 2.5px 6px; border-radius: 2px 2px 0 0; }
    .sem-year { font-size: 7pt; font-weight: 700; background: rgba(255,255,255,0.2); padding: 1px 6px; border-radius: 2px; margin-right: 6px; white-space: nowrap; }
    .sem-name { font-size: 8pt; font-weight: 700; flex: 1; letter-spacing: 0.03em; }
    .sem-ects { font-size: 6.8pt; opacity: 0.9; white-space: nowrap; }

    /* GRADES TABLE */
    .grades-table { width: 100%; border-collapse: collapse; font-size: 7.4pt; border: 1pt solid #93c5fd; }
    .grades-table thead tr { background: #dbeafe; color: #1e3a8a; }
    .grades-table thead th { border: 0.5pt solid #93c5fd; padding: 2.5px 3px; font-weight: 700; text-align: center; font-size: 6.5pt; line-height: 1.2; }
    .grades-table tbody td { border: 0.5pt solid #e5e7eb; padding: 2px 3px; vertical-align: middle; }
    .grades-table tbody tr:nth-child(even) { background: #f0f9ff; }
    .grades-table tfoot td { border: 0.5pt solid #93c5fd; padding: 2.5px 3px; }
    .tc { text-align: center; }
    .tl { text-align: left; }
    .fw { font-weight: 700; }
    .ue-code { font-family: 'Courier New', monospace; font-size: 6.5pt; color: #1e40af; background: #eff6ff; padding: 0 2px; border-radius: 2px; font-weight: 700; }
    .score { color: #1e40af; font-size: 7.8pt; }
    .pts { color: #374151; }
    .avg-cell { color: #0c2461; font-size: 8pt; }
    .sem-total td { font-size: 7.8pt; font-weight: 700; background: #bfdbfe !important; }

    /* RECAP */
    .recap-section { margin-top: 6px; margin-bottom: 6px; }
    .recap-section h3 { font-size: 7.8pt; font-weight: 700; color: #0c2461; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 3px 0; border-bottom: 1pt solid #0c2461; padding-bottom: 2px; }
    .recap-grid { display: flex; gap: 8px; align-items: stretch; }
    .recap-table { border-collapse: collapse; font-size: 7.5pt; border: 1pt solid #6b7280; flex: 1.2; }
    .recap-table th { background: #0c2461; color: #fff; border: 0.5pt solid #374151; padding: 2.5px 6px; font-weight: 700; text-align: center; font-size: 6.8pt; }
    .recap-table td { border: 0.5pt solid #d1d5db; padding: 2px 6px; text-align: center; }
    .recap-table tfoot td { background: #0c2461; color: #fff; font-weight: 700; font-size: 8.5pt; }
    .decision-box { border: 1.5pt solid #166534; border-radius: 3px; background: #f0fdf4; padding: 6px 8px; flex: 1; min-width: 160px; display: flex; flex-direction: column; justify-content: center; }
    .decision-box .dlbl { font-size: 6.5pt; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.05em; }
    .decision-box .dval { font-size: 10pt; font-weight: 900; color: #15803d; margin: 2px 0; }
    .mention-badge { display: inline-block; background: #166534; color: #fff; padding: 2px 8px; border-radius: 2px; font-size: 7.5pt; font-weight: 700; letter-spacing: 0.03em; }

    /* SIGNATURES */
    .signatures-section { display: flex; justify-content: space-between; margin-top: 8px; margin-bottom: 6px; }
    .sig-block { width: 47%; text-align: center; font-size: 7.5pt; }
    .sig-block .sig-title { font-weight: 700; text-decoration: underline; margin-bottom: 1px; color: #0c2461; font-size: 7.5pt; }
    .sig-block .sig-role { color: #6b7280; font-style: italic; font-size: 6.8pt; }
    .sig-line { border-bottom: 1pt solid #374151; width: 75%; margin: 14px auto 4px auto; }
    .sig-block .sig-name { font-weight: 700; font-size: 8pt; color: #0c2461; }

    /* SECURITY FOOTER */
    .security-strip { border-top: 1pt solid #d1d5db; padding-top: 4px; margin-top: 4px; display: flex; align-items: center; gap: 8px; }
    .security-text { flex: 1; font-size: 6pt; color: #6b7280; line-height: 1.4; }
    .security-text strong { color: #374151; font-size: 6.5pt; }
    .security-text code { font-family: 'Courier New', monospace; font-size: 5.5pt; word-break: break-all; color: #374151; }
    .verify-url { font-size: 6.2pt; font-weight: 700; color: #1e40af; }
    .qr-block { text-align: center; flex-shrink: 0; }
    .qr-block img { width: 62px; height: 62px; display: block; border: 0.5pt solid #d1d5db; }
    .qr-block .qr-label { font-size: 5pt; color: #9ca3af; margin-top: 1px; }
  </style>
</head>
<body>

  <!-- ════════════════════ PAGE 1 : MASTER 1 (S1 + S2) ════════════════════ -->
  <div class="page-header">
    <div class="logo-box">
      <div class="logo-circle">IUM<br/>MORAVE</div>
    </div>
    <div class="header-center">
      <div class="hdr-republic">République Démocratique du Congo</div>
      <div class="hdr-ministry">Ministère de l'Enseignement Supérieur et Universitaire (ESU)</div>
      <div class="hdr-univ">Institut Universitaire Morave Willsamal</div>
      <div class="hdr-faculty">${facultyName.toUpperCase()}</div>
      <div class="hdr-agrement">Agrément ESU N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 du 09 Avril 2018 &nbsp;|&nbsp; B.P. 126 — Mwene-Ditu, Province de Lomami</div>
    </div>
    <div class="seal-box">
      <div class="seal-circle">Sceau<br/>Officiel<br/>Homologué</div>
    </div>
  </div>

  <div class="doc-title-strip">
    <h1>RELEVÉ DE COTES OFFICIEL</h1>
    <div class="doc-ref">N° IUM / FST / ${verifCode} &nbsp;—&nbsp; PAGE 1 / ${isMultiSemester ? '2' : '1'}</div>
  </div>

  <div class="student-card">
    <div class="info-grid">
      <div class="info-item"><span class="lbl">Nom &amp; Prénom(s) : </span><span>${studentName}</span></div>
      <div class="info-item"><span class="lbl">Matricule : </span><span style="font-family:'Courier New',monospace; font-weight:700;">${matricule}</span></div>
      <div class="info-item full"><span class="lbl">Programme &amp; Filière : </span><span>${programTitle}</span></div>
      <div class="info-item"><span class="lbl">Niveau d'Études : </span><span>${programLevel}</span></div>
      <div class="info-item"><span class="lbl">Années Académiques : </span><span>${academicYear}</span></div>
    </div>
  </div>

  ${page1Blocks}

  ${isMultiSemester ? `
  <div style="text-align:right; font-size:6.5pt; color:#6b7280; font-style:italic; margin-top:4px;">
    Suite du cursus Master 2 et délibération finale en page 2 ➔
  </div>
  </div><!-- end page 1 -->

  <div class="page-break"></div>

  <!-- ════════════════════ PAGE 2 : MASTER 2 (S3 + S4) + RECAP ════════════════════ -->
  <div class="page-header">
    <div class="logo-box">
      <div class="logo-circle">IUM<br/>MORAVE</div>
    </div>
    <div class="header-center">
      <div class="hdr-republic">République Démocratique du Congo &nbsp;|&nbsp; Ministère de l'ESU</div>
      <div class="hdr-univ" style="font-size:11pt;">Institut Universitaire Morave Willsamal</div>
      <div class="hdr-faculty" style="font-size:7.8pt;">${facultyName.toUpperCase()} &nbsp;—&nbsp; RELEVÉ DE COTES OFFICIEL (PAGE 2 / 2)</div>
    </div>
    <div class="seal-box">
      <div class="seal-circle">Sceau<br/>Officiel</div>
    </div>
  </div>

  <div class="student-card" style="padding:2px 6px; margin-bottom:4px; font-size:7.2pt;">
    <strong>Étudiant :</strong> ${studentName} &nbsp;|&nbsp; <strong>Matricule :</strong> ${matricule} &nbsp;|&nbsp; <strong>Programme :</strong> ${programTitle}
  </div>

  ${page2Blocks}

  <!-- RÉCAPITULATIF GÉNÉRAL -->
  <div class="recap-section">
    <h3>Synthèse de Délibération du Cycle Master (120 Crédits ECTS)</h3>
    <div class="recap-grid">
      <table class="recap-table">
        <thead>
          <tr>
            <th>Semestre</th>
            <th>Crédits</th>
            <th>Points pond.</th>
            <th>Moyenne / 20</th>
          </tr>
        </thead>
        <tbody>${recapRows}</tbody>
        <tfoot>
          <tr>
            <td style="text-align:right; font-weight:700;">TOTAL MASTER</td>
            <td>${globalTotalCredits} ECTS</td>
            <td>${globalTotalPoints.toFixed(1)}</td>
            <td>${globalAvg} / 20</td>
          </tr>
        </tfoot>
      </table>

      <div class="decision-box">
        <div class="dlbl">Décision Finale du Jury :</div>
        <div class="dval">${decisionMain}</div>
        <div><span class="mention-badge">${mentionBadge}</span></div>
        <div style="margin-top:4px; font-size:6.8pt; color:#374151;">
          Moyenne générale : <strong>${globalAvg} / 20</strong><br/>
          Crédits validés : <strong>${globalTotalCredits} / 120 ECTS</strong>
        </div>
      </div>
    </div>
  </div>

  <!-- SIGNATURES OFFICIELLES -->
  <div class="signatures-section">
    <div class="sig-block">
      <div class="sig-title">Pour le Secrétariat du Jury</div>
      <div class="sig-role">Le Secrétaire Académique</div>
      <div class="sig-line"></div>
      <div class="sig-name">Ir. Chef de Travaux / Secrétaire</div>
    </div>
    <div class="sig-block">
      <div class="sig-title">Fait à Mwene-Ditu, le ${dateStr}</div>
      <div class="sig-role">Le Doyen de la Faculté</div>
      <div class="sig-line"></div>
      <div class="sig-name">Prof. Dr. Doyen de la Faculté</div>
    </div>
  </div>

  <!-- PIED DE PAGE SÉCURITÉ -->
  <div class="security-strip">
    <div class="security-text">
      <strong>AUTHENTIFICATION &amp; INTÉGRITÉ CRYPTOGRAPHIQUE — IUM-MORAVE VERIFY</strong><br/>
      Watermark HMAC : <code>${watermark}</code><br/>
      Hash d'intégrité (SHA-256) : <code>${intHash}</code><br/>
      Vérifiable sur : <span class="verify-url">https://iumorave-ac.org/verify?code=${verifCode}</span>
    </div>
    <div class="qr-block">
      <img src="${qrUrl}" alt="QR Code de vérification" />
      <div class="qr-label">Scannez pour vérifier</div>
    </div>
  </div>
  ` : ''}

</body>
</html>`;
}


function diplomaToHtml(diploma) {
  const qrDataUrl = diploma.qrCodeDataUrl || '';
  const watermark = createWatermark({ documentType: 'diploma', studentName: diploma.studentName, matricule: diploma.matricule, documentType: 'diploma' });
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
        body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; color: #0f2340; }
        .header { text-align: center; margin-bottom: 2rem; border-bottom: 3px solid #f5b914; padding-bottom: 1rem; }
        .header h1 { font-size: 1.6rem; margin-bottom: 0.5rem; color: #071e38; }
        .header .subtitle { color: #64748b; font-size: 0.95rem; }
        .content { margin-top: 2rem; }
        .field { margin-bottom: 1rem; }
        .field strong { display: inline-block; width: 180px; color: #334155; }
        .mention { display: inline-block; padding: 0.4rem 0.8rem; border-radius: 0.5rem; background: #fef9c3; color: #854d0e; font-weight: 700; font-size: 0.9rem; }
        .footer { margin-top: 3rem; border-top: 1px solid #e2e8f0; padding-top: 1rem; font-size: 0.8rem; color: #64748b; display: flex; justify-content: space-between; }
        .qr { margin-top: 1rem; text-align: right; }
        .qr img { width: 140px; height: 140px; }
        .seal { width: 80px; height: 80px; border-radius: 50%; border: 2px solid #f5b914; display: inline-flex; align-items: center; justify-content: center; color: #f5b914; font-weight: 900; font-size: 0.7rem; text-align: center; margin-top: 0.5rem; }
        .security { margin-top: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.5rem; font-size: 0.75rem; color: #475569; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Diplôme Officiel</h1>
        <div class="subtitle">Institut Universitaire Morave de Mwene-Ditu — ${diploma.academicYear}</div>
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
