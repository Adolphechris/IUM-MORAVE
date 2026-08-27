import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ReleveOfficielPage() {
  const student = {
    name: 'MUKENDI KALONJI ADOLPHE',
    matricule: '2026-M2-ISI-088',
    program: 'Master en Sciences et Technologie — Mention Ingénierie Sécurité Informatique',
    level: 'Master (120 ECTS / 4 Semestres)',
    years: '2026-2027 / 2027-2028',
    decision: 'ADMIS — MENTION TRÈS BIEN (B)',
    average: '16.06 / 20',
    totalCredits: '120 / 120 ECTS',
    totalPoints: '1927.0',
    code: 'IUM-2026-M2-ISI-088',
    hash: '6e94616c4251b2d400886bf3efc1c2042964fa04b3d03addcaf375835d3fbeba'
  };

  const sem1 = [
    { n: 1, code: 'ROI2111', title: 'Recherche opérationnelle pour ingénieur informaticien', c: 40, td: '15+25+70', cr: 4, score: '15.0', pts: '60.0' },
    { n: 2, code: 'TPI2111', title: 'Théories de probabilités pour ingénieur informaticien', c: 40, td: '15+25+70', cr: 4, score: '14.0', pts: '56.0' },
    { n: 3, code: 'AGT2111', title: 'Anglais technique-1', c: 30, td: '15+15+45', cr: 3, score: '16.0', pts: '48.0' },
    { n: 4, code: 'LFS2111', title: 'Langage formel et compilation', c: 45, td: '20+20+85', cr: 5, score: '14.0', pts: '70.0' },
    { n: 5, code: 'LAS2111', title: 'Langage système', c: 45, td: '20+20+85', cr: 5, score: '15.0', pts: '75.0' },
    { n: 6, code: 'ALG2111', title: 'Algorithmes et structures de données avancées', c: 45, td: '20+20+85', cr: 5, score: '17.0', pts: '85.0' },
    { n: 7, code: 'SOR2111', title: 'Système d\'objets répartis', c: 40, td: '15+25+70', cr: 4, score: '14.0', pts: '56.0' },
  ];

  const sem2 = [
    { n: 8, code: 'TCO2121', title: 'Théorie du codage', c: 40, td: '15+25+70', cr: 4, score: '16.0', pts: '64.0' },
    { n: 9, code: 'SSE2122', title: 'Sécurité des systèmes d\'exploitation', c: 40, td: '15+25+70', cr: 4, score: '15.0', pts: '60.0' },
    { n: 10, code: 'CRY2121', title: 'Cryptologie', c: 40, td: '15+25+70', cr: 4, score: '17.0', pts: '68.0' },
    { n: 11, code: 'MSD2121', title: 'Méthodes de sécurisation des données', c: 40, td: '15+25+70', cr: 4, score: '15.0', pts: '60.0' },
    { n: 12, code: 'SAR2121', title: 'Sécurité des applications et des réseaux', c: 40, td: '15+25+70', cr: 4, score: '16.0', pts: '64.0' },
    { n: 13, code: 'PRP2121', title: 'Programmation parallèle', c: 40, td: '15+25+70', cr: 4, score: '15.0', pts: '60.0' },
    { n: 14, code: 'INFA11', title: 'Projet-4 & Application pratique', c: 20, td: '00+40+90', cr: 6, score: '17.0', pts: '102.0' },
  ];

  const sem3 = [
    { n: 15, code: 'DLC2131', title: 'Développement de logiciels cryptographiques', c: 40, td: '15+25+70', cr: 4, score: '16.0', pts: '64.0' },
    { n: 16, code: 'CRA2131', title: 'Cryptologie avancée', c: 50, td: '20+30+100', cr: 6, score: '17.0', pts: '102.0' },
    { n: 17, code: 'PRR2131', title: 'Programmation réseaux', c: 50, td: '20+30+100', cr: 6, score: '15.0', pts: '90.0' },
    { n: 18, code: 'MTR2131', title: 'Méthodes et techniques de rédaction scientifique', c: 40, td: '15+25+70', cr: 4, score: '16.0', pts: '64.0' },
    { n: 19, code: 'DIR2131', title: 'Détection des intrusions et réponses aux incidents', c: 45, td: '20+20+85', cr: 5, score: '17.0', pts: '85.0' },
    { n: 20, code: 'IRD2131', title: 'Interconnexion et routage dynamique', c: 45, td: '20+20+85', cr: 5, score: '15.0', pts: '75.0' },
  ];

  const sem4 = [
    { n: 21, code: 'CEI2141', title: 'Contrôle d\'accès et extraction d\'information', c: 30, td: '10+15+50', cr: 3, score: '16.0', pts: '48.0' },
    { n: 22, code: 'APS2141', title: 'Audit et plan de la sécurité informatique', c: 20, td: '10+10+30', cr: 2, score: '17.0', pts: '34.0' },
    { n: 23, code: 'SSL2141', title: 'Sécurité des services en ligne', c: 30, td: '10+15+50', cr: 3, score: '15.0', pts: '45.0' },
    { n: 24, code: 'ENT2141', title: 'Entrepreneuriat-2', c: 20, td: '10+10+30', cr: 2, score: '16.0', pts: '32.0' },
    { n: 25, code: 'ISI2141', title: 'Stage académique en entreprise / laboratoire', c: 0, td: '00+150+100', cr: 10, score: '18.0', pts: '180.0' },
    { n: 26, code: 'PTS2141', title: 'Projet tutoré & Soutenance du Mémoire de Master', c: 0, td: '00+150+100', cr: 10, score: '18.0', pts: '180.0' },
  ];

  return (
    <>
      <Head>
        <title>Relevé de Cotes Officiel — MUKENDI KALONJI Adolphe | IUM-MORAVE</title>
      </Head>

      <div className="no-print control-bar">
        <Link href="/" className="btn-back">← Portail Public</Link>
        <span className="title-bar">🎓 Relevé Officiel Master ISI — MUKENDI KALONJI Adolphe</span>
        <button onClick={() => window.print()} className="btn-print">🖨️ Imprimer en PDF</button>
      </div>

      <div className="doc-sheet page-1">
        <header className="page-header">
          <div className="logo-box"><div className="logo-circle">IUM<br/>MORAVE</div></div>
          <div className="header-center">
            <div className="hdr-republic">République Démocratique du Congo</div>
            <div className="hdr-ministry">Ministère de l'Enseignement Supérieur et Universitaire (ESU)</div>
            <div className="hdr-univ">Institut Universitaire Morave Willsamal</div>
            <div className="hdr-faculty">FACULTÉ DES SCIENCES ET TECHNOLOGIES</div>
            <div className="hdr-agrement">Agrément ESU N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 du 09 Avril 2018 | B.P. 126 — Mwene-Ditu, Province de Lomami</div>
          </div>
          <div className="seal-box"><div className="seal-circle">Sceau<br/>Officiel<br/>Homologué</div></div>
        </header>

        <div className="doc-title-strip">
          <h1>RELEVÉ DE COTES OFFICIEL</h1>
          <div className="doc-ref">N° IUM / FST / {student.code} — PAGE 1 / 2</div>
        </div>

        <div className="student-card">
          <div className="info-grid">
            <div><strong>Nom &amp; Prénom(s) : </strong>{student.name}</div>
            <div><strong>Matricule : </strong><code>{student.matricule}</code></div>
            <div className="full"><strong>Programme &amp; Filière : </strong>{student.program}</div>
            <div><strong>Niveau d'Études : </strong>{student.level}</div>
            <div><strong>Années Académiques : </strong>{student.years}</div>
          </div>
        </div>

        {/* Semestre 1 */}
        <div className="sem-block">
          <div className="sem-header">
            <span className="sem-year">MASTER 1</span>
            <span className="sem-name">SEMESTRE 1 (S1)</span>
            <span className="sem-ects">30 ECTS | 7 UE</span>
          </div>
          <table className="grades-table">
            <thead>
              <tr>
                <th style={{ width: '4%' }}>N°</th>
                <th style={{ width: '40%', textAlign: 'left', paddingLeft: '6px' }}>Matières / Unités d'Enseignement (UE)</th>
                <th style={{ width: '8%' }}>Cours (h)</th>
                <th style={{ width: '12%' }}>TD+TP+TPE (h)</th>
                <th style={{ width: '7%' }}>Créd.</th>
                <th style={{ width: '10%' }}>Côte /20</th>
                <th style={{ width: '10%' }}>Points Pond.</th>
              </tr>
            </thead>
            <tbody>
              {sem1.map(g => (
                <tr key={g.n}>
                  <td className="tc">{g.n}</td>
                  <td className="tl"><span className="ue-code">{g.code}</span> {g.title}</td>
                  <td className="tc">{g.c}</td>
                  <td className="tc">{g.td}</td>
                  <td className="tc fw">{g.cr}</td>
                  <td className="tc fw score">{g.score}</td>
                  <td className="tc fw pts">{g.pts}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="sem-total">
                <td colSpan={4} style={{ textAlign: 'right', paddingRight: '8px' }}>SOUS-TOTAL SEMESTRE 1 (S1) :</td>
                <td className="tc fw">30</td>
                <td className="tc fw avg-cell">15.00</td>
                <td className="tc fw pts">450.0</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Semestre 2 */}
        <div className="sem-block">
          <div className="sem-header">
            <span className="sem-year">MASTER 1</span>
            <span className="sem-name">SEMESTRE 2 (S2)</span>
            <span className="sem-ects">30 ECTS | 7 UE</span>
          </div>
          <table className="grades-table">
            <thead>
              <tr>
                <th style={{ width: '4%' }}>N°</th>
                <th style={{ width: '40%', textAlign: 'left', paddingLeft: '6px' }}>Matières / Unités d'Enseignement (UE)</th>
                <th style={{ width: '8%' }}>Cours (h)</th>
                <th style={{ width: '12%' }}>TD+TP+TPE (h)</th>
                <th style={{ width: '7%' }}>Créd.</th>
                <th style={{ width: '10%' }}>Côte /20</th>
                <th style={{ width: '10%' }}>Points Pond.</th>
              </tr>
            </thead>
            <tbody>
              {sem2.map(g => (
                <tr key={g.n}>
                  <td className="tc">{g.n}</td>
                  <td className="tl"><span className="ue-code">{g.code}</span> {g.title}</td>
                  <td className="tc">{g.c}</td>
                  <td className="tc">{g.td}</td>
                  <td className="tc fw">{g.cr}</td>
                  <td className="tc fw score">{g.score}</td>
                  <td className="tc fw pts">{g.pts}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="sem-total">
                <td colSpan={4} style={{ textAlign: 'right', paddingRight: '8px' }}>SOUS-TOTAL SEMESTRE 2 (S2) :</td>
                <td className="tc fw">30</td>
                <td className="tc fw avg-cell">15.93</td>
                <td className="tc fw pts">478.0</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style={{ textAlign: 'right', fontSize: '7pt', color: '#6b7280', fontStyle: 'italic', marginTop: '6px' }}>
          Suite du cursus Master 2 et délibération finale en page 2 ➔
        </div>
      </div>

      <div className="doc-sheet page-2">
        <header className="page-header">
          <div className="logo-box"><div className="logo-circle">IUM<br/>MORAVE</div></div>
          <div className="header-center">
            <div className="hdr-republic">République Démocratique du Congo | Ministère de l'ESU</div>
            <div className="hdr-univ" style={{ fontSize: '11pt' }}>Institut Universitaire Morave Willsamal</div>
            <div className="hdr-faculty" style={{ fontSize: '8pt' }}>FACULTÉ DES SCIENCES ET TECHNOLOGIES — RELEVÉ DE COTES OFFICIEL (PAGE 2 / 2)</div>
          </div>
          <div className="seal-box"><div className="seal-circle">Sceau<br/>Officiel</div></div>
        </header>

        <div className="student-card" style={{ padding: '3px 8px', marginBottom: '6px', fontSize: '7.5pt' }}>
          <strong>Étudiant : </strong>{student.name} &nbsp;|&nbsp; <strong>Matricule : </strong><code>{student.matricule}</code> &nbsp;|&nbsp; <strong>Programme : </strong>{student.program}
        </div>

        {/* Semestre 3 */}
        <div className="sem-block">
          <div className="sem-header">
            <span className="sem-year">MASTER 2</span>
            <span className="sem-name">SEMESTRE 3 (S3)</span>
            <span className="sem-ects">30 ECTS | 6 UE</span>
          </div>
          <table className="grades-table">
            <thead>
              <tr>
                <th style={{ width: '4%' }}>N°</th>
                <th style={{ width: '40%', textAlign: 'left', paddingLeft: '6px' }}>Matières / Unités d'Enseignement (UE)</th>
                <th style={{ width: '8%' }}>Cours (h)</th>
                <th style={{ width: '12%' }}>TD+TP+TPE (h)</th>
                <th style={{ width: '7%' }}>Créd.</th>
                <th style={{ width: '10%' }}>Côte /20</th>
                <th style={{ width: '10%' }}>Points Pond.</th>
              </tr>
            </thead>
            <tbody>
              {sem3.map(g => (
                <tr key={g.n}>
                  <td className="tc">{g.n}</td>
                  <td className="tl"><span className="ue-code">{g.code}</span> {g.title}</td>
                  <td className="tc">{g.c}</td>
                  <td className="tc">{g.td}</td>
                  <td className="tc fw">{g.cr}</td>
                  <td className="tc fw score">{g.score}</td>
                  <td className="tc fw pts">{g.pts}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="sem-total">
                <td colSpan={4} style={{ textAlign: 'right', paddingRight: '8px' }}>SOUS-TOTAL SEMESTRE 3 (S3) :</td>
                <td className="tc fw">30</td>
                <td className="tc fw avg-cell">16.00</td>
                <td className="tc fw pts">480.0</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Semestre 4 */}
        <div className="sem-block">
          <div className="sem-header">
            <span className="sem-year">MASTER 2</span>
            <span className="sem-name">SEMESTRE 4 (S4)</span>
            <span className="sem-ects">30 ECTS | 6 UE</span>
          </div>
          <table className="grades-table">
            <thead>
              <tr>
                <th style={{ width: '4%' }}>N°</th>
                <th style={{ width: '40%', textAlign: 'left', paddingLeft: '6px' }}>Matières / Unités d'Enseignement (UE)</th>
                <th style={{ width: '8%' }}>Cours (h)</th>
                <th style={{ width: '12%' }}>TD+TP+TPE (h)</th>
                <th style={{ width: '7%' }}>Créd.</th>
                <th style={{ width: '10%' }}>Côte /20</th>
                <th style={{ width: '10%' }}>Points Pond.</th>
              </tr>
            </thead>
            <tbody>
              {sem4.map(g => (
                <tr key={g.n}>
                  <td className="tc">{g.n}</td>
                  <td className="tl"><span className="ue-code">{g.code}</span> {g.title}</td>
                  <td className="tc">{g.c}</td>
                  <td className="tc">{g.td}</td>
                  <td className="tc fw">{g.cr}</td>
                  <td className="tc fw score">{g.score}</td>
                  <td className="tc fw pts">{g.pts}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="sem-total">
                <td colSpan={4} style={{ textAlign: 'right', paddingRight: '8px' }}>SOUS-TOTAL SEMESTRE 4 (S4) :</td>
                <td className="tc fw">30</td>
                <td className="tc fw avg-cell">17.30</td>
                <td className="tc fw pts">519.0</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Récapitulatif */}
        <div className="recap-section">
          <h3>Synthèse de Délibération du Cycle Master (120 Crédits ECTS)</h3>
          <div className="recap-grid">
            <table className="recap-table">
              <thead>
                <tr>
                  <th>Semestre</th>
                  <th>Crédits</th>
                  <th>Points pond.</th>
                  <th>Moyenne / 20</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="tc fw">SEMESTRE 1 (S1)</td><td className="tc">30</td><td className="tc">450.0</td><td className="tc fw avg-cell">15.00</td></tr>
                <tr><td className="tc fw">SEMESTRE 2 (S2)</td><td className="tc">30</td><td className="tc">478.0</td><td className="tc fw avg-cell">15.93</td></tr>
                <tr><td className="tc fw">SEMESTRE 3 (S3)</td><td className="tc">30</td><td className="tc">480.0</td><td className="tc fw avg-cell">16.00</td></tr>
                <tr><td className="tc fw">SEMESTRE 4 (S4)</td><td className="tc">30</td><td className="tc">519.0</td><td className="tc fw avg-cell">17.30</td></tr>
              </tbody>
              <tfoot>
                <tr>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>TOTAL MASTER</td>
                  <td>120 ECTS</td>
                  <td>1927.0</td>
                  <td>16.06 / 20</td>
                </tr>
              </tfoot>
            </table>

            <div className="decision-box">
              <div className="dlbl">Décision Finale du Jury :</div>
              <div className="dval">ADMIS</div>
              <div><span className="mention-badge">MENTION TRÈS BIEN (B)</span></div>
              <div style={{ marginTop: '4px', fontSize: '7pt', color: '#374151' }}>
                Moyenne générale : <strong>16.06 / 20</strong><br/>
                Crédits validés : <strong>120 / 120 ECTS</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="signatures-section">
          <div className="sig-block">
            <div className="sig-title">Pour le Secrétariat du Jury</div>
            <div className="sig-role">Le Secrétaire Académique</div>
            <div className="sig-line"></div>
            <div className="sig-name">Ir. Chef de Travaux / Secrétaire</div>
          </div>
          <div className="sig-block">
            <div className="sig-title">Fait à Mwene-Ditu, le 27 août 2026</div>
            <div className="sig-role">Le Doyen de la Faculté</div>
            <div className="sig-line"></div>
            <div className="sig-name">Prof. Dr. Doyen de la Faculté</div>
          </div>
        </div>

        {/* Sécurité */}
        <div className="security-strip">
          <div className="security-text">
            <strong>AUTHENTIFICATION &amp; INTÉGRITÉ CRYPTOGRAPHIQUE — IUM-MORAVE VERIFY</strong><br/>
            Watermark HMAC : <code>e00404290fac7a20ad3637e00293345345fca6198bbf986ac489b9eb5c6c6109</code><br/>
            Hash d'intégrité (SHA-256) : <code>{student.hash}</code><br/>
            Vérifiable sur : <span className="verify-url">https://iumorave-ac.org/verify?code={student.code}</span>
          </div>
          <div className="qr-block">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=https://iumorave-ac.org/verify?code=IUM-2026-M2-ISI-088" alt="QR Code" />
            <div className="qr-label">Scannez pour vérifier</div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @page { size: A4 portrait; margin: 10mm 12mm 8mm 12mm; }
        body { font-family: Arial, Helvetica, sans-serif; background: #334155; margin: 0; padding: 0; color: #111827; }
        
        .control-bar {
          background: #0f172a;
          color: #fff;
          padding: 0.75rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
        }
        .btn-back { color: #38bdf8; text-decoration: none; font-weight: 700; }
        .title-bar { font-weight: 700; font-size: 0.95rem; }
        .btn-print {
          background: #0284c7;
          color: #fff;
          border: none;
          padding: 0.5rem 1.25rem;
          border-radius: 0.375rem;
          font-weight: 800;
          cursor: pointer;
        }
        .btn-print:hover { background: #0369a1; }

        .doc-sheet {
          width: 210mm;
          min-height: 297mm;
          background: #ffffff;
          margin: 20px auto;
          padding: 12mm 14mm 10mm 14mm;
          box-sizing: border-box;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          font-size: 8pt;
          line-height: 1.3;
        }

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

        .doc-title-strip { background: #0c2461; color: #fff; text-align: center; padding: 4px 0 3px 0; margin-bottom: 6px; border-radius: 2px; }
        .doc-title-strip h1 { font-size: 10.5pt; font-weight: 900; letter-spacing: 0.1em; margin: 0; text-transform: uppercase; }
        .doc-title-strip .doc-ref { font-size: 6.5pt; letter-spacing: 0.06em; opacity: 0.85; margin-top: 1px; }

        .student-card { border: 1pt solid #d1d5db; border-radius: 3px; padding: 4px 8px; margin-bottom: 6px; background: #f9fafb; }
        .info-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 2px 12px; }
        .info-grid .full { grid-column: 1 / -1; }

        .sem-block { margin-bottom: 6px; }
        .sem-header { background: #1e40af; color: #fff; display: flex; align-items: center; padding: 2.5px 6px; border-radius: 2px 2px 0 0; }
        .sem-year { font-size: 7pt; font-weight: 700; background: rgba(255,255,255,0.2); padding: 1px 6px; border-radius: 2px; margin-right: 6px; white-space: nowrap; }
        .sem-name { font-size: 8pt; font-weight: 700; flex: 1; letter-spacing: 0.03em; }
        .sem-ects { font-size: 6.8pt; opacity: 0.9; white-space: nowrap; }

        .grades-table { width: 100%; border-collapse: collapse; font-size: 7.4pt; border: 1pt solid #93c5fd; }
        .grades-table thead tr { background: #dbeafe; color: #1e3a8a; }
        .grades-table thead th { border: 0.5pt solid #93c5fd; padding: 2.5px 3px; font-weight: 700; text-align: center; font-size: 6.5pt; line-height: 1.2; }
        .grades-table tbody td { border: 0.5pt solid #e5e7eb; padding: 2px 3px; vertical-align: middle; }
        .grades-table tbody tr:nth-child(even) { background: #f0f9ff; }
        .grades-table tfoot td { border: 0.5pt solid #93c5fd; padding: 2.5px 3px; }
        .tc { text-align: center; }
        .tl { text-align: left; }
        .fw { font-weight: 700; }
        .ue-code { font-family: monospace; font-size: 6.5pt; color: #1e40af; background: #eff6ff; padding: 0 2px; border-radius: 2px; font-weight: 700; }
        .score { color: #1e40af; font-size: 7.8pt; }
        .pts { color: #374151; }
        .avg-cell { color: #0c2461; font-size: 8pt; }
        .sem-total td { font-size: 7.8pt; font-weight: 700; background: #bfdbfe !important; }

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

        .signatures-section { display: flex; justify-content: space-between; margin-top: 8px; margin-bottom: 6px; }
        .sig-block { width: 47%; text-align: center; font-size: 7.5pt; }
        .sig-block .sig-title { font-weight: 700; text-decoration: underline; margin-bottom: 1px; color: #0c2461; font-size: 7.5pt; }
        .sig-block .sig-role { color: #6b7280; font-style: italic; font-size: 6.8pt; }
        .sig-line { border-bottom: 1pt solid #374151; width: 75%; margin: 14px auto 4px auto; }
        .sig-block .sig-name { font-weight: 700; font-size: 8pt; color: #0c2461; }

        .security-strip { border-top: 1pt solid #d1d5db; padding-top: 4px; margin-top: 4px; display: flex; align-items: center; gap: 8px; }
        .security-text { flex: 1; font-size: 6pt; color: #6b7280; line-height: 1.4; }
        .security-text strong { color: #374151; font-size: 6.5pt; }
        .security-text code { font-family: monospace; font-size: 5.5pt; word-break: break-all; color: #374151; }
        .verify-url { font-size: 6.2pt; font-weight: 700; color: #1e40af; }
        .qr-block { text-align: center; flex-shrink: 0; }
        .qr-block img { width: 62px; height: 62px; display: block; border: 0.5pt solid #d1d5db; }
        .qr-block .qr-label { font-size: 5pt; color: #9ca3af; margin-top: 1px; }

        @media print {
          body { background: #fff !important; }
          .no-print { display: none !important; }
          .doc-sheet { box-shadow: none !important; margin: 0 !important; width: 100% !important; padding: 0 !important; }
          .page-1 { page-break-after: always; }
        }
      `}</style>
    </>
  );
}
