import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import GlobalFooter from '../components/GlobalFooter';

export default function DiplomesReussitePage() {
  const graduations = [
    {
      year: 'Août 2026',
      title: 'Collation des Grades — Promotion Triomphe LMD',
      count: '120 Lauréats',
      details: 'Cérémonie solennelle conjointe de remise de diplômes pour 120 lauréats gradués et licenciés de l\'IUM-MORAVE et de l\'ISTM sous le haut patronage des autorités académiques.',
      image: '/images/graduation-ceremony.jpg'
    },
    {
      year: 'Novembre 2022',
      title: 'Collation de Grades Académiques',
      count: '88 Lauréats',
      details: 'Remise des diplômes scellés et homologués aux premières cohortes en sciences informatiques, sciences économiques et techniques médicales.',
      image: '/images/auditorium-exam.jpg'
    }
  ];

  return (
    <>
      <Head>
        <title>Diplômes, Réussite &amp; Collation des Grades | IUM-MORAVE</title>
        <meta 
          name="description" 
          content="Célébration du mérite académique à l'Institut Universitaire Morave. Diplômes homologués par le Ministère de l'ESU, cérémonies de collation des grades et sécurisation cryptographique HMAC." 
        />
      </Head>

      <Navbar currentPath="/diplomes-reussite" />

      <main className="grad-main">
        {/* HERO */}
        <section className="grad-hero">
          <div className="container">
            <span className="badge-gold">🏆 Couronnement des Études Universitaires</span>
            <h1>Diplômes d&apos;État Homologués &amp; Célébration du Succès</h1>
            <p className="hero-lead">
              L&apos;aboutissement de plusieurs années d&apos;assiduité, de rigueur et d&apos;excellence. À l&apos;IUM-MORAVE, chaque diplôme délivré est le gage d&apos;une formation rigoureuse, officiellement reconnue en République Démocratique du Congo et à l&apos;international.
            </p>
            <div className="hero-btn-row">
              <a href="/verify" className="btn-verify">🛡️ Vérifier l&apos;authenticité d&apos;un diplôme en ligne →</a>
              <a href="#ceremonies" className="btn-ghost-light">Voir les cérémonies solennelles</a>
            </div>
          </div>
        </section>

        {/* CADRE LÉGAL & SÉCURISATION */}
        <section className="section-security">
          <div className="container">
            <div className="security-grid">
              <div className="security-card">
                <span className="sec-icon">📜</span>
                <h3>Homologation Ministérielle ESU</h3>
                <p>
                  Conformément à l&apos;Arrêté Ministériel <strong>N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018</strong>, tous nos parchemins sont enregistrés dans les registres officiels de l&apos;État congolais.
                </p>
                <div className="sec-tag">Licence • Master • Doctorat</div>
              </div>

              <div className="security-card highlight">
                <span className="sec-icon">🔐</span>
                <h3>Empreinte Cryptographique HMAC</h3>
                <p>
                  Chaque diplôme et relevé de notes émis par l&apos;IUM-MORAVE comporte une signature numérique inviolable calculée par notre moteur sécurisé garantissant l&apos;intégrité absolue des notes.
                </p>
                <div className="sec-tag">Norme Anti-Fraude ESU</div>
              </div>

              <div className="security-card">
                <span className="sec-icon">📱</span>
                <h3>Vérification Instantanée QR Code</h3>
                <p>
                  Les employeurs, ambassades et universités étrangères peuvent scanner le QR code officiel du document pour attester instantanément de sa validité auprès de notre base de données.
                </p>
                <div className="sec-tag">Service Public 24h/24</div>
              </div>
            </div>
          </div>
        </section>

        {/* HISTORIQUE DES CEREMONIES */}
        <section className="section-ceremonies" id="ceremonies">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Moments Historiques</span>
              <h2>Cérémonies Solennelles de Collation des Grades</h2>
              <p>Retour en images sur les grandes promotions couronnées sur le campus de Mwene-Ditu.</p>
            </div>

            <div className="ceremonies-list">
              {graduations.map((g, idx) => (
                <article className="ceremony-item" key={idx}>
                  <div className="ceremony-img-box">
                    <img src={g.image} alt={g.title} />
                    <span className="ceremony-badge">{g.count}</span>
                  </div>
                  <div className="ceremony-body">
                    <span className="ceremony-year">{g.year}</span>
                    <h3>{g.title}</h3>
                    <p>{g.details}</p>
                    <div className="ceremony-meta">
                      <span>✓ Port officiel de la toge universitaire</span>
                      <span>✓ Prestation de serment académique</span>
                      <span>✓ Remise du diplôme homologué en main propre</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* EXCELLENCE & DÉBOUCHÉS */}
        <section className="section-stats-banner">
          <div className="container">
            <div className="stats-box">
              <div className="stat-col">
                <span className="stat-num">100%</span>
                <span className="stat-text">Conformité aux maquettes nationales du système LMD</span>
              </div>
              <div className="stat-col">
                <span className="stat-num">8</span>
                <span className="stat-text">Facultés autorisées délivrant des titres académiques reconnus</span>
              </div>
              <div className="stat-col">
                <span className="stat-num">120 ECTS</span>
                <span className="stat-text">Master d&apos;Ingénierie Sécurité Informatique (ISI) de référence</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA VERIFICATION */}
        <section className="section-cta">
          <div className="container">
            <div className="cta-card">
              <h2>Vous êtes un employeur ou une institution partenaire ?</h2>
              <p>
                Accédez à notre guichet de contrôle numérique pour vérifier en quelques secondes l&apos;authenticité d&apos;un certificat, d&apos;un relevé de délibération ou d&apos;un diplôme IUM-MORAVE.
              </p>
              <a href="/verify" className="btn-primary-large">Accéder au module de vérification QR Code →</a>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />

      <style jsx>{`
        .grad-main {
          background: #f8fafc;
          color: #0f172a;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .grad-hero {
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
          max-width: 850px;
          margin: 0 auto 2.5rem;
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.88);
          line-height: 1.7;
        }
        .hero-btn-row {
          display: flex;
          justify-content: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }
        .btn-verify {
          background: #f5b914;
          color: #071e38;
          font-weight: 800;
          padding: 0.85rem 1.8rem;
          border-radius: 0.5rem;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(245, 185, 20, 0.4);
          transition: transform 0.15s ease;
        }
        .btn-verify:hover {
          transform: translateY(-2px);
        }
        .btn-ghost-light {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-weight: 700;
          padding: 0.85rem 1.8rem;
          border-radius: 0.5rem;
          text-decoration: none;
        }

        .section-security {
          padding: 4.5rem 0;
          background: #fff;
        }
        .security-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }
        .security-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .security-card.highlight {
          background: #f0fdf4;
          border-color: #86efac;
        }
        .sec-icon {
          font-size: 2.2rem;
        }
        .security-card h3 {
          font-size: 1.25rem;
          color: #071e38;
        }
        .security-card p {
          color: #64748b;
          font-size: 0.92rem;
          line-height: 1.6;
          flex-grow: 1;
        }
        .sec-tag {
          align-self: flex-start;
          background: #e2e8f0;
          color: #334155;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.25rem 0.6rem;
          border-radius: 0.4rem;
        }

        .section-ceremonies {
          padding: 5rem 0;
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
        .ceremonies-list {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .ceremony-item {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 1.25rem;
          overflow: hidden;
          display: grid;
          grid-template-columns: 400px 1fr;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        .ceremony-img-box {
          position: relative;
          height: 100%;
          min-height: 250px;
        }
        .ceremony-img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ceremony-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: #f5b914;
          color: #071e38;
          font-weight: 900;
          font-size: 0.8rem;
          padding: 0.35rem 0.8rem;
          border-radius: 2rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        .ceremony-body {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .ceremony-year {
          color: #0284c7;
          font-weight: 800;
          font-size: 0.85rem;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }
        .ceremony-body h3 {
          font-size: 1.5rem;
          color: #071e38;
          margin-bottom: 0.75rem;
        }
        .ceremony-body p {
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }
        .ceremony-meta {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.88rem;
          color: #334155;
          font-weight: 600;
        }

        .section-stats-banner {
          background: #071e38;
          padding: 3.5rem 0;
          color: #fff;
        }
        .stats-box {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          text-align: center;
        }
        .stat-num {
          font-size: 2.8rem;
          font-weight: 900;
          color: #f5b914;
          display: block;
          margin-bottom: 0.4rem;
        }
        .stat-text {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.8);
          max-width: 260px;
          margin: 0 auto;
          display: block;
        }

        .section-cta {
          padding: 5rem 0;
        }
        .cta-card {
          background: linear-gradient(135deg, #0b3d6b 0%, #071e38 100%);
          border-radius: 1.5rem;
          padding: 4rem 2rem;
          text-align: center;
          color: #fff;
          box-shadow: 0 15px 35px rgba(7, 30, 56, 0.2);
        }
        .cta-card h2 {
          color: #fff;
          margin-bottom: 1rem;
        }
        .cta-card p {
          color: rgba(255, 255, 255, 0.85);
          font-size: 1.05rem;
          max-width: 700px;
          margin: 0 auto 2rem;
          line-height: 1.7;
        }
        .btn-primary-large {
          background: #f5b914;
          color: #071e38;
          font-weight: 900;
          padding: 1rem 2.2rem;
          border-radius: 0.6rem;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 4px 18px rgba(245, 185, 20, 0.4);
        }

        @media (max-width: 900px) {
          .ceremony-item {
            grid-template-columns: 1fr;
          }
          .ceremony-img-box {
            height: 220px;
          }
          .stats-box {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }
      `}</style>
    </>
  );
}
