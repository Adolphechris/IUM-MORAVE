import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ReleveOfficielPage() {
  const [selectedYear, setSelectedYear] = useState<'M1' | 'M2' | 'GLOBAL'>('M2');

  const student = {
    name: 'MUKENDI KALONJI ADOLPHE',
    birthPlace: 'Mwene-Ditu',
    birthDate: '15 Mars 1998',
    faculty: 'Faculté des Sciences et Technologies',
    date: '27 août 2026'
  };

  const m1Grades = [
    { n: 1, title: 'Recherche opérationnelle pour ingénieur informaticien', c: 40, td: '15+25+70', cr: 4, sc: 15 },
    { n: 2, title: 'Théories de probabilités pour ingénieur informaticien', c: 40, td: '15+25+70', cr: 4, sc: 14 },
    { n: 3, title: 'Anglais technique-1', c: 30, td: '15+15+45', cr: 3, sc: 16 },
    { n: 4, title: 'Langage formel et compilation', c: 45, td: '20+20+85', cr: 5, sc: 14 },
    { n: 5, title: 'Langage système', c: 45, td: '20+20+85', cr: 5, sc: 15 },
    { n: 6, title: 'Algorithmes et structures de données avancées', c: 45, td: '20+20+85', cr: 5, sc: 17 },
    { n: 7, title: 'Système d\'objets répartis', c: 40, td: '15+25+70', cr: 4, sc: 14 },
    { n: 8, title: 'Théorie du codage', c: 40, td: '15+25+70', cr: 4, sc: 16 },
    { n: 9, title: 'Sécurité des systèmes d\'exploitation', c: 40, td: '15+25+70', cr: 4, sc: 15 },
    { n: 10, title: 'Cryptologie', c: 40, td: '15+25+70', cr: 4, sc: 17 },
    { n: 11, title: 'Méthodes de sécurisation des données', c: 40, td: '15+25+70', cr: 4, sc: 15 },
    { n: 12, title: 'Sécurité des applications et des réseaux', c: 40, td: '15+25+70', cr: 4, sc: 16 },
    { n: 13, title: 'Programmation parallèle', c: 40, td: '15+25+70', cr: 4, sc: 15 },
    { n: 14, title: 'Projet-4 & Application pratique', c: 20, td: '00+40+90', cr: 6, sc: 17 }
  ];

  const m2Grades = [
    { n: 1, title: 'Développement de logiciels cryptographiques', c: 40, td: '15+25+70', cr: 4, sc: 16 },
    { n: 2, title: 'Cryptologie avancée', c: 50, td: '20+30+100', cr: 6, sc: 17 },
    { n: 3, title: 'Programmation réseaux', c: 50, td: '20+30+100', cr: 6, sc: 15 },
    { n: 4, title: 'Méthodes et techniques de rédaction scientifique', c: 40, td: '15+25+70', cr: 4, sc: 16 },
    { n: 5, title: 'Détection des intrusions et réponses aux incidents', c: 45, td: '20+20+85', cr: 5, sc: 17 },
    { n: 6, title: 'Interconnexion et routage dynamique', c: 45, td: '20+20+85', cr: 5, sc: 15 },
    { n: 7, title: 'Contrôle d\'accès et extraction d\'information', c: 30, td: '10+15+50', cr: 3, sc: 16 },
    { n: 8, title: 'Audit et plan de la sécurité informatique', c: 20, td: '10+10+30', cr: 2, sc: 17 },
    { n: 9, title: 'Sécurité des services en ligne', c: 30, td: '10+15+50', cr: 3, sc: 15 },
    { n: 10, title: 'Entrepreneuriat-2', c: 20, td: '10+10+30', cr: 2, sc: 16 },
    { n: 11, title: 'Stage académique en entreprise / laboratoire', c: 0, td: '00+150+100', cr: 10, sc: 18 },
    { n: 12, title: 'Projet tutoré & Soutenance du Mémoire de Master', c: 0, td: '00+150+100', cr: 10, sc: 18 }
  ];

  const renderSheet = (isM1: boolean) => {
    const list = isM1 ? m1Grades : m2Grades;
    const titleLevel = isM1 ? 'Premier Master en Ingénierie Sécurité Informatique' : 'Deuxième Master en Ingénierie Sécurité Informatique';
    const year = isM1 ? '2026-2027' : '2027-2028';
    const code = isM1 ? 'IUM-2026-M1-ISI-088' : 'IUM-2027-M2-ISI-088';
    const num = isM1 ? 'IUM-2026-M1-ISI-088/2026' : 'IUM-2027-M2-ISI-088/2026';
    const pct = isM1 ? '77,35 %  (15.47 / 20)' : '83,25 %  (16.65 / 20)';
    const dec = isM1 ? 'DISTINCTION' : 'TRÈS BIEN (GRANDE DISTINCTION)';

    return (
      <div className="sheet-a4">
        {/* Filigrane en arrière-plan */}
        <div className="watermark-bg">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="185" stroke="#000000" strokeWidth="8"/>
            <circle cx="200" cy="200" r="165" stroke="#000000" strokeWidth="3" strokeDasharray="6,6"/>
            <path d="M200 70 L300 125 L300 240 Q300 310 200 345 Q100 310 100 240 L100 125 Z" fill="#000000" stroke="#000000" strokeWidth="4"/>
            <path d="M200 85 L285 132 L285 235 Q285 295 200 330 Q115 295 115 235 L115 132 Z" fill="#ffffff"/>
            <polygon points="150,170 200,145 250,170 200,195" fill="#000000"/>
            <circle cx="200" cy="250" r="30" stroke="#000000" strokeWidth="8" fill="none"/>
            <text x="200" y="380" fontFamily="'Times New Roman', serif" fontSize="16" fontWeight="bold" fill="#000000" textAnchor="middle">
              INSTITUT UNIVERSITAIRE MORAVE WILLSAMAL
            </text>
          </svg>
        </div>

        {/* 1. En-tête officiel */}
        <table className="hdr-table">
          <tbody>
            <tr>
              <td style={{ width: '18%', textAlign: 'left', verticalAlign: 'top' }}>
                <svg width="68" height="68" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="46" stroke="#0c2461" strokeWidth="3" fill="#f8fafc"/>
                  <path d="M50 16 L76 30 L76 60 Q76 78 50 86 Q24 78 24 60 L24 30 Z" fill="#0c2461"/>
                  <path d="M50 20 L72 32 L72 58 Q72 73 50 81 Q28 73 28 58 L28 32 Z" fill="#ffffff"/>
                  <path d="M38 42 L50 36 L62 42 L50 48 Z" fill="#0c2461"/>
                  <circle cx="50" cy="62" r="7" stroke="#0c2461" strokeWidth="2" fill="none"/>
                  <text x="50" y="94" fontFamily="'Times New Roman', serif" fontSize="5" fontWeight="bold" fill="#0c2461" textAnchor="middle">SCIENTIA SPLENDET</text>
                </svg>
              </td>
              <td style={{ width: '64%', textAlign: 'center', verticalAlign: 'top' }}>
                <div style={{ fontSize: '11pt', fontWeight: 'bold' }}>REPUBLIQUE DEMOCRATIQUE DU CONGO</div>
                <div style={{ fontSize: '11.5pt', fontWeight: 'bold', margin: '1px 0' }}>INSTITUT UNIVERSITAIRE MORAVE WILLSAMAL</div>
                <div style={{ fontSize: '10pt', fontWeight: 'bold' }}>{student.faculty.toUpperCase()}</div>
                <div style={{ fontSize: '9pt', fontWeight: 'bold' }}>B.P. 126</div>
                <div style={{ fontSize: '9.5pt', fontWeight: 'bold' }}>MWENE-DITU</div>
              </td>
              <td style={{ width: '18%', textAlign: 'right', verticalAlign: 'top' }}>
                <div className="photo-frame">
                  PHOTO DE<br/>L'ÉTUDIANT
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* 2. Titre */}
        <div style={{ textAlign: 'center', margin: '10px 0 8px 0', fontSize: '13pt', fontWeight: 'bold' }}>
          RELEVÉ DES COTES N° <u>&nbsp;{num}&nbsp;</u>
        </div>

        {/* 3. Paragraphe introductif officiel */}
        <p className="intro-txt">
          Monsieur/Mademoiselle <strong>{student.name}</strong>, né(e) à <em>{student.birthPlace}</em>, le <em>{student.birthDate}</em>, a obtenu, à l'issue de la <strong>Première session</strong> de l'année académique <strong>{year}</strong> aux examens portant sur les matières prévues au programme de <strong>{titleLevel}</strong> à la <strong>{student.faculty}</strong>, les cotes ci-dessous :
        </p>

        {/* 4. Tableau officiel */}
        <table className="cotes-table">
          <thead>
            <tr>
              <th rowSpan={2} style={{ width: '4%' }}>N°</th>
              <th rowSpan={2} style={{ width: '50%' }}>MATIERES SUIVIES</th>
              <th colSpan={2} style={{ width: '28%' }}>VOLUME HORAIRE</th>
              <th rowSpan={2} style={{ width: '8%' }}>CREDITS</th>
              <th rowSpan={2} style={{ width: '10%' }}>COTES<br/>OBTENUES<br/>.../20</th>
            </tr>
            <tr>
              <th style={{ width: '12%' }}>COURS</th>
              <th style={{ width: '16%' }}>T.D. + T.P. + T.P.E.</th>
            </tr>
          </thead>
          <tbody>
            {list.map((g) => (
              <tr key={g.n}>
                <td style={{ textAlign: 'center' }}>{g.n}.</td>
                <td style={{ textAlign: 'left' }}>{g.title}</td>
                <td style={{ textAlign: 'center' }}>{g.c}</td>
                <td style={{ textAlign: 'center' }}>{g.td}</td>
                <td style={{ textAlign: 'center' }}>{g.cr}</td>
                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{g.sc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 5. Délibération */}
        <div style={{ margin: '8px 0 6px 100px', fontSize: '9.5pt' }}>
          <table style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '230px' }}>Pourcentage pondéré / Moyenne</td>
                <td>...........................................................................</td>
                <td style={{ paddingLeft: '6px' }}><strong>{pct}</strong></td>
              </tr>
              <tr>
                <td>Crédits validés</td>
                <td>...........................................................................</td>
                <td style={{ paddingLeft: '6px' }}><strong>60 / 60</strong></td>
              </tr>
              <tr>
                <td>Décision du jury</td>
                <td>...........................................................................</td>
                <td style={{ paddingLeft: '6px' }}><strong>{dec}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 6. Date & Signatures */}
        <div style={{ textAlign: 'center', fontSize: '9.5pt', margin: '10px 0 6px 0' }}>
          Fait à Mwene-Ditu, le {student.date}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '4px', fontSize: '9pt' }}>
          <tbody>
            <tr>
              <td style={{ width: '50%', textAlign: 'center', verticalAlign: 'top', position: 'relative' }}>
                <div>Le Secrétaire Académique de la Faculté</div>
                <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'cursive', fontSize: '16pt', color: '#1e3a8a', transform: 'rotate(-5deg)' }}>A. Kalonji</span>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '9.5pt' }}><u>Ir. Chef de Travaux / Secrétaire</u></div>
              </td>
              <td style={{ width: '50%', textAlign: 'center', verticalAlign: 'top', position: 'relative' }}>
                <div>Le Doyen de la Faculté</div>
                <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'cursive', fontSize: '17pt', color: '#0f172a', transform: 'rotate(3deg)' }}>Dr. J.M. Kanda</span>
                  <div style={{ position: 'absolute', right: '30px', top: '-5px', opacity: 0.85 }}>
                    <svg width="90" height="90" viewBox="0 0 140 140" fill="none">
                      <circle cx="70" cy="70" r="64" stroke="#1d4ed8" strokeWidth="3" strokeDasharray="5,2"/>
                      <circle cx="70" cy="70" r="58" stroke="#1d4ed8" strokeWidth="1.5"/>
                      <text fontFamily="'Times New Roman', serif" fontSize="8" fontWeight="bold" fill="#1d4ed8" textAnchor="middle" x="70" y="32">INSTITUT UNIV. MORAVE</text>
                      <text fontFamily="'Times New Roman', serif" fontSize="7" fontWeight="bold" fill="#1d4ed8" textAnchor="middle" x="70" y="118">★ FAC. DES SCIENCES ★</text>
                      <text x="70" y="66" fontFamily="'Times New Roman', serif" fontSize="8" fontWeight="bold" fill="#1d4ed8" textAnchor="middle">SCIENTIA</text>
                      <text x="70" y="77" fontFamily="'Times New Roman', serif" fontSize="7.5" fontWeight="bold" fill="#1d4ed8" textAnchor="middle">SPLENDET</text>
                    </svg>
                  </div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '9.5pt' }}><u>Prof. Dr. Doyen de la Faculté</u></div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* 7. Pied de page légal & Cryptographique */}
        <div style={{ marginTop: '14px', borderTop: '0.5pt solid #9ca3af', paddingTop: '4px' }}>
          <div style={{ fontSize: '6.8pt', color: '#374151', fontStyle: 'italic', marginBottom: '3px' }}>
            * Ce document n'a aucune valeur administrative ; il est strictement réservé à un usage interne, EX : Excellent, TB : Très Bien, D : Distinction, S : Satisfaction, AJ : Ajourné(e).
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '6.5pt', color: '#4b5563', borderTop: '0.5pt dashed #d1d5db', paddingTop: '3px' }}>
            <div>
              <strong>Vérification Cryptographique &amp; Intégrité :</strong> Code <code>{code}</code><br/>
              Portail officiel de vérification : <strong>https://iumorave-ac.org/verify?code={code}</strong>
            </div>
            <div>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=https://iumorave-ac.org/verify?code=${code}`} alt="QR" style={{ width: '38px', height: '38px', border: '0.5pt solid #ccc' }} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Relevé Officiel des Cotes (Modèle National ESU / UNILU) — IUM-MORAVE</title>
      </Head>

      <div className="no-print bar">
        <Link href="/" className="link">← Retour au Portail</Link>
        <div className="tabs">
          <button className={`tab-btn ${selectedYear === 'M1' ? 'active' : ''}`} onClick={() => setSelectedYear('M1')}>
            📄 Relevé Master 1 (1 Année)
          </button>
          <button className={`tab-btn ${selectedYear === 'M2' ? 'active' : ''}`} onClick={() => setSelectedYear('M2')}>
            🛡️ Relevé Master 2 (1 Année)
          </button>
          <button className={`tab-btn ${selectedYear === 'GLOBAL' ? 'active' : ''}`} onClick={() => setSelectedYear('GLOBAL')}>
            📚 Cursus Complet (M1 + M2)
          </button>
        </div>
        <button onClick={() => window.print()} className="print-btn">🖨️ Imprimer en PDF</button>
      </div>

      <div className="sheets-container">
        {(selectedYear === 'M1' || selectedYear === 'GLOBAL') && renderSheet(true)}
        {(selectedYear === 'M2' || selectedYear === 'GLOBAL') && renderSheet(false)}
      </div>

      <style jsx global>{`
        @page { size: A4 portrait; margin: 10mm 12mm 10mm 12mm; }
        body { font-family: 'Times New Roman', Times, serif; background: #475569; margin: 0; padding: 0; }

        .bar {
          background: #0f172a;
          color: #fff;
          padding: 0.6rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
        .link { color: #38bdf8; text-decoration: none; font-weight: bold; font-family: sans-serif; font-size: 0.9rem; }
        .tabs { display: flex; gap: 8px; }
        .tab-btn {
          background: #1e293b;
          color: #cbd5e1;
          border: 1px solid #475569;
          padding: 5px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 0.85rem;
          font-family: sans-serif;
        }
        .tab-btn.active { background: #0284c7; color: #fff; border-color: #38bdf8; }
        .print-btn {
          background: #16a34a;
          color: #fff;
          border: none;
          padding: 6px 16px;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          font-family: sans-serif;
        }

        .sheets-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 20px 0;
        }

        .sheet-a4 {
          position: relative;
          width: 210mm;
          min-height: 297mm;
          background: #ffffff;
          padding: 12mm 15mm 10mm 15mm;
          box-sizing: border-box;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          color: #000000;
          font-size: 9.5pt;
          line-height: 1.25;
        }

        .watermark-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.06;
          pointer-events: none;
          z-index: 0;
        }

        .hdr-table { width: 100%; border-collapse: collapse; margin-bottom: 6px; position: relative; z-index: 1; }
        .photo-frame {
          width: 25mm;
          height: 30mm;
          border: 1pt solid #374151;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 6.5pt;
          color: #6b7280;
          margin-left: auto;
          background: #f9fafb;
          font-family: sans-serif;
        }

        .intro-txt {
          font-size: 9pt;
          text-align: justify;
          margin: 0 0 10px 0;
          line-height: 1.35;
          position: relative;
          z-index: 1;
        }

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

        @media print {
          body { background: #fff !important; }
          .no-print { display: none !important; }
          .sheets-container { padding: 0 !important; gap: 0 !important; }
          .sheet-a4 { box-shadow: none !important; margin: 0 !important; width: 100% !important; padding: 0 !important; page-break-after: always; }
        }
      `}</style>
    </>
  );
}
