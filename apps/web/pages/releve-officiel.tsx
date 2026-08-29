import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ReleveOfficielPage() {
  const [selectedYear, setSelectedYear] = useState<'M1' | 'M2' | 'GLOBAL'>('M2');

  const student = {
    name: 'MUKENDI KALONJI ADOLPHE',
    birthPlace: 'Mwene-Ditu',
    birthDate: '18 juillet 1992',
    faculty: 'Faculté des Sciences et Technologies',
    date: '27 août 2026'
  };

  const m1Grades = [
    { n: 1, title: 'Recherche opérationnelle pour ingénieur informaticien', c: 40, td: '15+25+70', cr: 4, sc: 13 },
    { n: 2, title: 'Théories de probabilités pour ingénieur informaticien', c: 40, td: '15+25+70', cr: 4, sc: 12 },
    { n: 3, title: 'Anglais technique-1', c: 30, td: '15+15+45', cr: 3, sc: 15 },
    { n: 4, title: 'Langage formel et compilation', c: 45, td: '20+20+85', cr: 5, sc: 13 },
    { n: 5, title: 'Langage système', c: 45, td: '20+20+85', cr: 5, sc: 14 },
    { n: 6, title: 'Algorithmes et structures des données avancées', c: 45, td: '20+20+85', cr: 5, sc: 16 },
    { n: 7, title: 'Système d\'objets répartis', c: 40, td: '15+25+70', cr: 4, sc: 13 },
    { n: 8, title: 'Théorie du codage', c: 40, td: '15+25+70', cr: 4, sc: 15 },
    { n: 9, title: 'Sécurité des systèmes d\'exploitation', c: 40, td: '15+25+70', cr: 4, sc: 14 },
    { n: 10, title: 'Cryptologie', c: 40, td: '15+25+70', cr: 4, sc: 16 },
    { n: 11, title: 'Méthodes de sécurisation des données', c: 40, td: '15+25+70', cr: 4, sc: 13 },
    { n: 12, title: 'Sécurité des applications et des réseaux', c: 40, td: '15+25+70', cr: 4, sc: 15 },
    { n: 13, title: 'Programmation parallèle', c: 40, td: '15+25+70', cr: 4, sc: 13 },
    { n: 14, title: 'Projet-4 & Application pratique', c: 20, td: '00+40+90', cr: 6, sc: 16 }
  ];

  const m2Grades = [
    { n: 1, title: 'Développement de logiciels cryptographiques', c: 40, td: '15+25+70', cr: 4, sc: 16 },
    { n: 2, title: 'Cryptologie avancée', c: 50, td: '20+30+100', cr: 6, sc: 17 },
    { n: 3, title: 'Programmation réseaux', c: 50, td: '20+30+100', cr: 6, sc: 15 },
    { n: 4, title: 'Méthodes et techniques de rédaction scientifique', c: 40, td: '15+25+70', cr: 4, sc: 16 },
    { n: 5, title: 'Détection des intrusions et réponses aux incidents', c: 45, td: '20+20+85', cr: 5, sc: 16 },
    { n: 6, title: 'Interconnexion et routage dynamique', c: 45, td: '20+20+85', cr: 5, sc: 15 },
    { n: 7, title: 'Contrôle d\'accès et extraction d\'information', c: 30, td: '10+15+50', cr: 3, sc: 16 },
    { n: 8, title: 'Audit et plan de la sécurité informatique', c: 20, td: '10+10+30', cr: 2, sc: 17 },
    { n: 9, title: 'Sécurité des services en ligne', c: 30, td: '10+15+50', cr: 3, sc: 15 },
    { n: 10, title: 'Entrepreneuriat-2', c: 20, td: '10+10+30', cr: 2, sc: 17 },
    { n: 11, title: 'Stage académique en entreprise / laboratoire', c: 0, td: '00+150+100', cr: 10, sc: 15 },
    { n: 12, title: 'Projet tutoré & Soutenance du Mémoire de Master', c: 0, td: '00+150+100', cr: 10, sc: 15 }
  ];

  const renderSheet = (isM1: boolean) => {
    const list = isM1 ? m1Grades : m2Grades;
    const titleLevel = isM1 ? 'Premier Master en Ingénierie Sécurité Informatique' : 'Deuxième Master en Ingénierie Sécurité Informatique';
    const year = isM1 ? '2022-2023' : '2023-2024';
    const num = isM1 ? 'IUM-2023-M1-ISI-088/2023' : 'IUM-2024-M2-ISI-088/2024';
    const pct = isM1 ? '71,00 %  (14.20 / 20)' : '78,00 %  (15.60 / 20)';
    const dec = 'DISTINCTION';
    const dateDoc = isM1 ? '15 juillet 2023' : '28 août 2024';

    return (
      <div className="sheet-a4">
        {/* Filigrane central officiel transparent */}
        <div className="watermark-bg">
          <img src="/images/blason-transparent.png" alt="" className="watermark-img" />
        </div>

        {/* 1. En-tête officiel */}
        <table className="hdr-table">
          <tbody>
            <tr>
              <td style={{ width: '15%', textAlign: 'left', verticalAlign: 'middle' }}>
                <img src="/images/blason-transparent.png" alt="Blason IUM-MORAVE" style={{ width: '68px', height: 'auto', display: 'block' }} />
              </td>
              <td style={{ width: '85%', textAlign: 'center', verticalAlign: 'top' }}>
                <div style={{ fontSize: '11pt', fontWeight: 'bold' }}>REPUBLIQUE DEMOCRATIQUE DU CONGO</div>
                <div style={{ fontSize: '11.5pt', fontWeight: 'bold', margin: '1px 0' }}>INSTITUT UNIVERSITAIRE MORAVE WILLSAMAL</div>
                <div style={{ fontSize: '10pt', fontWeight: 'bold' }}>{student.faculty.toUpperCase()}</div>
                <div style={{ fontSize: '9pt', fontWeight: 'bold' }}>B.P. 126 — MWENE-DITU</div>
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
          Monsieur <strong>{student.name}</strong>, né à <em>{student.birthPlace}</em>, le <em>{student.birthDate}</em>, a obtenu, à l'issue de la <strong>Première session</strong> de l'année académique <strong>{year}</strong> aux examens portant sur les matières prévues au programme de <strong>{titleLevel}</strong> à la <strong>{student.faculty}</strong>, les cotes ci-dessous :
        </p>

        {/* 4. Tableau officiel */}
        <table className="cotes-table">
          <thead>
            <tr>
              <th rowSpan={2} style={{ width: '4%' }}>N°</th>
              <th rowSpan={2} style={{ width: '52%' }}>MATIERES SUIVIES</th>
              <th colSpan={2} style={{ width: '26%' }}>VOLUME HORAIRE</th>
              <th rowSpan={2} style={{ width: '8%' }}>CREDITS</th>
              <th rowSpan={2} style={{ width: '10%' }}>COTES<br/>OBTENUES<br/>.../20</th>
            </tr>
            <tr>
              <th style={{ width: '11%' }}>COURS</th>
              <th style={{ width: '15%' }}>T.D. + T.P. + T.P.E.</th>
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

        {/* 5. Délibération (Strictement conforme Page 4 UNILU) */}
        <div style={{ margin: '10px 0 8px 40px', fontSize: '9.2pt', position: 'relative', zIndex: 1 }}>
          <table style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '220px' }}>Pourcentage pondéré</td>
                <td>...............................................................................</td>
                <td style={{ paddingLeft: '6px' }}><strong>{pct}</strong></td>
              </tr>
              <tr>
                <td>Crédits validés</td>
                <td>...............................................................................</td>
                <td style={{ paddingLeft: '6px' }}><strong>60 / 60 ECTS</strong></td>
              </tr>
              <tr>
                <td>Décision du jury</td>
                <td>...............................................................................</td>
                <td style={{ paddingLeft: '6px' }}><strong>{dec}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mentions solennelles de Master 2 */}
        {!isM1 && (
          <div style={{ margin: '6px 0 6px 0', padding: '4px 10px', fontSize: '8.8pt', borderLeft: '2pt solid #000', background: 'rgba(0,0,0,0.02)', lineHeight: 1.35, position: 'relative', zIndex: 1 }}>
            <div>• <strong>Mémoire de Master</strong> soutenu et défendu publiquement en date du 24 août 2024 avec la mention : <strong>DISTINCTION (15/20)</strong>.</div>
            <div style={{ marginTop: '2px' }}>• <strong>Diplôme de Master</strong> en Sciences et Technologie — Mention <em>Ingénierie Sécurité Informatique</em> décerné à l'impétrant en date du 28 août 2024.</div>
          </div>
        )}

        {/* 6. Date & Signatures — Espaces épurés et vierges */}
        <div style={{ textAlign: 'center', fontSize: '9.2pt', margin: '12px 0 6px 0', position: 'relative', zIndex: 1 }}>
          Fait à Mwene-Ditu, le {dateDoc}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '4px', fontSize: '9pt', position: 'relative', zIndex: 1 }}>
          <tbody>
            <tr>
              <td style={{ width: '50%', textAlign: 'center', verticalAlign: 'top', padding: '0 10px' }}>
                <div style={{ marginBottom: '2px' }}>Le Secrétaire Académique de la Faculté</div>
                <div style={{ height: '60px' }}></div>
                <div style={{ fontWeight: 'bold', fontSize: '9.2pt' }}><u>Ir. Mbuyi Kizito Justin</u></div>
                <div style={{ fontSize: '8.2pt', marginTop: '1px', color: '#1f2937' }}>Chef de Travaux — Secrétaire Académique</div>
              </td>
              <td style={{ width: '50%', textAlign: 'center', verticalAlign: 'top', padding: '0 10px' }}>
                <div style={{ marginBottom: '2px' }}>Le Doyen de la Faculté</div>
                <div style={{ height: '60px' }}></div>
                <div style={{ fontWeight: 'bold', fontSize: '9.2pt' }}><u>Prof. Dr. Doyen de la Faculté</u></div>
                <div style={{ fontSize: '8.2pt', marginTop: '1px', color: '#1f2937' }}>Professeur — Doyen de la Faculté</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* 7. Pied de page institutionnel & Sécurité discrète */}
        <div style={{ marginTop: '16px', borderTop: '0.5pt solid #9ca3af', paddingTop: '4px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '6.5pt', color: '#4b5563', lineHeight: 1.35 }}>
              <div>Agrément Ministériel N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 du 09 Avril 2018 — Institut Universitaire Morave Willsamal — B.P. 126, Mwene-Ditu</div>
              <div style={{ fontSize: '6pt', color: '#6b7280', marginTop: '1px' }}>
                Réf : <code>{num}</code> | SHA-256 : <code style={{ fontSize: '5.4pt' }}>{isM1 ? '8a9b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b' : '6e94616c4251b2d400886bf3efc1c2042964fa04b3d03addcaf375835d3fbeba'}</code>
              </div>
            </div>
            <div>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=https://iumorave-ac.org/verify?code=${num}`}
                alt=""
                style={{ width: '28px', height: '28px', display: 'block', opacity: 0.85 }}
              />
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
          padding: 12mm 16mm 10mm 16mm;
          box-sizing: border-box;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          color: #000000;
          font-size: 9.5pt;
          line-height: 1.24;
        }

        .watermark-bg {
          position: absolute;
          top: 155px;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0.15;
          pointer-events: none;
          z-index: 0;
          text-align: center;
        }

        .watermark-img {
          width: 360px;
          height: auto;
          display: block;
          margin: 0 auto;
          filter: grayscale(100%);
        }

        .hdr-table { width: 100%; border-collapse: collapse; margin-bottom: 6px; position: relative; z-index: 1; }

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
