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
  const gradesRows = transcript.grades.map(grade => `
    <tr>
      <td>${grade.courseCode}</td>
      <td>${grade.courseTitle}</td>
      <td>${grade.credits}</td>
      <td>${grade.score}/20</td>
      <td>${grade.status === 'validated' ? 'Validé' : 'En attente'}</td>
    </tr>
  `).join('');

  const watermark = createWatermark({ documentType: transcript.documentType, studentName: transcript.student.name, matricule: transcript.student.matricule, documentType: transcript.documentType });
  const timestamp = createTimestamp({ verificationCode: transcript.verificationCode, documentType: transcript.documentType });
  const documentSignature = signPdfMeta({ documentType: transcript.documentType, verificationCode: transcript.verificationCode, integrityHash: transcript.integrityHash });

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Relevé de notes — IUM-MORAVE</title>
      <style>
        @page { size: A4; margin: 2cm; }
        body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; color: #0f2340; }
        .header { text-align: center; margin-bottom: 2rem; }
        .header h1 { font-size: 1.4rem; margin-bottom: 0.25rem; }
        .header p { color: #64748b; font-size: 0.9rem; }
        .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1.5rem; }
        .meta div { font-size: 0.9rem; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
        th, td { border: 1px solid #e2e8f0; padding: 0.5rem; text-align: left; font-size: 0.85rem; }
        th { background: #071e38; color: #fff; }
        .footer { margin-top: 2rem; border-top: 1px solid #e2e8f0; padding-top: 1rem; font-size: 0.8rem; color: #64748b; }
        .qr { margin-top: 1rem; text-align: right; }
        .qr img { width: 120px; height: 120px; }
        .badge { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.8rem; font-weight: 700; }
        .badge-valid { background: #dcfce7; color: #166534; }
        .badge-pending { background: #fef9c3; color: #854d0e; }
        .security { margin-top: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.5rem; font-size: 0.75rem; color: #475569; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Institut Universitaire Morave de Mwene-Ditu</h1>
        <p>Relevé de notes — Document officiel signé HMAC-SHA-256</p>
      </div>

      <div class="meta">
        <div><strong>Étudiant :</strong> ${transcript.student.name} (${transcript.student.matricule})</div>
        <div><strong>Programme :</strong> ${transcript.program.title} (${transcript.program.level})</div>
        <div><strong>Année académique :</strong> ${transcript.academicYear}</div>
        <div><strong>Mention :</strong> ${transcript.decision === 'validated' ? 'Admis' : 'En attente'}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Cours</th>
            <th>Crédits</th>
            <th>Note</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          ${gradesRows}
        </tbody>
      </table>

      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <p><strong>Moyenne pondérée :</strong> ${transcript.weightedAverage}/20</p>
          <p><strong>Décision :</strong> ${transcript.decision === 'validated' ? 'Résultats validés' : 'Résultats en attente de validation'}</p>
          <p><strong>Code de vérification :</strong> ${transcript.verificationCode}</p>
          <p><strong>Signature document :</strong> ${documentSignature}</p>
          <p><strong>Émis le :</strong> ${new Date(transcript.issuedAt).toLocaleString('fr-FR')}</p>
        </div>
        <div class="qr">
          <p style="font-size:0.8rem; color:#64748b; margin-bottom:0.25rem;">Vérifier ce document</p>
          <img src="${transcript.qrCodeDataUrl}" alt="QR Code de vérification" />
        </div>
      </div>

      <div class="security">
        <p><strong>Sécurité avancée :</strong></p>
        <p>Watermark : ${watermark}</p>
        <p>Timestamp : ${timestamp}</p>
        <p>Signature HMAC : ${documentSignature}</p>
      </div>

      <div class="footer">
        <p>Document officiel de l'IUM-MORAVE. Agrément ESU N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018.</p>
        <p>Signature électronique : HMAC-SHA-256 — Integrity Hash : ${transcript.integrityHash}</p>
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
