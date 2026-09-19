import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import GlobalFooter from '../components/GlobalFooter';

export default function ActualitesRecherchePage() {
  const newsList = [
    {
      date: 'Août 2026',
      tag: 'Cérémonie Solennelle',
      title: 'Collation des Grades : 120 Nouveaux Diplômés Homologués',
      summary: 'Cérémonie solennelle conjointe de remise de diplômes scellés et authentifiés pour 120 lauréats gradués et licenciés de l\'IUM-MORAVE et de l\'ISTM.',
      desc: 'En présence des autorités provinciales de Lomami et des représentants du Ministère de l\'ESU, les récipiendaires ont prêté le serment académique avant de recevoir leurs parchemins officiels.'
    },
    {
      date: 'Octobre 2025',
      tag: 'Rentrée Académique',
      title: 'Lancement Officiel de l\'Année Académique 2025-2026',
      summary: 'Ouverture solennelle de l\'année académique par le Recteur Prof. Dr. Isaac Jean Claude Tshilumbayi sur le campus de Mwene-Ditu.',
      desc: 'Le Recteur a rappelé les trois piliers directeurs de l\'institution : excellence pédagogique, digitalisation des cursus et rigueur éthique dans l\'évaluation.'
    },
    {
      date: 'Août 2025',
      tag: 'Recherche & Soutenance',
      title: 'Travail Académique Modèle en Sciences de l\'Information (FSIC)',
      summary: 'Soutenance publique de bachelier par Donat Sam Ngeleka sur « Le désintérêt des jeunes pour les médias traditionnels face aux réseaux sociaux ».',
      desc: 'Un travail scientifique salué par le jury pour sa rigueur méthodologique, sa pertinence sociologique et ses recommandations concrètes pour les médias locaux.'
    },
    {
      date: 'Mai 2025',
      tag: 'Colloque Conjoint',
      title: 'Journée Scientifique Conjointe IUM - ISTM',
      summary: 'Organisation d\'une grande journée d\'échanges scientifiques et d\'ateliers de recherche appliquée.',
      desc: 'Les enseignants-chercheurs en santé publique et en génie logiciel ont débattu des opportunités de la télémédecine et de la gestion des dossiers médicaux informatisés en milieu hospitalier congolais.'
    },
    {
      date: 'Mai 2024',
      tag: 'Vie Institutionnelle',
      title: 'Hommage Académique au Recteur',
      summary: 'Félicitations solennelles de la communauté universitaire au Recteur pour son élection à la 1ère vice-présidence de l\'Assemblée Nationale.',
      desc: 'Toute la communauté estudiantine et professorale s\'est réunie pour saluer cette haute charge d\'État témoignant de la stature intellectuelle et morale du leadership de l\'IUM.'
    },
    {
      date: 'Novembre 2022',
      tag: 'Diplômes & Mérite',
      title: 'Collation de Grades Académiques (88 Lauréats)',
      summary: 'Remise des diplômes homologués aux premières cohortes en informatique, sciences économiques et gestion.',
      desc: 'Une étape historique qui a consacré l\'essor de l\'université agréée en 2018 par l\'Arrêté Ministériel N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018.'
    }
  ];

  const researchAxes = [
    {
      title: 'Sécurité Informatique, Cryptographie & IA',
      faculty: 'Faculté des Sciences & Technologies (FST)',
      desc: 'Travaux sur la protection des infrastructures critiques, l\'analyse des vulnérabilités logicielles et l\'intégration de l\'intelligence artificielle pour l\'aide à la décision en Afrique centrale.'
    },
    {
      title: 'Épidémiologie & Santé Communautaire',
      faculty: 'Faculté de Médecine & Santé Publique (FMS)',
      desc: 'Études de terrain sur les pathologies endémiques dans le Grand Kasaï, protocoles de prévention infantile et optimisation de la gestion hospitalière en partenariat avec l\'ISTM.'
    },
    {
      title: 'Droit des Affaires OHADA & Gouvernance Minière',
      faculty: 'Faculté de Droit & Sciences Politiques (FDSP)',
      desc: 'Analyses juridiques des contrats d\'investissement, régulation des contentieux commerciaux et impact du cadre légal sur le développement économique local.'
    }
  ];

  return (
    <>
      <Head>
        <title>Actualités Académiques &amp; Recherche Scientifique | IUM-MORAVE</title>
        <meta 
          name="description" 
          content="Consultez les actualités officielles, publications scientifiques, journées de recherche et soutenances de mémoires à l'Institut Universitaire Morave Willsamal (Mwene-Ditu)." 
        />
      </Head>

      <Navbar currentPath="/actualites-recherche" />

      <main className="news-main">
        {/* HERO */}
        <section className="news-hero">
          <div className="container">
            <span className="badge-official">🔬 Savoir, Découverte &amp; Rayonnement</span>
            <h1>Actualités Officielles &amp; Recherche Scientifique</h1>
            <p className="hero-lead">
              L&apos;IUM-MORAVE est un foyer d&apos;émulation intellectuelle où les enseignants-chercheurs et les étudiants contribuent activement à la production de connaissances utiles pour la société.
            </p>
          </div>
        </section>

        {/* AXES DE RECHERCHE */}
        <section className="section-axes">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Production Scientifique</span>
              <h2>Nos Grands Axes de Recherche Appliquée</h2>
              <p>Des programmes d&apos;investigation scientifique connectés aux défis concrets du développement national.</p>
            </div>

            <div className="axes-grid">
              {researchAxes.map((axe, idx) => (
                <div className="axe-card" key={idx}>
                  <span className="axe-icon">💡</span>
                  <span className="axe-faculty">{axe.faculty}</span>
                  <h3>{axe.title}</h3>
                  <p>{axe.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FLUX D'ACTUALITÉS CHRONOLOGIQUE */}
        <section className="section-timeline">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Chronique Universitaire</span>
              <h2>Événements &amp; Jalons Récents</h2>
              <p>Retrouvez l&apos;historique complet des grandes étapes académiques de notre institution.</p>
            </div>

            <div className="timeline-grid">
              {newsList.map((item, idx) => (
                <article className="news-card" key={idx}>
                  <div className="news-card-top">
                    <span className="news-date">{item.date}</span>
                    <span className="news-tag">{item.tag}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="news-lead">{item.summary}</p>
                  <p className="news-desc">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* APPEL AUX CHERCHEURS */}
        <section className="section-research-call">
          <div className="container">
            <div className="call-card">
              <h2>Vous souhaitez soumettre un article ou collaborer sur un projet ?</h2>
              <p>
                Le Conseil Scientifique de l&apos;IUM-MORAVE accueille les contributions des enseignants-chercheurs, doctorants et partenaires scientifiques nationaux et internationaux.
              </p>
              <a href="/contact" className="btn-call-action">Contacter la Direction de la Recherche →</a>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />

      <style jsx>{`
        .news-main {
          background: #f8fafc;
          color: #0f172a;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .news-hero {
          background: linear-gradient(145deg, #071e38 0%, #0b3d6b 50%, #0b5394 100%);
          color: #fff;
          padding: 5rem 1.5rem 4.5rem;
          text-align: center;
        }
        .badge-official {
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
          margin: 0 auto;
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.88);
          line-height: 1.7;
        }

        .section-axes {
          padding: 5rem 0;
          background: #fff;
        }
        .section-header {
          text-align: center;
          max-width: 700px;
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
        .axes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .axe-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 1.25rem;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
        }
        .axe-icon {
          font-size: 2.2rem;
          margin-bottom: 1rem;
        }
        .axe-faculty {
          font-size: 0.78rem;
          color: #0284c7;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .axe-card h3 {
          font-size: 1.3rem;
          color: #071e38;
          margin-bottom: 0.75rem;
        }
        .axe-card p {
          color: #64748b;
          font-size: 0.92rem;
          line-height: 1.6;
        }

        .section-timeline {
          padding: 5rem 0;
        }
        .timeline-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 2rem;
        }
        .news-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 1.25rem;
          padding: 2.25rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
        }
        .news-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .news-date {
          background: #071e38;
          color: #f5b914;
          font-weight: 800;
          font-size: 0.75rem;
          padding: 0.25rem 0.65rem;
          border-radius: 0.4rem;
        }
        .news-tag {
          color: #0284c7;
          font-weight: 700;
          font-size: 0.8rem;
        }
        .news-card h3 {
          font-size: 1.25rem;
          color: #071e38;
          margin-bottom: 0.75rem;
          line-height: 1.35;
        }
        .news-lead {
          color: #334155;
          font-weight: 600;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 0.75rem;
        }
        .news-desc {
          color: #64748b;
          font-size: 0.88rem;
          line-height: 1.6;
        }

        .section-research-call {
          padding: 3rem 0 5rem;
        }
        .call-card {
          background: linear-gradient(135deg, #071e38 0%, #0b3d6b 100%);
          border-radius: 1.5rem;
          padding: 4rem 2.5rem;
          text-align: center;
          color: #fff;
        }
        .call-card h2 {
          color: #fff;
          margin-bottom: 1rem;
        }
        .call-card p {
          color: rgba(255, 255, 255, 0.85);
          font-size: 1.05rem;
          max-width: 700px;
          margin: 0 auto 2.25rem;
          line-height: 1.7;
        }
        .btn-call-action {
          background: #f5b914;
          color: #071e38;
          font-weight: 800;
          padding: 0.95rem 2.2rem;
          border-radius: 0.5rem;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 4px 16px rgba(245, 185, 20, 0.4);
        }

        @media (max-width: 900px) {
          .axes-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
