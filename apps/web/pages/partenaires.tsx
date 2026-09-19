import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import GlobalFooter from '../components/GlobalFooter';

export default function PartenairesPage() {
  const partners = [
    {
      name: 'ISTM — Institut Supérieur des Techniques Médicales',
      type: 'Partenariat Académique & Hospitalier Stratégique',
      desc: 'Collaboration étroite pour la Faculté de Médecine et Santé Publique : mutualisation des plateaux techniques, encadrement conjoint des stages cliniques et organisation commune des collations de grades.',
      icon: '🏥',
      badge: 'Médical'
    },
    {
      name: 'Ministère de l\'Enseignement Supérieur et Universitaire (ESU)',
      type: 'Tutelle Gouvernementale & Homologation',
      desc: 'Agrément officiel N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018. Alignement continu sur les maquettes pédagogiques nationales du système LMD et contrôle de la conformité des délibérations.',
      icon: '🏛️',
      badge: 'Institutionnel'
    },
    {
      name: 'Réseau des Hôpitaux & Centres de Santé du Grand Kasaï',
      type: 'Centres de Stages Pratiques & Immersion Clinique',
      desc: 'Accords-cadres permettant aux étudiants de médecine de réaliser leurs gardes, stages d\'internat et travaux communautaires dans les structures hospitalières régionales.',
      icon: '🩺',
      badge: 'Santé Publique'
    },
    {
      name: 'Entreprises & Opérateurs Télécoms / Numérique',
      type: 'Insertion Professionnelle & Stages Techniques',
      desc: 'Partenariats pour l\'accueil des étudiants en informatique et génie logiciel (FST) : projets de fin d\'études appliqués, intégration réseaux et cybersécurité des PME.',
      icon: '💼',
      badge: 'Technologique'
    }
  ];

  return (
    <>
      <Head>
        <title>Partenaires &amp; Coopération Académique | IUM-MORAVE</title>
        <meta 
          name="description" 
          content="Découvrez les partenariats stratégiques de l'IUM-MORAVE : alliance médicale avec l'ISTM, tutelle ministérielle ESU, hôpitaux cliniques et entreprises technologiques partenaires." 
        />
      </Head>

      <Navbar currentPath="/partenaires" />

      <main className="part-main">
        {/* HERO */}
        <section className="part-hero">
          <div className="container">
            <span className="badge-official">🤝 Synergie, Pratique &amp; Insertion</span>
            <h1>Partenariats Hospitaliers &amp; Coopération Institutionnelle</h1>
            <p className="hero-lead">
              L&apos;IUM-MORAVE tisse des alliances solides avec les acteurs publics et privés majeurs pour offrir à ses étudiants une formation ancrée dans la réalité du terrain et faciliter leur insertion professionnelle directe.
            </p>
          </div>
        </section>

        {/* FOCUS ISTM PARTNER */}
        <section className="section-istm">
          <div className="container">
            <div className="istm-box">
              <div className="istm-header">
                <span className="istm-badge">Alliance Phare</span>
                <h2>Le Partenariat Académique Majeur avec l&apos;ISTM</h2>
                <p>
                  Une coopération exemplaire entre deux piliers de l&apos;enseignement supérieur pour le développement des compétences médicales et paramédicales en République Démocratique du Congo.
                </p>
              </div>

              <div className="istm-features-grid">
                <div className="istm-feat">
                  <span className="feat-icon">🩺</span>
                  <h3>Plateau Clinique Conjoint</h3>
                  <p>Accès mutuel aux laboratoires de diagnostic, salles d&apos;anatomie et centres de simulation médicale.</p>
                </div>
                <div className="istm-feat">
                  <span className="feat-icon">📚</span>
                  <h3>Corps Professoral Associé</h3>
                  <p>Partage d&apos;enseignants-chercheurs spécialisés, de médecins chefs de service et d&apos;experts de santé publique.</p>
                </div>
                <div className="istm-feat">
                  <span className="feat-icon">🎓</span>
                  <h3>Cérémonies Communes</h3>
                  <p>Collation conjointe des grades académiques pour valoriser ensemble la réussite des promotions médicales et scientifiques.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LISTE DES PARTENAIRES */}
        <section className="section-partners-list">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Réseau d&apos;Excellence</span>
              <h2>Nos Partenaires Privilégiés</h2>
              <p>Des institutions et organisations qui font confiance à la rigueur de l&apos;IUM-MORAVE.</p>
            </div>

            <div className="partners-grid">
              {partners.map((p, idx) => (
                <div className="partner-card" key={idx}>
                  <div className="p-top">
                    <span className="p-icon">{p.icon}</span>
                    <span className="p-badge">{p.badge}</span>
                  </div>
                  <h3>{p.name}</h3>
                  <p className="p-type">{p.type}</p>
                  <p className="p-desc">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DEVENIR PARTENAIRE */}
        <section className="section-become-partner">
          <div className="container">
            <div className="become-card">
              <div className="become-info">
                <h2>Vous représentez une institution ou une entreprise ?</h2>
                <p>
                  Rejoignez notre réseau de partenaires pour recruter nos stagiaires et diplômés, co-développer des programmes de recherche appliquée ou soutenir nos projets pédagogiques.
                </p>
              </div>
              <a href="/contact" className="btn-contact-partner">Proposer une convention de partenariat →</a>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />

      <style jsx>{`
        .part-main {
          background: #f8fafc;
          color: #0f172a;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .part-hero {
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

        .section-istm {
          padding: 5rem 0;
          background: #fff;
        }
        .istm-box {
          background: #071e38;
          color: #fff;
          border-radius: 1.5rem;
          padding: 3.5rem;
          box-shadow: 0 20px 40px rgba(7, 30, 56, 0.2);
          border: 1px solid rgba(245, 185, 20, 0.25);
        }
        .istm-badge {
          background: #f5b914;
          color: #071e38;
          font-weight: 800;
          font-size: 0.8rem;
          text-transform: uppercase;
          padding: 0.3rem 0.8rem;
          border-radius: 1rem;
          display: inline-block;
          margin-bottom: 1rem;
        }
        .istm-header h2 {
          color: #fff;
          font-size: 2.2rem;
          margin-bottom: 1rem;
        }
        .istm-header p {
          color: rgba(255, 255, 255, 0.85);
          font-size: 1.1rem;
          max-width: 800px;
          line-height: 1.7;
          margin-bottom: 3rem;
        }
        .istm-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .istm-feat {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 1rem;
        }
        .feat-icon {
          font-size: 2.2rem;
          display: block;
          margin-bottom: 1rem;
        }
        .istm-feat h3 {
          font-size: 1.2rem;
          color: #f5b914;
          margin-bottom: 0.5rem;
        }
        .istm-feat p {
          color: rgba(255, 255, 255, 0.75);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .section-partners-list {
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
        .partners-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }
        .partner-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 1.25rem;
          padding: 2.25rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
        }
        .p-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        .p-icon {
          font-size: 2.2rem;
        }
        .p-badge {
          background: #f1f5f9;
          color: #0369a1;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.25rem 0.7rem;
          border-radius: 1rem;
        }
        .partner-card h3 {
          font-size: 1.2rem;
          color: #071e38;
          margin-bottom: 0.35rem;
        }
        .p-type {
          font-size: 0.85rem;
          color: #0284c7;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .p-desc {
          color: #64748b;
          font-size: 0.92rem;
          line-height: 1.6;
        }

        .section-become-partner {
          padding: 3rem 0 5rem;
        }
        .become-card {
          background: #071e38;
          border-radius: 1.5rem;
          padding: 3.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2.5rem;
          color: #fff;
        }
        .become-info h2 {
          color: #fff;
          margin-bottom: 0.75rem;
        }
        .become-info p {
          color: rgba(255, 255, 255, 0.85);
          font-size: 1.05rem;
          line-height: 1.7;
          max-width: 650px;
        }
        .btn-contact-partner {
          background: #f5b914;
          color: #071e38;
          font-weight: 800;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          text-decoration: none;
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(245, 185, 20, 0.4);
          flex-shrink: 0;
        }

        @media (max-width: 900px) {
          .istm-features-grid, .become-card {
            grid-template-columns: 1fr;
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
}
