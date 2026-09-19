import React from 'react';

export default function GlobalFooter() {
  return (
    <>
      <footer className="footer">
        {/* BANDEAU JURIDIQUE OFFICIEL */}
        <div className="footer-legal-band">
          <div className="legal-band-inner">
            <div className="legal-seal">
              <img src="/images/logo-crest.jpg" alt="Sceau Officiel IUM-MORAVE" className="legal-seal-img" />
            </div>
            <div className="legal-content">
              <p className="legal-title">Statut Légal &amp; Accréditation Ministérielle</p>
              <div className="legal-items">
                <div className="legal-item">
                  <span className="legal-label">Arrêté Ministériel</span>
                  <span className="legal-value">N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 du 09 Avril 2018</span>
                </div>
                <div className="legal-divider" />
                <div className="legal-item">
                  <span className="legal-label">Tutelle Officielle</span>
                  <span className="legal-value">Ministère de l&apos;Enseignement Supérieur et Universitaire (ESU RDC)</span>
                </div>
                <div className="legal-divider" />
                <div className="legal-item">
                  <span className="legal-label">Système Académique</span>
                  <span className="legal-value">LMD — Licence (3 ans) • Master (2 ans) • Doctorat</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENU PRINCIPAL DU PIED DE PAGE */}
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="/images/logo-crest.jpg" alt="Blason IUM-MORAVE" className="footer-crest-img" />
            <div>
              <strong>Institut Universitaire Morave Willsamal</strong>
              <p>Établissement privé d&apos;enseignement supérieur et de recherche scientifique d&apos;excellence.</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                📍 Avenue Aérodrome, Quartier Mandam, Commune de Bondoyi, Mwene-Ditu, Province de Lomami, RDC — B.P. 126
              </p>
            </div>
          </div>

          <div className="footer-links">
            <div>
              <strong>Navigation Institutionnelle</strong>
              <a href="/">Accueil</a>
              <a href="/admissions">Admissions &amp; Inscriptions</a>
              <a href="/diplomes-reussite">Diplômes &amp; Collation des Grades</a>
              <a href="/gouvernance">Direction &amp; Gouvernance</a>
              <a href="/campus-vie">Infrastructures &amp; Campus</a>
              <a href="/partenaires">Partenaires &amp; Stages Hospitaliers</a>
              <a href="/actualites-recherche">Recherche &amp; Vie Scientifique</a>
            </div>
            <div>
              <strong>Facultés &amp; Pôles LMD</strong>
              <a href="/#formations">Sciences &amp; Technologies (FST)</a>
              <a href="/#formations">Médecine &amp; Santé Publique (FMS)</a>
              <a href="/#formations">Droit &amp; Sciences Politiques (FDSP)</a>
              <a href="/#formations">Économie &amp; Gestion (FSEG)</a>
              <a href="/#formations">Sciences Agronomiques (FSA)</a>
              <a href="/#formations">Sciences de l&apos;Info &amp; Com (FSIC)</a>
            </div>
            <div>
              <strong>Services &amp; Sécurité</strong>
              <a href="/espace">Espace Étudiant</a>
              <a href="/espace">Espace Enseignant</a>
              <a href="/espace">Administration &amp; Scolarité</a>
              <a href="/verify">🛡️ Vérification de Diplôme / QR Code</a>
              <a href="/releve-officiel">📜 Relevé Officiel ESU</a>
              <a href="/contact">Contact officiel</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Institut Universitaire Morave (IUM-MORAVE) · Tous droits réservés · République Démocratique du Congo</p>
        </div>
      </footer>

      <style jsx>{`
        .footer {
          background: #071e38;
          color: rgba(255, 255, 255, 0.7);
          border-top: 1px solid rgba(245, 185, 20, 0.2);
        }
        .footer-legal-band {
          background: rgba(0, 0, 0, 0.35);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 2rem 1.5rem;
        }
        .legal-band-inner {
          max-width: 1240px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .legal-seal {
          flex-shrink: 0;
        }
        .legal-seal-img {
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          border: 2px solid #f5b914;
          box-shadow: 0 0 16px rgba(245, 185, 20, 0.25);
        }
        .legal-content {
          flex: 1;
        }
        .legal-title {
          font-size: 0.8rem;
          font-weight: 800;
          color: #f5b914;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        .legal-items {
          display: flex;
          gap: 0;
          flex-wrap: wrap;
        }
        .legal-item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding: 0 1.75rem;
          flex: 1;
          min-width: 220px;
        }
        .legal-item:first-child {
          padding-left: 0;
        }
        .legal-divider {
          width: 1px;
          background: rgba(255, 255, 255, 0.12);
          flex-shrink: 0;
          margin: 0.25rem 0;
        }
        .legal-label {
          font-size: 0.68rem;
          font-weight: 900;
          color: #f5b914;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .legal-value {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.88);
          font-weight: 500;
          line-height: 1.5;
        }
        .footer-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 3.5rem 1.5rem 2rem;
          display: flex;
          gap: 3rem;
          flex-wrap: wrap;
          justify-content: space-between;
        }
        .footer-brand {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          max-width: 360px;
        }
        .footer-crest-img {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          border: 2px solid #f5b914;
          flex-shrink: 0;
        }
        .footer-brand strong {
          color: #fff;
          display: block;
          margin-bottom: 0.4rem;
          font-size: 1.05rem;
        }
        .footer-brand p {
          font-size: 0.85rem;
          line-height: 1.6;
        }
        .footer-links {
          display: flex;
          gap: 3rem;
          flex-wrap: wrap;
        }
        .footer-links > div {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .footer-links strong {
          color: #fff;
          font-size: 0.9rem;
          margin-bottom: 0.4rem;
        }
        .footer-links a {
          color: rgba(255, 255, 255, 0.65);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.15s ease;
        }
        .footer-links a:hover {
          color: #f5b914;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1.25rem 1.5rem;
          text-align: center;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.45);
        }
        @media (max-width: 900px) {
          .legal-band-inner {
            flex-direction: column;
            align-items: flex-start;
          }
          .legal-divider {
            display: none;
          }
          .legal-item {
            padding: 0.5rem 0;
          }
        }
      `}</style>
    </>
  );
}
