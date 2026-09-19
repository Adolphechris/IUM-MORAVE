import React, { useState, FormEvent } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import GlobalFooter from '../components/GlobalFooter';

export default function AdmissionsPage() {
  const [selectedCycle, setSelectedCycle] = useState<'licence' | 'master' | 'doctorat'>('licence');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleApply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Simulation enregistrement candidature
    setTimeout(() => {
      setLoading(false);
      setFormSubmitted(true);
    }, 800);
  }

  return (
    <>
      <Head>
        <title>Portail des Admissions &amp; Inscriptions 2026-2027 | IUM-MORAVE</title>
        <meta 
          name="description" 
          content="Rejoignez l'Institut Universitaire Morave Willsamal (IUM-MORAVE). Modalités d'admission, calendrier académique officiel, constitution du dossier pour les cycles Licence LMD, Master ISI et Doctorat en Médecine." 
        />
      </Head>

      <Navbar currentPath="/admissions" />

      <main className="admissions-main">
        {/* HERO SECTION */}
        <section className="admissions-hero">
          <div className="hero-container">
            <span className="badge-official">🏛️ Année Académique 2026-2027 — Inscriptions Ouvertes</span>
            <h1>Construisez votre avenir d&apos;excellence à l&apos;IUM-MORAVE</h1>
            <p className="hero-desc">
              Établissement d&apos;enseignement supérieur agréé par le Ministère de l&apos;ESU sous l&apos;Arrêté N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018. Formez-vous dans un cadre moderne avec des diplômes reconnus et homologués.
            </p>
            <div className="hero-cta-group">
              <a href="#formulaire" className="btn-primary">Postuler en ligne dès maintenant ↓</a>
              <a href="#conditions" className="btn-secondary">Consulter les conditions d&apos;accès</a>
            </div>
          </div>
        </section>

        {/* CALENDRIER DES ADMISSIONS */}
        <section className="section-calendar">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Dates Clés</span>
              <h2>Calendrier Officiel des Admissions</h2>
              <p>Respectez scrupuleusement les échéances pour garantir le traitement prioritaire de votre dossier.</p>
            </div>

            <div className="calendar-grid">
              <div className="cal-card active">
                <span className="cal-step">Session 1</span>
                <h3>Pré-inscriptions en Ligne</h3>
                <p className="cal-date">Du 1er Juillet au 15 Septembre 2026</p>
                <p className="cal-detail">Dépôt des candidatures préliminaires et étude des relevés de notes du secondaire.</p>
                <span className="cal-status open">En cours</span>
              </div>
              <div className="cal-card">
                <span className="cal-step">Session 2</span>
                <h3>Test d&apos;Orientation &amp; Entretien</h3>
                <p className="cal-date">Du 16 au 30 Septembre 2026</p>
                <p className="cal-detail">Évaluation d&apos;aptitude pour les facultés de Médecine (FMS) et Technologies (FST).</p>
                <span className="cal-status coming">À venir</span>
              </div>
              <div className="cal-card">
                <span className="cal-step">Session 3</span>
                <h3>Validation &amp; Rentrée Solennelle</h3>
                <p className="cal-date">Première quinzaine d&apos;Octobre 2026</p>
                <p className="cal-detail">Attribution des matricules officiels, remise des cartes d&apos;étudiant et rentrée académique.</p>
                <span className="cal-status coming">À venir</span>
              </div>
            </div>
          </div>
        </section>

        {/* CRITÈRES PAR CYCLE */}
        <section className="section-cycles" id="conditions">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Cycles &amp; Éligibilité</span>
              <h2>Conditions d&apos;Admissibilité par Niveau LMD</h2>
              <p>Sélectionnez le cycle souhaité pour consulter les prérequis et pièces à fournir.</p>
            </div>

            <div className="cycle-tabs">
              <button 
                className={`tab-btn ${selectedCycle === 'licence' ? 'active' : ''}`}
                onClick={() => setSelectedCycle('licence')}
              >
                🎓 Licence LMD (Bac+3)
              </button>
              <button 
                className={`tab-btn ${selectedCycle === 'master' ? 'active' : ''}`}
                onClick={() => setSelectedCycle('master')}
              >
                💼 Master Professionnel / ISI (Bac+5)
              </button>
              <button 
                className={`tab-btn ${selectedCycle === 'doctorat' ? 'active' : ''}`}
                onClick={() => setSelectedCycle('doctorat')}
              >
                🩺 Doctorat en Médecine (M5/D)
              </button>
            </div>

            <div className="cycle-content-box">
              {selectedCycle === 'licence' && (
                <div className="cycle-pane">
                  <h3>Licence du Système LMD (8 Facultés Disponibles)</h3>
                  <p className="lead">Accessible à tout lauréat de l&apos;Examen d&apos;État (Baccalauréat) ou diplôme équivalent homologué.</p>
                  
                  <div className="pane-grid">
                    <div>
                      <h4>📋 Pièces à constituer :</h4>
                      <ul className="doc-list">
                        <li>Copie certifiée conforme du Diplôme d&apos;État ou Attestation de réussite.</li>
                        <li>Bulletins des 5e et 6e années des humanités secondaires.</li>
                        <li>Extrait d&apos;acte de naissance ou certificat de nationalité.</li>
                        <li>Certificat d&apos;aptitude physique et médicale récent.</li>
                        <li>4 photos passeport récentes sur fond blanc.</li>
                      </ul>
                    </div>
                    <div className="info-box-right">
                      <h4>💡 Faculté des Sciences &amp; Technologies :</h4>
                      <p>Pour le Génie Logiciel et l&apos;IA, une bonne base en mathématiques ou sciences exactes est fortement recommandée.</p>
                      <div className="duration-badge">Durée du cursus : 6 semestres (180 ECTS)</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedCycle === 'master' && (
                <div className="cycle-pane">
                  <h3>Master Spécialisé &amp; Master Ingénierie Sécurité Informatique (ISI)</h3>
                  <p className="lead">Programme d&apos;excellence ouvert aux détenteurs d&apos;un diplôme de graduat ou d&apos;une licence LMD homologuée.</p>
                  
                  <div className="pane-grid">
                    <div>
                      <h4>📋 Pièces à constituer :</h4>
                      <ul className="doc-list">
                        <li>Diplôme de Licence LMD ou de Graduat dans une filière connexe.</li>
                        <li>Relevés de notes officiels certifiés de toutes les années universitaires antérieures.</li>
                        <li>Curriculum Vitae détaillé et lettre de motivation professionnelle.</li>
                        <li>Projet de recherche ou lettre d&apos;engagement professionnel.</li>
                      </ul>
                    </div>
                    <div className="info-box-right">
                      <h4>🛡️ Spécialité Cybersécurité &amp; ISI :</h4>
                      <p>Le Master ISI (120 ECTS) prépare aux fonctions d&apos;architecte sécurité des systèmes, auditeur cryptographique et responsable SOC.</p>
                      <div className="duration-badge">Durée du cursus : 4 semestres (120 ECTS)</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedCycle === 'doctorat' && (
                <div className="cycle-pane">
                  <h3>Doctorat en Médecine Générale &amp; Santé Publique</h3>
                  <p className="lead">Cursus médical complet réalisé avec l&apos;appui clinique et pédagogique de l&apos;ISTM.</p>
                  
                  <div className="pane-grid">
                    <div>
                      <h4>📋 Critères rigoureux :</h4>
                      <ul className="doc-list">
                        <li>Diplôme d&apos;État en section scientifique (Biologie-Chimie ou Math-Physique) avec mention favorable.</li>
                        <li>Réussite obligatoire au concours d&apos;entrée en Faculté de Médecine.</li>
                        <li>Engagement d&apos;assiduité aux stages hospitaliers pratiques dès la première phase clinique.</li>
                      </ul>
                    </div>
                    <div className="info-box-right">
                      <h4>🏥 Immersion Clinique :</h4>
                      <p>Pratique hospitalière intensive supervisée par des médecins spécialistes et professeurs associés.</p>
                      <div className="duration-badge">Cursus médical habilité ESU</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FORMULAIRE DE PRÉ-INSCRIPTION */}
        <section className="section-form" id="formulaire">
          <div className="container">
            <div className="form-wrapper">
              <div className="form-info-col">
                <span className="eyebrow-light">Formulaire Officiel</span>
                <h2>Déposez votre candidature en 2 minutes</h2>
                <p>
                  Remplissez ce formulaire préliminaire. Notre commission des admissions analysera votre profil et vous transmettra votre numéro de dossier sous 48 heures.
                </p>
                <div className="contact-bullet">
                  <strong>Secrétariat Général Académique</strong>
                  <span>📍 Campus IUM-MORAVE, Avenue Aérodrome, Mwene-Ditu</span>
                  <span>✉️ secretariat@iumorave-ac.org</span>
                </div>
              </div>

              <div className="form-card-col">
                {formSubmitted ? (
                  <div className="success-banner">
                    <span className="success-icon">✅</span>
                    <h3>Candidature enregistrée avec succès !</h3>
                    <p>
                      Votre pré-inscription a été transmise à la Direction Académique de l&apos;IUM-MORAVE. Vous recevrez un accusé de réception officiel par email avec la liste détaillée des pièces à déposer au campus.
                    </p>
                    <a href="/" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                      Retour à la page d&apos;accueil
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="apply-form">
                    <div className="form-group">
                      <label htmlFor="fullname">Nom complet (Nom, Post-nom, Prénom) *</label>
                      <input type="text" id="fullname" required placeholder="Ex: KABAMBA MUKENDI Jean" />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="email">Adresse E-mail active *</label>
                        <input type="email" id="email" required placeholder="votre.email@exemple.com" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Téléphone / WhatsApp *</label>
                        <input type="tel" id="phone" required placeholder="+243 ..." />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="faculty">Faculté sollicitée *</label>
                        <select id="faculty" required defaultValue="FST">
                          <option value="FST">Faculté des Sciences et Technologies (Informatique/IA)</option>
                          <option value="FMS">Faculté de Médecine et Santé Publique</option>
                          <option value="FDSP">Faculté de Droit et Sciences Politiques</option>
                          <option value="FSEG">Faculté des Sciences Économiques et Gestion</option>
                          <option value="FSA">Faculté des Sciences Agronomiques</option>
                          <option value="FSIC">Faculté des Sciences de l&apos;Information et Com.</option>
                          <option value="FSE">Faculté des Sciences de l&apos;Éducation</option>
                          <option value="FTH">Faculté de Théologie</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="level">Niveau visé *</label>
                        <select id="level" required defaultValue="L1">
                          <option value="L1">Licence 1 (L1 - Système LMD)</option>
                          <option value="L2">Licence 2 (L2)</option>
                          <option value="L3">Licence 3 (L3)</option>
                          <option value="M1">Master 1 (ISI ou Gestion)</option>
                          <option value="M2">Master 2 (Recherche / Pro)</option>
                          <option value="MED1">Doctorat Médecine (Année Préparatoire/Doc)</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Observations ou parcours scolaire antérieur</label>
                      <textarea id="message" rows={3} placeholder="Précisez votre école de provenance, pourcentage obtenu à l'Examen d'État..." />
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                      {loading ? 'Traitement en cours...' : 'Soumettre ma pré-inscription officielle →'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />

      <style jsx>{`
        .admissions-main {
          background: #f8fafc;
          color: #0f172a;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .admissions-hero {
          background: linear-gradient(145deg, #071e38 0%, #0b3d6b 50%, #0b5394 100%);
          color: #fff;
          padding: 5rem 1.5rem 4.5rem;
          text-align: center;
          position: relative;
        }
        .hero-container {
          max-width: 900px;
          margin: 0 auto;
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
          letter-spacing: 0.05em;
        }
        h1 {
          font-size: clamp(2.2rem, 4vw, 3.5rem);
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 1.5rem;
        }
        .hero-desc {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.88);
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }
        .hero-cta-group {
          display: flex;
          justify-content: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }
        .btn-primary {
          background: #f5b914;
          color: #071e38;
          font-weight: 800;
          padding: 0.85rem 1.8rem;
          border-radius: 0.5rem;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(245, 185, 20, 0.4);
          transition: transform 0.15s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
        }
        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-weight: 700;
          padding: 0.85rem 1.8rem;
          border-radius: 0.5rem;
          text-decoration: none;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
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
        .section-calendar {
          padding: 5rem 0;
          background: #fff;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .cal-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: 2rem;
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cal-card.active {
          border-color: #0284c7;
          background: #f0f9ff;
          box-shadow: 0 10px 25px rgba(2, 132, 199, 0.1);
        }
        .cal-step {
          font-size: 0.75rem;
          font-weight: 800;
          color: #0284c7;
          text-transform: uppercase;
        }
        .cal-card h3 {
          font-size: 1.25rem;
          color: #071e38;
          margin: 0.4rem 0 0.6rem;
        }
        .cal-date {
          font-weight: 700;
          color: #f59e0b;
          font-size: 0.95rem;
          margin-bottom: 0.75rem;
        }
        .cal-detail {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .cal-status {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.25rem 0.75rem;
          border-radius: 2rem;
        }
        .cal-status.open {
          background: #dcfce7;
          color: #15803d;
        }
        .cal-status.coming {
          background: #f1f5f9;
          color: #64748b;
        }

        .section-cycles {
          padding: 5rem 0;
        }
        .cycle-tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }
        .tab-btn {
          background: #fff;
          border: 1px solid #cbd5e1;
          color: #475569;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .tab-btn.active {
          background: #071e38;
          color: #fff;
          border-color: #071e38;
          box-shadow: 0 4px 12px rgba(7, 30, 56, 0.2);
        }
        .cycle-content-box {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 1.25rem;
          padding: 3rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
        .cycle-pane h3 {
          font-size: 1.5rem;
          color: #071e38;
          margin-bottom: 0.5rem;
        }
        .cycle-pane .lead {
          color: #64748b;
          font-size: 1.05rem;
          margin-bottom: 2rem;
        }
        .pane-grid {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 2.5rem;
        }
        .doc-list {
          list-style: none;
          padding: 0;
          margin-top: 1rem;
        }
        .doc-list li {
          padding: 0.5rem 0;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
        }
        .doc-list li::before {
          content: '✓';
          color: #16a34a;
          font-weight: 900;
          margin-right: 0.75rem;
        }
        .info-box-right {
          background: #f8fafc;
          border-left: 4px solid #f5b914;
          padding: 1.75rem;
          border-radius: 0 0.75rem 0.75rem 0;
        }
        .duration-badge {
          margin-top: 1.25rem;
          background: #e0f2fe;
          color: #0369a1;
          font-size: 0.82rem;
          font-weight: 800;
          padding: 0.4rem 0.8rem;
          border-radius: 0.4rem;
          display: inline-block;
        }

        .section-form {
          padding: 5rem 0;
          background: #071e38;
          color: #fff;
        }
        .form-wrapper {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 4rem;
          align-items: center;
        }
        .eyebrow-light {
          color: #f5b914;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .form-info-col h2 {
          color: #fff;
          margin: 0.5rem 0 1rem;
        }
        .form-info-col p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
          margin-bottom: 2rem;
        }
        .contact-bullet {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.9rem;
        }
        .contact-bullet strong {
          color: #f5b914;
          margin-bottom: 0.25rem;
        }
        .form-card-col {
          background: #fff;
          color: #0f172a;
          padding: 2.5rem;
          border-radius: 1.25rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .apply-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .form-group label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #334155;
        }
        .form-group input, .form-group select, .form-group textarea {
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          padding: 0.7rem 0.9rem;
          font-size: 0.92rem;
          font-family: inherit;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          outline: none;
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
        }
        .btn-submit {
          background: #071e38;
          color: #f5b914;
          font-weight: 800;
          font-size: 1rem;
          padding: 1rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background 0.15s ease;
          margin-top: 0.5rem;
        }
        .btn-submit:hover {
          background: #0b3d6b;
        }
        .success-banner {
          text-align: center;
          padding: 2rem 1rem;
        }
        .success-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }

        @media (max-width: 900px) {
          .pane-grid, .form-wrapper {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
          .cycle-content-box {
            padding: 1.75rem;
          }
        }
      `}</style>
    </>
  );
}
