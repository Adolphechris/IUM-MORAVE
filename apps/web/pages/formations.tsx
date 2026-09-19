import React, { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import GlobalFooter from '../components/GlobalFooter';

type FacultySummary = {
  id: number;
  code: string;
  name: string;
  degree: string;
  duration: string;
  icon: string;
  desc: string;
  filieres: string[];
  careers: string[];
};

const ALL_FACULTIES: FacultySummary[] = [
  {
    id: 1,
    code: 'FST',
    icon: '💻',
    name: 'Faculté des Sciences et Technologies',
    degree: 'Licence (LMD) • Master Spécialisé (ISI)',
    duration: '3 ans (Licence) • 2 ans (Master)',
    desc: 'Formation technologique de pointe en génie logiciel, cybersécurité opérationnelle, réseaux télécoms et intelligence artificielle appliquée.',
    filieres: ['Génie Logiciel & Développement', 'Réseaux & Cybersécurité', 'Intelligence Artificielle & Data', 'Informatique de Gestion'],
    careers: ['Ingénieur Logiciel Full-Stack', 'Architecte Sécurité Informatique', 'Administrateur Systèmes & Réseaux', 'Data Analyst']
  },
  {
    id: 2,
    code: 'FMS',
    icon: '🩺',
    name: 'Faculté de Médecine et Santé Publique',
    degree: 'Doctorat en Médecine (M5/D) • Santé Publique',
    duration: 'Doctorat complet avec internat clinique',
    desc: 'Formation médicale d\'excellence avec stages hospitaliers cliniques continus en partenariat académique privilégié avec l\'ISTM.',
    filieres: ['Médecine Générale', 'Santé Communautaire', 'Épidémiologie & Prévention', 'Pratique Clinique & Stages'],
    careers: ['Docteur en Médecine', 'Médecin Épidémiologiste', 'Gestionnaire de Programmes Hospitaliers', 'Chercheur en Santé Publique']
  },
  {
    id: 3,
    code: 'FDSP',
    icon: '⚖️',
    name: 'Faculté de Droit et Sciences Politiques',
    degree: 'Licence (LMD) • Master Droit & Diplomatie',
    duration: '3 ans (Licence) • 2 ans (Master)',
    desc: 'Maîtrise approfondie du Droit des Affaires OHADA, du Droit Public, du contentieux judiciaire, des relations internationales et de la diplomatie.',
    filieres: ['Droit Privé & Judiciaire', 'Droit des Affaires OHADA', 'Droit Public & Administratif', 'Relations Internationales'],
    careers: ['Magistrat / Avocat', 'Juriste d\'Entreprise & Banque', 'Diplomate / Cadre Ministériel', 'Consultant en Droit International']
  },
  {
    id: 4,
    code: 'FSEG',
    icon: '📊',
    name: 'Faculté des Sciences Économiques et de Gestion',
    degree: 'Licence (LMD) • Master Finance & Audit',
    duration: '3 ans (Licence) • 2 ans (Master)',
    desc: 'Excellence en analyse macroéconomique, ingénierie financière, gestion comptable approfondie et gouvernance des entreprises.',
    filieres: ['Banque, Monnaie & Finance', 'Comptabilité & Audit Financier', 'Économie du Développement', 'Management des Organisations'],
    careers: ['Analyste Financier / Banquier', 'Auditeur Comptable & Fiscal', 'Directeur Administratif & Financier', 'Économiste de Projet']
  },
  {
    id: 5,
    code: 'FSA',
    icon: '🌱',
    name: 'Faculté des Sciences Agronomiques & Dev. Rural',
    degree: 'Licence (LMD) • Ingéniorat Agronome',
    duration: '3 ans (Licence) • 5 ans (Ingéniorat)',
    desc: 'Innovations agro-pastorales, gestion durable des sols, amélioration des cultures tropicales et sécurité alimentaire pour le Grand Kasaï.',
    filieres: ['Phytotechnie & Amélioration Végétale', 'Zootechnie & Santé Animale', 'Gestion des Sols & Écologie', 'Économie Rurale'],
    careers: ['Ingénieur Agronome', 'Conseiller Agricole de Territoire', 'Responsable d\'Exploitation Agro-pastorale', 'Expert Sécurité Alimentaire']
  },
  {
    id: 6,
    code: 'FSIC',
    icon: '📰',
    name: 'Faculté des Sciences de l\'Information & Com.',
    degree: 'Licence (LMD) • Master Médias & Stratégie',
    duration: '3 ans (Licence) • 2 ans (Master)',
    desc: 'Formation aux métiers modernes de la presse, journalisme numérique d\'investigation, communication institutionnelle et relations publiques.',
    filieres: ['Journalisme Multimédia & Radio/TV', 'Communication Stratégique des Organisations', 'Relations Publiques & Événementiel', 'Gestion des Médias Numériques'],
    careers: ['Journaliste / Rédacteur en Chef', 'Directeur de la Communication', 'Attaché de Presse & Porte-parole', 'Community Manager Stratégique']
  },
  {
    id: 7,
    code: 'FSE',
    icon: '🎓',
    name: 'Faculté des Sciences de l\'Éducation',
    degree: 'Licence (LMD) • Master Didactique & Inspection',
    duration: '3 ans (Licence) • 2 ans (Master)',
    desc: 'Formation des cadres de l\'enseignement supérieur et secondaire, psychopédagogues, concepteurs de manuels et gestionnaires scolaires.',
    filieres: ['Psychopédagogie & Orientation Scolaire', 'Didactique des Disciplines', 'Gestion & Administration Scolaire', 'Mesure & Évaluation des Apprentissages'],
    careers: ['Inspecteur de l\'Enseignement', 'Professeur d\'Établissement Supérieur', 'Conseiller d\'Orientation Pédagogique', 'Directeur d\'Institution Scolaire']
  },
  {
    id: 8,
    code: 'FTH',
    icon: '📖',
    name: 'Faculté de Théologie et Sciences des Religions',
    degree: 'Licence (LMD) • Master Ministère & Éthique',
    duration: '3 ans (Licence) • 2 ans (Master)',
    desc: 'Exégèse rigoureuse des textes sacrés, langues bibliques (Hébreu & Grec), théologie systématique, éthique sociale et médiation pastorale.',
    filieres: ['Théologie Systématique & Dogmatique', 'Exégèse Biblique & Langues Anciennes', 'Éthique Sociale & Transformation', 'Ministère Pastoral & Conseil'],
    careers: ['Pasteur / Ministre du Culte', 'Enseignant en Sciences Religieuses', 'Médiateur Social & Communautaire', 'Conseiller Éthique']
  }
];

export default function FormationsIndexPage() {
  const [filter, setFilter] = useState<string>('all');

  const filteredFaculties = filter === 'all' 
    ? ALL_FACULTIES 
    : ALL_FACULTIES.filter(f => f.code.toLowerCase().includes(filter.toLowerCase()) || f.degree.toLowerCase().includes(filter.toLowerCase()));

  return (
    <>
      <Head>
        <title>Les 8 Facultés &amp; Offre Académique LMD | IUM-MORAVE</title>
        <meta 
          name="description" 
          content="Consultez l'offre complète des 8 Facultés et programmes LMD officiellement agréés de l'Institut Universitaire Morave Willsamal (Sciences, Médecine, Droit, Économie, Agronomie, Com, Éducation, Théologie)." 
        />
      </Head>

      <Navbar currentPath="/formations" />

      <main className="formations-main">
        {/* HERO */}
        <section className="formations-hero">
          <div className="container">
            <span className="badge-gold">🎓 Diplômes d&apos;État Homologués ESU</span>
            <h1>Les 8 Facultés &amp; Filières d&apos;Excellence</h1>
            <p className="hero-lead">
              L&apos;IUM-MORAVE propose un enseignement supérieur de haut niveau structuré selon les standards du système LMD (Licence en 3 ans, Master en 2 ans, Doctorat), sous l&apos;Agrément Ministériel N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018.
            </p>
            <div className="hero-stats-mini">
              <div className="stat-pill"><strong>8</strong> Facultés officielles</div>
              <div className="stat-pill"><strong>32+</strong> Filières de spécialisation</div>
              <div className="stat-pill"><strong>180 ECTS</strong> Licence LMD</div>
              <div className="stat-pill"><strong>120 ECTS</strong> Master ISI</div>
            </div>
          </div>
        </section>

        {/* LISTE DES 8 FACULTES */}
        <section className="section-faculties">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Catalogue Universitaire Officiel</span>
              <h2>Choisissez votre domaine d&apos;études</h2>
              <p>Chaque faculté prépare les étudiants aux réalités professionnelles contemporaines avec des cours théoriques rigoureux et des stages pratiques obligatoires.</p>
            </div>

            <div className="faculties-grid">
              {filteredFaculties.map((f) => (
                <article className="faculty-card" key={f.code}>
                  <div className="fac-top">
                    <span className="fac-icon">{f.icon}</span>
                    <span className="fac-code">{f.code}</span>
                  </div>

                  <h3>{f.name}</h3>
                  <div className="fac-degree-badge">📜 {f.degree}</div>
                  <p className="fac-desc">{f.desc}</p>

                  <div className="filieres-block">
                    <strong>Filières phares :</strong>
                    <div className="filieres-tags">
                      {f.filieres.map((filiere, idx) => (
                        <span className="tag" key={idx}>✓ {filiere}</span>
                      ))}
                    </div>
                  </div>

                  <div className="careers-block">
                    <strong>Débouchés professionnels :</strong>
                    <p>{f.careers.join(' • ')}</p>
                  </div>

                  <div className="fac-actions">
                    <a href={`/facultes/${f.id}`} className="btn-fac-detail">Voir le cursus complet &amp; syllabus →</a>
                    <a href="/admissions" className="btn-fac-apply">Postuler</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* BANNIERE ADMISSIONS */}
        <section className="section-apply-banner">
          <div className="container">
            <div className="apply-banner-box">
              <h2>Prêt à débuter votre cursus universitaire ?</h2>
              <p>Les inscriptions pour l&apos;année académique 2026-2027 sont ouvertes pour l&apos;ensemble des 8 facultés.</p>
              <a href="/admissions" className="btn-primary-apply">Accéder au portail des admissions en ligne →</a>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />

      <style jsx>{`
        .formations-main {
          background: #f8fafc;
          color: #0f172a;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .formations-hero {
          background: linear-gradient(145deg, #071e38 0%, #0b3d6b 50%, #0b5394 100%);
          color: #fff;
          padding: 5rem 1.5rem 4.5rem;
          text-align: center;
        }
        .badge-gold {
          display: inline-block;
          background: rgba(245, 185, 20, 0.15);
          color: #f5b914;
          border: 1px solid #f5b914;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.35rem 1rem;
          border-radius: 2rem;
          margin-bottom: 1.5rem;
        }
        h1 {
          font-size: clamp(2.2rem, 4vw, 3.4rem);
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 1.25rem;
        }
        .hero-lead {
          max-width: 820px;
          margin: 0 auto 2.5rem;
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.88);
          line-height: 1.7;
        }
        .hero-stats-mini {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .stat-pill {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1.2rem;
          border-radius: 2rem;
          font-size: 0.88rem;
          color: #fff;
        }
        .stat-pill strong {
          color: #f5b914;
          font-weight: 800;
        }

        .section-faculties {
          padding: 5rem 0;
        }
        .section-header {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 3.5rem;
        }
        .eyebrow {
          color: #0284c7;
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.4rem;
        }
        h2 {
          font-size: 2.2rem;
          font-weight: 800;
          color: #071e38;
          margin-bottom: 0.75rem;
        }
        .faculties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: 2rem;
        }
        .faculty-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 1.25rem;
          padding: 2.25rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .faculty-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(7, 30, 56, 0.1);
          border-color: #cbd5e1;
        }
        .fac-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        .fac-icon {
          font-size: 2.5rem;
        }
        .fac-code {
          background: #071e38;
          color: #f5b914;
          font-weight: 900;
          font-size: 0.8rem;
          padding: 0.3rem 0.75rem;
          border-radius: 0.4rem;
        }
        .faculty-card h3 {
          font-size: 1.35rem;
          color: #071e38;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }
        .fac-degree-badge {
          font-size: 0.82rem;
          font-weight: 700;
          color: #0284c7;
          background: #e0f2fe;
          padding: 0.35rem 0.75rem;
          border-radius: 0.4rem;
          display: inline-block;
          margin-bottom: 1rem;
          align-self: flex-start;
        }
        .fac-desc {
          color: #64748b;
          font-size: 0.92rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .filieres-block {
          margin-bottom: 1.25rem;
        }
        .filieres-block strong {
          display: block;
          font-size: 0.85rem;
          color: #334155;
          margin-bottom: 0.5rem;
        }
        .filieres-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .tag {
          background: #f1f5f9;
          color: #1e293b;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.25rem 0.55rem;
          border-radius: 0.35rem;
          border: 1px solid #e2e8f0;
        }
        .careers-block {
          background: #f8fafc;
          border-left: 3px solid #f5b914;
          padding: 0.75rem 1rem;
          border-radius: 0 0.5rem 0.5rem 0;
          margin-bottom: 1.75rem;
          flex-grow: 1;
        }
        .careers-block strong {
          display: block;
          font-size: 0.8rem;
          color: #071e38;
          margin-bottom: 0.2rem;
        }
        .careers-block p {
          font-size: 0.82rem;
          color: #475569;
          line-height: 1.5;
        }
        .fac-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: auto;
        }
        .btn-fac-detail {
          flex: 1;
          background: #071e38;
          color: #fff;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          text-decoration: none;
          text-align: center;
          transition: background 0.15s ease;
        }
        .btn-fac-detail:hover {
          background: #0b3d6b;
        }
        .btn-fac-apply {
          background: #f5b914;
          color: #071e38;
          font-weight: 800;
          font-size: 0.85rem;
          padding: 0.75rem 1.25rem;
          border-radius: 0.5rem;
          text-decoration: none;
          text-align: center;
        }

        .section-apply-banner {
          padding: 3rem 0 5rem;
        }
        .apply-banner-box {
          background: linear-gradient(135deg, #071e38 0%, #0b3d6b 100%);
          border-radius: 1.5rem;
          padding: 4rem 2.5rem;
          text-align: center;
          color: #fff;
        }
        .apply-banner-box h2 {
          color: #fff;
          margin-bottom: 0.75rem;
        }
        .apply-banner-box p {
          color: rgba(255, 255, 255, 0.85);
          font-size: 1.1rem;
          max-width: 650px;
          margin: 0 auto 2.25rem;
        }
        .btn-primary-apply {
          background: #f5b914;
          color: #071e38;
          font-weight: 900;
          padding: 1rem 2.5rem;
          border-radius: 0.5rem;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 4px 16px rgba(245, 185, 20, 0.4);
        }

        @media (max-width: 900px) {
          .faculties-grid {
            grid-template-columns: 1fr;
          }
          .fac-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
