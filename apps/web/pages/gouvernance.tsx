import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import GlobalFooter from '../components/GlobalFooter';

export default function GouvernancePage() {
  const leaders = [
    {
      role: 'Recteur de l\'Université',
      name: 'Prof. Dr. Isaac Jean Claude Tshilumbayi',
      title: 'Professeur des Universités & 1er Vice-Président de l\'Assemblée Nationale',
      desc: 'Éminent juriste et académicien, le Professeur Tshilumbayi impulse la vision stratégique, l\'élévation scientifique et le rayonnement national et international de l\'IUM-MORAVE.',
      icon: '🏛️',
      badge: 'Rectorat'
    },
    {
      role: 'Directeur Général',
      name: 'Dr. Marc Nsalanga Kayumba',
      title: 'Directeur Général de l\'IUM-MORAVE',
      desc: 'Supervise le fonctionnement exécutif, la gestion administrative, les partenariats hospitaliers cliniques et la coordination des 8 facultés au quotidien.',
      icon: '🎓',
      badge: 'Direction Générale'
    },
    {
      role: 'Secrétariat Général Académique',
      name: 'Commission Académique & Scolarité LMD',
      title: 'Gestion des Jurys, Délibérations & Curricula',
      desc: 'Veille à la conformité rigoureuse avec les instructions académiques du Ministère de l\'ESU, à l\'organisation des sessions d\'examens et à l\'homologation des procès-verbaux.',
      icon: '⚖️',
      badge: 'Scolarité LMD'
    }
  ];

  return (
    <>
      <Head>
        <title>Gouvernance &amp; Direction Académique | IUM-MORAVE</title>
        <meta 
          name="description" 
          content="Découvrez les autorités académiques de l'Institut Universitaire Morave Willsamal (IUM-MORAVE). Sous le rectorat du Prof. Dr. Isaac Jean Claude Tshilumbayi et la direction du Dr. Marc Nsalanga Kayumba." 
        />
      </Head>

      <Navbar currentPath="/gouvernance" />

      <main className="gov-main">
        {/* HERO */}
        <section className="gov-hero">
          <div className="container">
            <span className="badge-official">🏛️ Haute Direction &amp; Leadership Académique</span>
            <h1>Gouvernance &amp; Vision Institutionnelle</h1>
            <p className="hero-lead">
              Une direction expérimentée, engagée pour l&apos;intégrité, l&apos;innovation pédagogique et le développement socio-économique de la jeunesse congolaise.
            </p>
          </div>
        </section>

        {/* MOT DU RECTEUR */}
        <section className="section-rector-message">
          <div className="container">
            <div className="rector-box">
              <div className="rector-crest-col">
                <img src="/images/logo-crest.jpg" alt="Blason IUM-MORAVE" className="rector-crest" />
                <span className="rector-motto">« Savoir, Rigueur &amp; Progrès »</span>
              </div>
              <div className="rector-text-col">
                <span className="eyebrow">Discours d&apos;Orientation</span>
                <h2>Le Mot du Recteur</h2>
                <blockquote className="rector-quote">
                  « L&apos;Institut Universitaire Morave n&apos;est pas seulement un lieu d&apos;acquisition des connaissances techniques ; c&apos;est un sanctuaire civique où nous forgeons des esprits critiques, des leaders intègres et des bâtisseurs dévoués au développement de notre nation. Notre engagement envers les normes d&apos;excellence du système LMD est total et sans compromis. »
                </blockquote>
                <div className="rector-signature">
                  <strong>Prof. Dr. Isaac Jean Claude Tshilumbayi</strong>
                  <span>Recteur de l&apos;Institut Universitaire Morave Willsamal</span>
                  <span>1er Vice-Président de l&apos;Assemblée Nationale de la RDC</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AUTORITÉS ET ORGANES */}
        <section className="section-authorities">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Organigramme Exécutif</span>
              <h2>Les Organes Dirigeants de l&apos;Université</h2>
              <p>Une gouvernance structurée pour garantir la transparence, la rigueur et l&apos;excellence académique.</p>
            </div>

            <div className="leaders-grid">
              {leaders.map((item, idx) => (
                <div className="leader-card" key={idx}>
                  <div className="leader-top">
                    <span className="leader-icon">{item.icon}</span>
                    <span className="leader-badge">{item.badge}</span>
                  </div>
                  <h3>{item.role}</h3>
                  <p className="leader-name">{item.name}</p>
                  <p className="leader-title">{item.title}</p>
                  <p className="leader-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONSEIL D'ADMINISTRATION ET CONSEIL ACADÉMIQUE */}
        <section className="section-councils">
          <div className="container">
            <div className="councils-grid">
              <div className="council-box">
                <h3>🏛️ Conseil d&apos;Administration</h3>
                <p>
                  Définit les orientations budgétaires, supervise les investissements dans les infrastructures modernes, valide les créations de filières et garantit l&apos;indépendance stratégique de l&apos;institution.
                </p>
                <ul>
                  <li>Planification des extensions du campus</li>
                  <li>Dotation en équipements numériques et scientifiques</li>
                  <li>Veille à la conformité légale et aux agréments ESU</li>
                </ul>
              </div>

              <div className="council-box">
                <h3>📚 Conseil Académique &amp; Scientifique</h3>
                <p>
                  Regroupe les doyens des 8 facultés, les chefs de départements et les représentants du corps professoral. Il contrôle la conformité des maquettes d&apos;enseignement et les délibérations de jurys.
                </p>
                <ul>
                  <li>Harmonisation des programmes de Licence et Master LMD</li>
                  <li>Validation des protocoles de recherche et mémoires</li>
                  <li>Supervision des commissions de discipline et d&apos;éthique</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* TEXTES OFFICIELS */}
        <section className="section-legal-acts">
          <div className="container">
            <div className="legal-banner">
              <div className="legal-info">
                <h3>Cadre Réglementaire &amp; Acte Fondateur</h3>
                <p>
                  L&apos;Institut Universitaire Morave Willsamal (IUM-MORAVE) opère en pleine conformité avec la Loi-cadre de l&apos;Enseignement National et bénéficie de l&apos;Arrêté Ministériel <strong>N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 du 09 Avril 2018</strong> émis par le Ministère de l&apos;Enseignement Supérieur et Universitaire.
                </p>
              </div>
              <a href="/contact" className="btn-contact-dir">Contacter le Rectorat →</a>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />

      <style jsx>{`
        .gov-main {
          background: #f8fafc;
          color: #0f172a;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .gov-hero {
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
          max-width: 800px;
          margin: 0 auto;
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.88);
          line-height: 1.7;
        }

        .section-rector-message {
          padding: 5rem 0;
          background: #fff;
        }
        .rector-box {
          background: #071e38;
          color: #fff;
          border-radius: 1.5rem;
          padding: 3.5rem;
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 3.5rem;
          align-items: center;
          box-shadow: 0 20px 40px rgba(7, 30, 56, 0.2);
          border: 1px solid rgba(245, 185, 20, 0.3);
        }
        .rector-crest-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
        }
        .rector-crest {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 3px solid #f5b914;
          padding: 4px;
          background: #fff;
        }
        .rector-motto {
          font-size: 0.85rem;
          color: #f5b914;
          font-weight: 700;
          font-style: italic;
        }
        .eyebrow {
          color: #38bdf8;
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.4rem;
        }
        .rector-text-col h2 {
          color: #fff;
          font-size: 2.2rem;
          margin-bottom: 1.5rem;
        }
        .rector-quote {
          font-size: 1.1rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.9);
          font-style: italic;
          border-left: 3px solid #f5b914;
          padding-left: 1.5rem;
          margin: 0 0 2rem;
        }
        .rector-signature strong {
          display: block;
          font-size: 1.15rem;
          color: #f5b914;
        }
        .rector-signature span {
          display: block;
          font-size: 0.88rem;
          color: #94a3b8;
        }

        .section-authorities {
          padding: 5rem 0;
        }
        .section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3.5rem;
        }
        h2 {
          font-size: 2.2rem;
          font-weight: 800;
          color: #071e38;
          margin-bottom: 0.75rem;
        }
        .leaders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }
        .leader-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 1.25rem;
          padding: 2.25rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
        }
        .leader-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        .leader-icon {
          font-size: 2.2rem;
        }
        .leader-badge {
          background: #f1f5f9;
          color: #0369a1;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.25rem 0.7rem;
          border-radius: 1rem;
        }
        .leader-card h3 {
          font-size: 1rem;
          color: #0284c7;
          text-transform: uppercase;
          font-weight: 800;
          margin-bottom: 0.4rem;
        }
        .leader-name {
          font-size: 1.25rem;
          font-weight: 900;
          color: #071e38;
          margin-bottom: 0.3rem;
        }
        .leader-title {
          font-size: 0.85rem;
          color: #f59e0b;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .leader-desc {
          color: #64748b;
          font-size: 0.92rem;
          line-height: 1.6;
          flex-grow: 1;
        }

        .section-councils {
          padding: 3rem 0 5rem;
        }
        .councils-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
        }
        .council-box {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 1.25rem;
          padding: 2.5rem;
        }
        .council-box h3 {
          font-size: 1.35rem;
          color: #071e38;
          margin-bottom: 1rem;
        }
        .council-box p {
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 1.25rem;
        }
        .council-box ul {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .council-box li {
          color: #334155;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
        }
        .council-box li::before {
          content: '•';
          color: #f5b914;
          font-weight: 900;
          font-size: 1.5rem;
          margin-right: 0.75rem;
          line-height: 0;
        }

        .section-legal-acts {
          padding-bottom: 5rem;
        }
        .legal-banner {
          background: #0f172a;
          color: #fff;
          border-radius: 1.25rem;
          padding: 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }
        .legal-info h3 {
          font-size: 1.35rem;
          color: #f5b914;
          margin-bottom: 0.5rem;
        }
        .legal-info p {
          color: rgba(255, 255, 255, 0.8);
          max-width: 750px;
          line-height: 1.6;
        }
        .btn-contact-dir {
          background: #f5b914;
          color: #071e38;
          font-weight: 800;
          padding: 0.85rem 1.75rem;
          border-radius: 0.5rem;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
        }

        @media (max-width: 900px) {
          .rector-box {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .rector-quote {
            border-left: none;
            border-top: 3px solid #f5b914;
            padding: 1.5rem 0 0;
          }
          .councils-grid, .legal-banner {
            grid-template-columns: 1fr;
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
}
