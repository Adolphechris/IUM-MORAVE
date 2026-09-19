import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import GlobalFooter from '../components/GlobalFooter';

export default function CampusViePage() {
  const facilities = [
    {
      image: '/images/amphitheater-class.jpg',
      title: 'Grands Amphithéâtres Magistraux',
      category: 'Enseignement Supérieur',
      desc: 'Salles spacieuses dotées d\'une excellente acoustique, d\'une ventilation optimale et d\'équipements audiovisuels modernes pour les cours théoriques des 8 facultés.'
    },
    {
      image: '/images/student-laptop.jpg',
      title: 'Laboratoires Informatiques & Salle Réseau',
      category: 'Numérique & Pratique',
      desc: 'Stations de travail connectées à haut débit, serveurs de test pour le Master ISI, simulation de réseaux Cisco, développement d\'IA et manipulation de bases de données.'
    },
    {
      image: '/images/student-library.jpg',
      title: 'Bibliothèque Centrale & Centre de Documentation',
      category: 'Recherche Scientifique',
      desc: 'Fonds documentaire physique et numérique riche de plusieurs milliers de manuels, d\'ouvrages médicaux, de revues de droit OHADA et d\'accès aux bibliothèques en ligne.'
    },
    {
      image: '/images/auditorium-exam.jpg',
      title: 'Auditoires d\'Évaluation & Examens LMD',
      category: 'Rigueur & Équité',
      desc: 'Infrastructures dédiées aux sessions d\'évaluation solennelles, garantissant l\'anonymat des copies, la discipline exemplaire et la transparence totale des délibérations.'
    },
    {
      image: '/images/student-arcade.jpg',
      title: 'Galeries de Détente & Espaces d\'Échanges',
      category: 'Vie Communautaire',
      desc: 'Cadre extérieur ombragé et sécurisé au sein du campus de Mwene-Ditu où les étudiants se rassemblent pour les travaux de groupe, le tutorat entre pairs et la détente.'
    },
    {
      image: '/images/students-work.jpg',
      title: 'Salles de Travaux Pratiques & Clinique',
      category: 'Pratique Professionnelle',
      desc: 'Espaces de mise en situation clinique pour les étudiants en médecine et de séminaires interactifs pour les sciences économiques et de l\'information.'
    }
  ];

  return (
    <>
      <Head>
        <title>Infrastructures &amp; Vie de Campus | IUM-MORAVE Mwene-Ditu</title>
        <meta 
          name="description" 
          content="Explorez le campus moderne de l'Institut Universitaire Morave Willsamal à Mwene-Ditu : amphithéâtres, laboratoires numériques, bibliothèque centrale et vie étudiante épanouissante." 
        />
      </Head>

      <Navbar currentPath="/campus-vie" />

      <main className="campus-main">
        {/* HERO */}
        <section className="campus-hero">
          <div className="container">
            <span className="badge-official">🌿 Cadre d&apos;Études Privilégié</span>
            <h1>Un Campus Moderne au Cœur de Mwene-Ditu</h1>
            <p className="hero-lead">
              L&apos;IUM-MORAVE offre aux étudiants un environnement sécurisé, connecté et stimulant, conçu pour favoriser la concentration académique, l&apos;innovation technique et l&apos;épanouissement personnel.
            </p>
          </div>
        </section>

        {/* LOCALISATION & ACCÈS */}
        <section className="section-location">
          <div className="container">
            <div className="location-card">
              <div className="location-info">
                <span className="eyebrow">Situation Géographique</span>
                <h2>Le Campus Principal de Mwene-Ditu</h2>
                <p>
                  Implanté sur l&apos;<strong>Avenue Aérodrome</strong> (Quartier Mandam, Commune de Bondoyi), le campus bénéficie d&apos;une position centrale facilement accessible par les transports urbains et régionaux dans la Province de Lomami.
                </p>
                <div className="location-highlights">
                  <div className="hl-item">
                    <span>📍</span>
                    <div>
                      <strong>Adresse Principale :</strong>
                      <span>Avenue Aérodrome, Q. Mandam, C. Bondoyi, Mwene-Ditu (B.P. 126)</span>
                    </div>
                  </div>
                  <div className="hl-item">
                    <span>🛡️</span>
                    <div>
                      <strong>Sécurité Permanente :</strong>
                      <span>Campus clos sous surveillance continue 24h/24 pour la quiétude des étudiants.</span>
                    </div>
                  </div>
                  <div className="hl-item">
                    <span>⚡</span>
                    <div>
                      <strong>Énergie &amp; Connectivité :</strong>
                      <span>Alimentation secourue et réseau Internet universitaire pour les travaux académiques.</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="location-visual">
                <img src="/images/student-campus.jpg" alt="Campus IUM-MORAVE" />
                <div className="visual-caption">Vue panoramique des allées du campus</div>
              </div>
            </div>
          </div>
        </section>

        {/* GALERIE DÉTAILLÉE DES ÉQUIPEMENTS */}
        <section className="section-facilities">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Équipements Académiques</span>
              <h2>Nos Infrastructures Pédagogiques</h2>
              <p>Des installations dimensionnées pour répondre aux exigences élevées du système LMD.</p>
            </div>

            <div className="facilities-grid">
              {facilities.map((fac, idx) => (
                <article className="fac-card" key={idx}>
                  <div className="fac-img-box">
                    <img src={fac.image} alt={fac.title} />
                    <span className="fac-cat">{fac.category}</span>
                  </div>
                  <div className="fac-body">
                    <h3>{fac.title}</h3>
                    <p>{fac.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES ET VIE ASSOCIATIVE */}
        <section className="section-student-life">
          <div className="container">
            <div className="life-grid">
              <div className="life-col">
                <span className="life-icon">🤝</span>
                <h3>Coordination Estudiantine</h3>
                <p>
                  Représentation démocratique des étudiants auprès des autorités académiques, organisation d&apos;activités sportives, tournois inter-facultaires et actions de solidarité communautaire.
                </p>
              </div>
              <div className="life-col">
                <span className="life-icon">💡</span>
                <h3>Club d&apos;Innovation &amp; Coding</h3>
                <p>
                  Ateliers pratiques hebdomadaires animés par les étudiants en informatique : initiation à la programmation, hackathons, cybersécurité et conception de logiciels au service de la région.
                </p>
              </div>
              <div className="life-col">
                <span className="life-icon">🩺</span>
                <h3>Cellule Santé &amp; Prévention</h3>
                <p>
                  Permanence d&apos;orientation médicale et campagnes de sensibilisation communautaire menées en lien avec les étudiants en médecine et la Faculté de Santé Publique.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BANNIERE REJOINDRE */}
        <section className="section-cta-campus">
          <div className="container">
            <div className="cta-box-campus">
              <h2>Envie de vivre l&apos;expérience universitaire IUM-MORAVE ?</h2>
              <p>Venez visiter le campus ou effectuez votre pré-inscription officielle en ligne dès maintenant.</p>
              <div className="cta-buttons">
                <a href="/admissions" className="btn-campus-primary">Déposer mon dossier d&apos;admission →</a>
                <a href="/contact" className="btn-campus-secondary">Organiser une visite du campus</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />

      <style jsx>{`
        .campus-main {
          background: #f8fafc;
          color: #0f172a;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .campus-hero {
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

        .section-location {
          padding: 5rem 0;
          background: #fff;
        }
        .location-card {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3.5rem;
          align-items: center;
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
          margin-bottom: 1rem;
        }
        .location-info p {
          color: #64748b;
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 2rem;
        }
        .location-highlights {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .hl-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .hl-item span:first-child {
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        .hl-item strong {
          display: block;
          color: #071e38;
          font-size: 0.95rem;
          margin-bottom: 0.2rem;
        }
        .hl-item span:last-child {
          color: #64748b;
          font-size: 0.88rem;
        }
        .location-visual {
          position: relative;
          border-radius: 1.25rem;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }
        .location-visual img {
          width: 100%;
          height: 380px;
          object-fit: cover;
          display: block;
        }
        .visual-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(7, 30, 56, 0.85);
          color: #fff;
          font-size: 0.85rem;
          padding: 0.75rem 1.25rem;
        }

        .section-facilities {
          padding: 5rem 0;
        }
        .section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3.5rem;
        }
        .facilities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }
        .fac-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 1.25rem;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
        }
        .fac-img-box {
          position: relative;
          height: 220px;
        }
        .fac-img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .fac-cat {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: #071e38;
          color: #f5b914;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.3rem 0.75rem;
          border-radius: 2rem;
        }
        .fac-body {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .fac-body h3 {
          font-size: 1.25rem;
          color: #071e38;
          margin-bottom: 0.5rem;
        }
        .fac-body p {
          color: #64748b;
          font-size: 0.92rem;
          line-height: 1.6;
        }

        .section-student-life {
          padding: 5rem 0;
          background: #fff;
        }
        .life-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
        }
        .life-col {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: 2.5rem;
        }
        .life-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 1.25rem;
        }
        .life-col h3 {
          font-size: 1.3rem;
          color: #071e38;
          margin-bottom: 0.75rem;
        }
        .life-col p {
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.7;
        }

        .section-cta-campus {
          padding: 5rem 0;
        }
        .cta-box-campus {
          background: linear-gradient(135deg, #071e38 0%, #0b3d6b 100%);
          border-radius: 1.5rem;
          padding: 4rem 2rem;
          text-align: center;
          color: #fff;
        }
        .cta-box-campus h2 {
          color: #fff;
          margin-bottom: 1rem;
        }
        .cta-box-campus p {
          color: rgba(255, 255, 255, 0.85);
          font-size: 1.1rem;
          max-width: 650px;
          margin: 0 auto 2.5rem;
        }
        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }
        .btn-campus-primary {
          background: #f5b914;
          color: #071e38;
          font-weight: 800;
          padding: 0.9rem 2rem;
          border-radius: 0.5rem;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(245, 185, 20, 0.35);
        }
        .btn-campus-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-weight: 700;
          padding: 0.9rem 2rem;
          border-radius: 0.5rem;
          text-decoration: none;
        }

        @media (max-width: 900px) {
          .location-card, .life-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
