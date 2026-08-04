import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

type ProgramDetail = {
  id: number;
  code: string;
  title: string;
  level: string;
  durationMonths: number;
  faculty: { name: string; code: string };
  tracks: Array<{ id: number; code?: string; title: string; description: string; careers?: string[] }>;
  courses: Array<{ id: number; code: string; title: string; credits: number; semester: number }>;
  admissionReqs?: string[];
};

const apiUrl = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:4002';

const PROGRAM_FALLBACKS: Record<string, ProgramDetail> = {
  '1': {
    id: 1,
    code: 'LIC-SINT',
    title: 'Licence en Sciences Informatiques & Nouvelles Technologies',
    level: 'Licence LMD (Bac+3)',
    durationMonths: 36,
    faculty: { name: 'Faculté des Sciences Informatiques & Nouvelles Technologies', code: 'FSINT' },
    admissionReqs: [
      'Être titulaire d\'un Diplôme d\'État (Baccalauréat) ou équivalent homologué par l\'ESU.',
      'Dossier scolaire complet avec relevés de notes des 3 dernières années secondaires.',
      'Réussite au concours ou à l\'épreuve d\'orientation de la Faculté.'
    ],
    tracks: [
      {
        id: 1,
        code: 'SINT-DEV',
        title: 'Filière : Génie Logiciel & Développement d\'Applications',
        description: 'Conception d\'applications web, mobiles et d\'entreprises. Maîtrise des architectures microservices, des bases de données SQL/NoSQL et des méthodes de développement modernes.',
        careers: ['Développeur Full-Stack', 'Architecte logiciel', 'Concepteur Mobile']
      },
      {
        id: 2,
        code: 'SINT-RC',
        title: 'Filière : Réseaux Informatiques, Systèmes & Cybersécurité',
        description: 'Administration des infrastructures réseaux, virtualisation des serveurs, sécurité opérationnelle, pare-feu et protection des systèmes d\'information.',
        careers: ['Administrateur Réseaux & Sécurité', 'Ingénieur Systèmes Linux/Windows', 'Consultant Cybersécurité']
      },
      {
        id: 3,
        code: 'SINT-IA',
        title: 'Filière : Intelligence Artificielle & Science des Données',
        description: 'Analyse de données massives (Big Data), apprentissage automatique (Machine Learning) et automatisation des processus décisionnels.',
        careers: ['Ingénieur Data / IA', 'Analyste BI', 'Data Scientist']
      }
    ],
    courses: [
      { id: 1, code: 'INF101', title: 'Algorithmique & Structures de Données Avancées', credits: 6, semester: 1 },
      { id: 2, code: 'INF102', title: 'Programmation Orientée Objet (Java / C++)', credits: 6, semester: 1 },
      { id: 3, code: 'INF103', title: 'Architecture des Ordinateurs & Systèmes d\'Exploitation', credits: 5, semester: 1 },
      { id: 4, code: 'INF201', title: 'Conception de Bases de Données & SQL', credits: 6, semester: 2 },
      { id: 5, code: 'INF202', title: 'Réseaux Informatiques & Protocoles TCP/IP', credits: 5, semester: 2 },
      { id: 6, code: 'INF301', title: 'Développement Web Moderne (React / Node.js / Next.js)', credits: 6, semester: 3 },
      { id: 7, code: 'INF302', title: 'Sécurité des Systèmes d\'Information & Cryptographie', credits: 5, semester: 4 },
      { id: 8, code: 'INF401', title: 'Stage Professionnel & Mémoire de Fin de Cursus LMD', credits: 15, semester: 6 },
    ]
  },
  '2': {
    id: 2,
    code: 'LIC-SEG',
    title: 'Licence en Sciences Économiques & de Gestion',
    level: 'Licence LMD (Bac+3)',
    durationMonths: 36,
    faculty: { name: 'Faculté des Sciences Économiques et de Gestion', code: 'FSEG' },
    admissionReqs: [
      'Être titulaire d\'un Diplôme d\'État (Baccalauréat) ou équivalent homologué par l\'ESU.',
      'Dossier scolaire complet.',
      'Test d\'aptitude de la Faculté.'
    ],
    tracks: [
      {
        id: 4,
        code: 'SEG-FC',
        title: 'Filière : Finance, Comptabilité & Audit',
        description: 'Maîtrise des normes comptables SYSCOHADA, analyse financière des bilans, gestion de la trésorerie et audit financier.',
        careers: ['Comptable d\'Entreprise', 'Auditeur Junior', 'Analyste Financier']
      },
      {
        id: 5,
        code: 'SEG-MO',
        title: 'Filière : Management & Gestion des Organisations',
        description: 'Stratégie d\'entreprise, gestion des ressources humaines, marketing et pilotage de projets d\'affaires.',
        careers: ['Chef de Projet', 'Responsable RH', 'Responsable Commercial']
      }
    ],
    courses: [
      { id: 10, code: 'ECO101', title: 'Microéconomie & Théorie du Consommateur', credits: 6, semester: 1 },
      { id: 11, code: 'ECO102', title: 'Comptabilité Générale SYSCOHADA I & II', credits: 6, semester: 1 },
      { id: 12, code: 'ECO201', title: 'Analyse Financière & Diagnostic d\'Entreprise', credits: 6, semester: 2 },
      { id: 13, code: 'ECO301', title: 'Gestion Budgétaire & Comptabilité Analytique', credits: 6, semester: 3 },
      { id: 14, code: 'ECO302', title: 'Stage Professionnel & Rapport LMD', credits: 15, semester: 6 },
    ]
  }
};

export default function ProgramDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [program, setProgram] = useState<ProgramDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    const progIdStr = Array.isArray(id) ? id[0] : id;

    fetch(`${apiUrl}/programs/${progIdStr}`)
      .then(async (res) => {
        if (res.ok) {
          const apiData = await res.json();
          const fallback = PROGRAM_FALLBACKS[progIdStr] || PROGRAM_FALLBACKS['1'];
          setProgram({
            id: apiData.id || fallback.id,
            code: apiData.code || fallback.code,
            title: apiData.title || fallback.title,
            level: apiData.level || fallback.level,
            durationMonths: apiData.durationMonths || fallback.durationMonths,
            faculty: apiData.faculty || fallback.faculty,
            admissionReqs: fallback.admissionReqs,
            tracks: (apiData.tracks && apiData.tracks.length > 0) ? apiData.tracks : fallback.tracks,
            courses: (apiData.courses && apiData.courses.length > 0) ? apiData.courses : fallback.courses,
          });
        } else {
          setProgram(PROGRAM_FALLBACKS[progIdStr] || PROGRAM_FALLBACKS['1']);
        }
      })
      .catch(() => {
        setProgram(PROGRAM_FALLBACKS[progIdStr] || PROGRAM_FALLBACKS['1']);
      });
  }, [id]);

  const activeProg = program || PROGRAM_FALLBACKS['1'];

  return (
    <>
      <Head>
        <title>{activeProg.title} | IUM-MORAVE</title>
        <meta name="description" content={`Découvrez la ${activeProg.title} de l'IUM-MORAVE : spécialités, unités d'enseignement et débouchés professionnels.`} />
      </Head>

      {/* NAVBAR */}
      <header className="navbar">
        <div className="navbar-inner">
          <a href="/" className="brand">
            <div className="brand-crest">
              <img src="/images/logo-crest.jpg" alt="Blason Officiel IUM-MORAVE" className="crest-img" />
            </div>
            <div className="brand-text">
              <span className="brand-full">Institut Universitaire Morave</span>
              <span className="brand-short">IUM‑MORAVE</span>
            </div>
          </a>
          <nav className="nav-links">
            <a href="/">← Accueil</a>
            <a href="/#formations">Toutes les Formations</a>
            <a href="/contact">Inscriptions</a>
            <a href="/espace" className="nav-cta">Espace Numérique →</a>
          </nav>
        </div>
      </header>

      {/* HERO PROGRAMME */}
      <section className="prog-hero">
        <div className="hero-content">
          <div className="hero-badges">
            <span className="badge-yellow">{activeProg.code}</span>
            <span className="badge-blue">{activeProg.level}</span>
          </div>
          <h1>{activeProg.title}</h1>
          <p className="hero-faculty">{activeProg.faculty.name} — Durée : {activeProg.durationMonths / 12} ans ({activeProg.durationMonths} mois)</p>
        </div>
      </section>

      {/* BODY */}
      <main className="prog-body">
        <div className="container">

          {/* SPÉCIALITÉS / FILIÈRES */}
          <section className="section-block">
            <h2>📍 Filières &amp; Parcours de Spécialisation</h2>
            <div className="tracks-grid">
              {activeProg.tracks.map((track) => (
                <article className="track-card" key={track.id}>
                  <h3>{track.title}</h3>
                  <p>{track.description}</p>
                  {track.careers && (
                    <div className="careers-box">
                      <strong>Débouchés :</strong>
                      {track.careers.map((c, i) => <span className="pill" key={i}>✓ {c}</span>)}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* TABLEAU DES COURS */}
          {activeProg.courses && activeProg.courses.length > 0 && (
            <section className="section-block">
              <h2>📚 Programme des Unités d&apos;Enseignement (UE)</h2>
              <div className="table-wrapper">
                <table className="courses-table">
                  <thead>
                    <tr>
                      <th>Code UE</th>
                      <th>Intitulé du Cours</th>
                      <th>Semestre</th>
                      <th>Crédits ECTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeProg.courses.map((course) => (
                      <tr key={course.id}>
                        <td><strong>{course.code}</strong></td>
                        <td>{course.title}</td>
                        <td>Semestre {course.semester}</td>
                        <td><span className="credit-pill">{course.credits} Crédits</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* CONDITIONS D'ADMISSION */}
          {activeProg.admissionReqs && (
            <section className="section-block reqs-block">
              <h2>📋 Conditions d&apos;Admission</h2>
              <ul className="reqs-list">
                {activeProg.admissionReqs.map((req, i) => (
                  <li key={i}><span>✓</span> {req}</li>
                ))}
              </ul>
            </section>
          )}

        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <p>© {new Date().getFullYear()} Institut Universitaire Morave de Mwene-Ditu (IUM-MORAVE) — Agrément ESU N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 | B.P. 126 Mwene-Ditu</p>
        </div>
      </footer>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Inter, system-ui, sans-serif; background: #f8fafc; color: #0f2340; line-height: 1.6; }
        .navbar { position: sticky; top: 0; z-index: 100; background: #071e38; padding: .85rem 1.5rem; }
        .navbar-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .brand { display: flex; align-items: center; gap: .75rem; text-decoration: none; }
        .brand-crest { width: 2.5rem; height: 2.5rem; border-radius: 50%; border: 2px solid #f5b914; overflow: hidden; }
        .crest-img { width: 100%; height: 100%; object-fit: cover; }
        .brand-full { color: #fff; font-weight: 800; }
        .brand-short { color: #f5b914; font-size: .75rem; }
        .nav-links { display: flex; gap: 1.25rem; align-items: center; }
        .nav-links a { color: rgba(255,255,255,.8); text-decoration: none; font-size: .9rem; }
        .nav-cta { background: #f5b914 !important; color: #071e38 !important; font-weight: 800 !important; padding: .5rem 1rem; border-radius: .4rem; }

        .prog-hero { background: linear-gradient(135deg, #071e38 0%, #0b3d6b 100%); color: #fff; padding: 4.5rem 1.5rem; text-align: center; }
        .hero-content { max-width: 850px; margin: 0 auto; }
        .hero-badges { display: flex; justify-content: center; gap: .75rem; margin-bottom: 1rem; }
        .badge-yellow { background: #f5b914; color: #071e38; font-weight: 800; font-size: .8rem; padding: .3rem .8rem; border-radius: 2rem; }
        .badge-blue { background: #1a8cd8; color: #fff; font-weight: 800; font-size: .8rem; padding: .3rem .8rem; border-radius: 2rem; }
        .prog-hero h1 { font-size: 2.5rem; font-weight: 900; margin-bottom: .75rem; }
        .hero-faculty { color: rgba(255,255,255,.85); font-size: 1.05rem; }

        .prog-body { padding: 4rem 1.5rem; }
        .container { max-width: 1000px; margin: 0 auto; }
        .section-block { background: #fff; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 2rem; margin-bottom: 2.5rem; box-shadow: 0 4px 20px rgba(7,30,56,.06); }
        .section-block h2 { font-size: 1.4rem; font-weight: 800; color: #071e38; margin-bottom: 1.5rem; }

        .tracks-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; }
        .track-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: .75rem; padding: 1.25rem; }
        .track-card h3 { font-size: 1.1rem; font-weight: 800; color: #071e38; margin-bottom: .5rem; }
        .track-card p { color: #64748b; font-size: .9rem; margin-bottom: 1rem; }
        .careers-box { display: flex; flex-wrap: wrap; gap: .4rem; align-items: center; }
        .careers-box strong { font-size: .8rem; width: 100%; color: #071e38; }
        .pill { background: #fff; border: 1px solid #cbd5e1; font-size: .75rem; font-weight: 600; padding: .2rem .5rem; border-radius: .3rem; }

        .table-wrapper { overflow-x: auto; }
        .courses-table { width: 100%; border-collapse: collapse; text-align: left; font-size: .9rem; }
        .courses-table th { background: #071e38; color: #fff; padding: .75rem 1rem; font-size: .8rem; }
        .courses-table td { padding: .75rem 1rem; border-bottom: 1px solid #e2e8f0; }
        .credit-pill { background: #e0f2fe; color: #0369a1; font-weight: 800; font-size: .75rem; padding: .2rem .6rem; border-radius: 2rem; }

        .reqs-list { list-style: none; display: flex; flex-direction: column; gap: .75rem; }
        .reqs-list li { display: flex; gap: .75rem; font-size: .95rem; color: #334155; }
        .reqs-list span { color: #16a34a; font-weight: 900; }

        .footer { background: #071e38; color: rgba(255,255,255,.6); padding: 2rem 1.5rem; text-align: center; font-size: .8rem; margin-top: 4rem; }
        .footer-inner { max-width: 1000px; margin: 0 auto; }
      `}</style>
    </>
  );
}
