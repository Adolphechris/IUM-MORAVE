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
  const gradesRows = (transcript.grades || []).map((grade, index) => {
    const courseCode = grade.courseCode || grade.code || `UE-${index + 1}`;
    const courseTitle = grade.courseTitle || grade.title || 'Matière académique';
    const credits = grade.credits || 6;
    const score = grade.score !== undefined ? grade.score : (grade.scoreNum || 15);
    const volumeCours = grade.volumeCours || 40;
    const volumeTdTp = grade.volumeTdTp || '15+25+70';
    return `
    <tr>
      <td style="text-align:center; font-weight:bold;">${index + 1}</td>
      <td style="text-align:left;"><strong>${courseCode}</strong> — ${courseTitle}</td>
      <td style="text-align:center;">${volumeCours}h (${volumeTdTp})</td>
      <td style="text-align:center; font-weight:bold;">${credits}</td>
      <td style="text-align:center; font-weight:bold; font-size:0.95rem;">${score} / 20</td>
    </tr>
  `;
  }).join('');

  const watermark = createWatermark({ documentType: transcript.documentType || 'releve', studentName: transcript.student?.name || '', matricule: transcript.student?.matricule || '', documentType: transcript.documentType || 'releve' });
  const timestamp = createTimestamp({ verificationCode: transcript.verificationCode || 'IUM-2026', documentType: transcript.documentType || 'releve' });
  const documentSignature = signPdfMeta({ documentType: transcript.documentType || 'releve', verificationCode: transcript.verificationCode || 'IUM-2026', integrityHash: transcript.integrityHash || 'SECURE-HMAC' });

  const studentName = transcript.student?.name || transcript.studentName || 'Étudiant IUM-MORAVE';
  const matricule = transcript.student?.matricule || transcript.matricule || '2026-IUM-001';
  const programTitle = transcript.program?.title || transcript.programTitle || 'Licence en Ingénierie & Nouvelles Technologies';
  const academicYear = transcript.academicYear || '2025-2026';
  const weightedAvg = transcript.weightedAverage || 15.5;
  const decision = transcript.decision || 'ADMIS (Mention Distinction)';

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Relevé Officiel des Cotes — IUM-MORAVE</title>
      <style>
        @page { size: A4; margin: 1.5cm; }
        body { font-family: 'Times New Roman', Times, serif, ui-sans-serif; color: #0b1329; margin:0; padding:0; line-height: 1.3; }
        
        .header-table { width: 100%; margin-bottom: 1rem; border-bottom: 2px solid #071e38; padding-bottom: 0.5rem; }
        .header-left { width: 25%; text-align: center; vertical-align: middle; }
        .header-center { width: 50%; text-align: center; vertical-align: middle; }
        .header-right { width: 25%; text-align: center; vertical-align: middle; }
        
        .inst-title { font-size: 0.75rem; font-weight: bold; letter-spacing: 0.05em; text-transform: uppercase; color: #334155; }
        .inst-main { font-size: 1.15rem; font-weight: 900; color: #071e38; text-transform: uppercase; margin: 0.2rem 0; }
        .inst-sub { font-size: 0.85rem; font-weight: bold; color: #0f172a; }
        .inst-location { font-size: 0.75rem; color: #475569; font-style: italic; }

        .doc-title-box { text-align: center; margin: 1.2rem 0 1rem 0; background: #f8fafc; padding: 0.6rem; border: 1.5px solid #071e38; border-radius: 6px; }
        .doc-title { font-size: 1.25rem; font-weight: 900; letter-spacing: 0.08em; color: #071e38; text-transform: uppercase; margin: 0; }
        .doc-num { font-size: 0.85rem; font-weight: bold; color: #475569; margin-top: 0.2rem; }

        .student-info-box { width: 100%; margin-bottom: 1.2rem; font-size: 0.9rem; line-height: 1.5; border-collapse: collapse; }
        .student-info-box td { padding: 0.25rem 0.4rem; vertical-align: top; }

        .grades-table { width: 100%; border-collapse: collapse; margin-bottom: 1.2rem; font-size: 0.82rem; }
        .grades-table th { background: #071e38; color: #ffffff; padding: 0.5rem 0.3rem; border: 1px solid #071e38; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.03em; }
        .grades-table td { border: 1px solid #cbd5e1; padding: 0.45rem 0.4rem; }
        .grades-table tr:nth-child(even) { background: #f8fafc; }

        .summary-box { width: 100%; margin-bottom: 1.5rem; padding: 0.6rem; background: #edf2f7; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 0.88rem; }
        .summary-box table { width: 100%; border-collapse: collapse; }
        .summary-box td { padding: 0.2rem 0.5rem; }

        .signatures-table { width: 100%; margin-top: 1.5rem; font-size: 0.85rem; text-align: center; border-collapse: collapse; }
        .signatures-table td { width: 50%; vertical-align: top; padding: 0.5rem; }
        .sig-title { font-weight: bold; text-decoration: underline; margin-bottom: 3.5rem; color: #0f172a; }
        .sig-name { font-weight: bold; font-size: 0.9rem; color: #071e38; }

        .security-footer { margin-top: 2rem; border-top: 1px solid #cbd5e1; padding-top: 0.75rem; font-size: 0.72rem; color: #64748b; display: flex; justify-content: space-between; align-items: center; }
        .qr-box { text-align: center; }
        .qr-box img { width: 100px; height: 100px; border: 1px solid #cbd5e1; padding: 4px; background: #fff; }
      </style>
    </head>
    <body>

      <!-- ENTÊTE INSTITUTIONNEL ESU (MODÈLE UNILU / IUM-MORAVE) -->
      <table class="header-table">
        <tr>
          <td class="header-left">
            <img src="https://iumorave-ac.org/images/logo-crest.jpg" style="width: 75px; height: auto;" alt="Blason IUM-MORAVE" />
          </td>
          <td class="header-center">
            <div class="inst-title">République Démocratique du Congo</div>
            <div class="inst-title">Ministère de l'Enseignement Supérieur et Universitaire (ESU)</div>
            <div class="inst-main">Institut Universitaire Morave Willsamal</div>
            <div class="inst-sub">${facultyName.toUpperCase()}</div>
            <div class="inst-location">Agrément ESU N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 du 09 Avril 2018<br/>B.P. 126 — Mwene-Ditu, Province de Lomami</div>
          </td>
          <td class="header-right">
            <div style="border: 1px solid #cbd5e1; padding: 4px; background: #f8fafc; font-size: 0.65rem; color: #475569; text-align:center;">
              Sceau Officiel Homologué
            </div>
          </td>
        </tr>
      </table>

      <!-- TITRE DU DOCUMENT -->
      <div class="doc-title-box">
        <div class="doc-title">RELEVÉ DE COTES OFFICIEL</div>
        <div class="doc-num">N° IUM / ${facultyName.substring(0, 4).toUpperCase()} / ${transcript.verificationCode || '2026-0042'}</div>
      </div>

      <!-- INFORMATIONS DE L'ÉTUDIANT -->
      <table class="student-info-box">
        <tr>
          <td><strong>Nom & Prénom(s) :</strong> ${studentName.toUpperCase()}</td>
          <td><strong>Matricule :</strong> <code>${matricule}</code></td>
        </tr>
        <tr>
          <td><strong>Programme & Filière :</strong> ${programTitle}</td>
          <td><strong>Année Académique :</strong> ${academicYear}</td>
        </tr>
        <tr>
          <td colspan="2"><strong>Niveau d'Études :</strong> ${transcript.program?.level || transcript.level || 'Licence (Système LMD)'}</td>
        </tr>
      </table>

      <!-- TABLEAU DES RELEVÉS DE COTES -->
      <table class="grades-table">
        <thead>
          <tr>
            <th style="width: 5%;">N°</th>
            <th style="width: 45%;">Matières / Unités d'Enseignement (UE)</th>
            <th style="width: 20%;">Vol. Horaire (Cours / TP-TD)</th>
            <th style="width: 12%;">Crédits</th>
            <th style="width: 18%;">Côte / 20</th>
          </tr>
        </thead>
        <tbody>
          ${gradesRows}
        </tbody>
      </table>

      <!-- SYNTHÈSE DES RÉSULTATS ET DÉCISION DU JURY -->
      <div class="summary-box">
        <table>
          <tr>
            <td><strong>MOYENNE PONDÉRÉE :</strong> <span style="font-size:1.1rem; color:#071e38; font-weight:bold;">${weightedAvg} / 20</span></td>
            <td><strong>TOTAL CRÉDITS VALIDÉS :</strong> <span style="font-size:1.1rem; color:#071e38; font-weight:bold;">60 / 60 ECTS</span></td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:0.4rem;">
              <strong>DÉCISION DU JURY :</strong> <span style="font-size:1.05rem; color:#166534; font-weight:bold; background:#dcfce7; padding:2px 8px; border-radius:4px;">${decision.toUpperCase()}</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- ZONE DES SIGNATURES OFFICIELLES (SECRÉTAIRE + DOYEN) -->
      <table class="signatures-table">
        <tr>
          <td>
            <div class="sig-title">Pour le Secrétariat du Jury</div>
            <div style="font-size:0.8rem; color:#64748b; font-style:italic;">Le Secrétaire Académique</div>
            <br/><br/>
            <div class="sig-name">Ir. Chef de Travaux / Secrétaire</div>
          </td>
          <td>
            <div class="sig-title">Fait à Mwene-Ditu, le ${new Date().toLocaleDateString('fr-FR')}</div>
            <div style="font-size:0.8rem; color:#64748b; font-style:italic;">Le Doyen de la Faculté</div>
            <br/><br/>
            <div class="sig-name">Prof. Dr. Doyen de la Faculté</div>
          </td>
        </tr>
      </table>

      <!-- PIED DE PAGE SÉCURITÉ CRYPTOGRAPHIQUE HMAC + QR CODE -->
      <div class="security-footer">
        <div style="width: 75%;">
          <p style="margin:0 0 0.2rem 0; font-weight:bold; color:#071e38;">🛡️ AUTHENTICATION & INTÉGRITÉ CRYPTOGRAPHIQUE (IUM-MORAVE VERIFY)</p>
          <p style="margin:0 0 0.2rem 0;">Watermark HMAC : <code>${watermark}</code></p>
          <p style="margin:0 0 0.2rem 0;">Hash d'Intégrité : <code>${transcript.integrityHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae...'}</code></p>
          <p style="margin:0;">Vérifiable publiquement sur : <strong>https://iumorave-ac.org/verify</strong></p>
        </div>
        <div class="qr-box">
          <img src="${transcript.qrCodeDataUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://iumorave-ac.org/verify'}" alt="QR Code" />
          <div style="font-size:0.65rem; color:#64748b; margin-top:2px;">Scannez pour vérifier</div>
        </div>
      </div>

    </body>
    </html>
  `;
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
