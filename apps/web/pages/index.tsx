import React, { useEffect, useState } from 'react';
import Image from 'next/image';

type Faculty = {
  id: number;
  code: string;
  name: string;
  description: string;
};

type Program = {
  id: number;
  code: string;
  title: string;
  level: string;
  durationMonths: number;
};

type NewsItem = {
  id: number;
  title: string;
  summary: string;
  publishedAt: string;
};

type Track = {
  id: number;
  programId: number;
  title: string;
  description: string;
};

const apiUrl = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:4002';

const stats = [
  { value: '12+', label: 'Facultés & départements' },
  { value: '3 000+', label: 'Étudiants inscrits' },
  { value: '40+', label: 'Programmes LMD' },
  { value: '95%', label: 'Taux d\'insertion professionnelle' },
];

const campusGalleries = [
  {
    image: '/images/student-campus.jpg',
    title: 'Un Cadre d\'Étude Moderne et Accueillant',
    subtitle: 'Campus Principal & Infrastructures Académiques',
    desc: 'L\'Institut Universitaire Morave offre un environnement d\'apprentissage serein et sécurisé, doté de bâtiments modernes conçus pour favoriser l\'épanouissement intellectuel et la réussite de chaque étudiant.',
    badge: 'Vie de Campus',
  },
  {
    image: '/images/auditorium-exam.jpg',
    title: 'Des Auditoires Spacieux pour des Formations d\'Envergure',
    subtitle: 'Grand Auditoire & Évaluations Rigoureuses',
    desc: 'Nos grandes salles d\'examen et nos auditoires permettent d\'accueillir des centaines d\'étudiants dans le respect des exigences académiques du système LMD et de la discipline universitaire.',
    badge: 'Infrastructures',
  },
  {
    image: '/images/students-work.jpg',
    title: 'La Rigueur Pédagogique au Cœur de l\'Évaluation',
    subtitle: 'Évaluations & Examens Officiels',
    desc: 'Concentration, assiduité et intégrité : nos étudiants sont évalués selon des standards stricts garantissant la valeur et le mérite de chaque diplôme émis par l\'IUM-MORAVE.',
    badge: 'Excellence LMD',
  },
  {
    image: '/images/student-library.jpg',
    title: 'Accès aux Ressources & Recherche Documentaire',
    subtitle: 'Bibliothèque & Centre de Savoir',
    desc: 'Des milliers d\'ouvrages spécialisés, de revues scientifiques et d\'outils numériques sont mis à disposition des étudiants et enseignants-chercheurs pour approfondir leurs travaux.',
    badge: 'Recherche & Savoir',
  },
];

export default function Home() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadPortalData() {
      try {
        const [facultyResponse, programResponse, trackResponse, newsResponse] = await Promise.all([
          fetch(`${apiUrl}/faculties`),
          fetch(`${apiUrl}/programs`),
          fetch(`${apiUrl}/tracks`),
          fetch(`${apiUrl}/news`),
        ]);
        if (facultyResponse.ok) setFaculties(await facultyResponse.json());
        if (programResponse.ok) setPrograms(await programResponse.json());
        if (trackResponse.ok) setTracks(await trackResponse.json());
        if (newsResponse.ok) setNews(await newsResponse.json());
      } catch {
        // Fallback local silencieux
      }
    }
    loadPortalData();
  }, []);

  return (
    <>
      {/* ─── NAVIGATION AVEC BLASON OFFICIEL ───────────────────── */}
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
          <button className="menu-toggle" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
          <nav className={`nav-links${menuOpen ? ' open' : ''}`}>
            <a href="#formations">Formations</a>
            <a href="#campus">Campus en Images</a>
            <a href="#valeurs">L&apos;IUM</a>
            <a href="#actualites">Actualités</a>
            <a href="/contact">Contact</a>
            <a href="/espace" className="nav-cta">Espace numérique →</a>
          </nav>
        </div>
      </header>

      {/* ─── HERO AVEC BLASON & ÉTUDIANTE DU CAMPUS ────────────── */}
      <section className="hero" id="accueil">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-grid" />
        </div>

        <div className="hero-container">
          <div className="hero-text-col">
            <div className="hero-badge-row">
              <img src="/images/logo-crest.jpg" alt="Armoiries Officielle" className="hero-crest-mini" />
              <span className="hero-overtitle">Institut Universitaire Morave</span>
            </div>
            <h1 className="hero-title">
              Formez les&nbsp;
              <span className="highlight">bâtisseurs</span>
              <br />de demain.
            </h1>
            <p className="hero-subtitle">
              L&apos;<strong>Institut Universitaire Morave (IUM‑MORAVE)</strong> est un établissement d&apos;enseignement
              supérieur de référence, engagé pour l&apos;excellence académique, la recherche
              et l&apos;épanouissement de la jeunesse en République Démocratique du Congo.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#formations">Explorer nos programmes LMD</a>
              <a className="btn btn-ghost" href="#campus">Découvrir le campus en photos</a>
            </div>
          </div>

          <div className="hero-visual-col">
            <div className="hero-image-frame">
              <img
                src="/images/student-campus.jpg"
                alt="Étudiante brillante du campus IUM-MORAVE"
                className="hero-main-img"
              />
              <div className="hero-image-caption">
                <span className="caption-tag">Campus IUM</span>
                <p>Des étudiants épanouis dans un cadre d&apos;apprentissage moderne et sécurisé.</p>
              </div>
            </div>
          </div>
        </div>

        {/* BANDEAU DE STATISTIQUES */}
        <div className="hero-stats">
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── GALERIE DÉTAILLÉE DES PHOTOS DU CAMPUS ─────────────── */}
      <section className="section" id="campus">
        <div className="section-inner">
          <div className="section-header">
            <p className="eyebrow">Immersion Institutionnelle</p>
            <h2>Le Campus IUM-MORAVE en Images</h2>
            <p className="section-desc">
              Découvrez la vie universitaire, nos auditoires lors des séances d&apos;évaluation, nos espaces de recherche
              et la rigueur pédagogique qui caractérisent notre établissement.
            </p>
          </div>

          <div className="gallery-showcase">
            {campusGalleries.map((item, idx) => (
              <article className={`gallery-card ${idx % 2 === 1 ? 'reverse' : ''}`} key={item.title}>
                <div className="gallery-img-wrapper">
                  <img src={item.image} alt={item.title} className="gallery-img" />
                  <span className="gallery-badge">{item.badge}</span>
                </div>
                <div className="gallery-content">
                  <p className="gallery-subtitle">{item.subtitle}</p>
                  <h3>{item.title}</h3>
                  <p className="gallery-text">{item.desc}</p>
                  <div className="gallery-footer-tag">
                    <span>📍 Institut Universitaire Morave</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BLASON OFFICIEL ET SYMBOLES DE L'UNIVERSITÉ ────────── */}
      <section className="section section-alt" id="armoiries">
        <div className="section-inner">
          <div className="crest-showcase-box">
            <div className="crest-showcase-img-col">
              <img src="/images/logo-crest.jpg" alt="Blason Héraldique IUM-MORAVE" className="crest-showcase-img" />
            </div>
            <div className="crest-showcase-text-col">
              <p className="eyebrow">Identité &amp; Symbolique</p>
              <h2>Le Blason Héraldique de l&apos;IUM-MORAVE</h2>
              <p className="crest-desc">
                Les armoiries officielles de l&apos;Institut Universitaire Morave incarnent les valeurs fondamentales
                de notre vision éducative :
              </p>
              <ul className="crest-symbols-list">
                <li>
                  <span className="symbol-bullet">⭐</span>
                  <div>
                    <strong>Les Trois Étoiles d&apos;Or :</strong> L&apos;Excellence, l&apos;Intégrité et la Rigueur académique.
                  </div>
                </li>
                <li>
                  <span className="symbol-bullet">📖</span>
                  <div>
                    <strong>Le Livre Ouvert &amp; l&apos;Engrenage :</strong> L&apos;accès universel à la connaissance et la maîtrise de la technologie.
                  </div>
                </li>
                <li>
                  <span className="symbol-bullet">🌿</span>
                  <div>
                    <strong>La Palme d&apos;Argent &amp; la Flèche :</strong> L&apos;élévation de la jeunesse et le rayonnement au service de la nation.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FACULTÉS & FORMATIONS ───────────────────────────── */}
      <section className="section" id="formations">
        <div className="section-inner">
          <p className="eyebrow">Offre académique</p>
          <h2>Facultés &amp; Formations LMD</h2>

          {faculties.length > 0 && (
            <div className="cards-grid">
              {faculties.map((faculty) => (
                <article className="card faculty-card" key={faculty.id}>
                  <span className="card-badge">{faculty.code}</span>
                  <h3>{faculty.name}</h3>
                  <p>{faculty.description}</p>
                  <a className="card-link" href={`/facultes/${faculty.id}`}>Explorer la faculté →</a>
                </article>
              ))}
            </div>
          )}

          {programs.length > 0 && (
            <>
              <h3 className="sub-title">Programmes d&apos;études</h3>
              <div className="cards-grid">
                {programs.map((program) => (
                  <article className="card program-card" key={program.id}>
                    <span className="card-badge yellow">{program.code}</span>
                    <h3>{program.title}</h3>
                    <p className="program-meta">{program.level} · {program.durationMonths} mois</p>
                    {tracks.filter((t) => t.programId === program.id).length > 0 && (
                      <ul className="tracks-list">
                        {tracks
                          .filter((t) => t.programId === program.id)
                          .map((track) => (
                            <li key={track.id}>
                              <strong>{track.title}</strong>
                              <span>{track.description}</span>
                            </li>
                          ))}
                      </ul>
                    )}
                    <a className="card-link" href={`/formations/${program.id}`}>Voir la formation →</a>
                  </article>
                ))}
              </div>
            </>
          )}

          {faculties.length === 0 && (
            <div className="cards-grid">
              {[
                { code: 'FST', name: 'Faculté des Sciences et Technologies', desc: 'Informatique, Génie Logiciel, Réseaux, Mathematiques Appliquées.' },
                { code: 'FSEG', name: 'Faculté des Sciences Économiques et de Gestion', desc: 'Finance, Comptabilité, Management, Économie de Développement.' },
                { code: 'FDSP', name: 'Faculté de Droit et Sciences Politiques', desc: 'Droit Privé, Droit Public, Relations Internationales.' },
                { code: 'FMS', name: 'Faculté de Médecine et Santé Publique', desc: 'Médecine Générale, Santé Communautaire, Épidémiologie.' },
              ].map((f) => (
                <article className="card faculty-card" key={f.code}>
                  <span className="card-badge">{f.code}</span>
                  <h3>{f.name}</h3>
                  <p>{f.desc}</p>
                  <a className="card-link" href="/contact">En savoir plus →</a>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── ESPACES NUMÉRIQUES ──────────────────────────────── */}
      <section className="section section-alt" id="espaces">
        <div className="section-inner">
          <p className="eyebrow">Services numériques</p>
          <h2>Vos espaces institutionnels en ligne</h2>
          <div className="spaces-grid">
            <a className="space-card" href="/espace">
              <span className="space-icon">🎓</span>
              <div>
                <h3>Espace Étudiant</h3>
                <p>Relevés de notes sécurisés, emplois du temps, inscriptions et relevés LMD scellés.</p>
              </div>
              <span className="space-arrow">→</span>
            </a>
            <a className="space-card" href="/espace">
              <span className="space-icon">📚</span>
              <div>
                <h3>Espace Enseignant</h3>
                <p>Saisie des notes, gestion des UE/ECUE, suivi des présences et ressources pédagogiques.</p>
              </div>
              <span className="space-arrow">→</span>
            </a>
            <a className="space-card" href="/espace">
              <span className="space-icon">🏛️</span>
              <div>
                <h3>Administration &amp; Scolarité</h3>
                <p>Jurys de délibération LMD, procès-verbaux officiels et émission des diplômes.</p>
              </div>
              <span className="space-arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="/images/logo-crest.jpg" alt="Blason IUM-MORAVE" className="footer-crest-img" />
            <div>
              <strong>Institut Universitaire Morave</strong>
              <p>IUM‑MORAVE — L&apos;Excellence de l&apos;Enseignement Supérieur</p>
            </div>
          </div>
          <div className="footer-links">
            <div>
              <strong>Académique</strong>
              <a href="#formations">Formations LMD</a>
              <a href="#campus">Campus en Images</a>
              <a href="/documents">Documents Officiels</a>
            </div>
            <div>
              <strong>Institution</strong>
              <a href="/contact">Contact &amp; Admissions</a>
              <a href="/espace">Portail Numérique</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Institut Universitaire Morave (IUM-MORAVE) — Tous droits réservés.</p>
        </div>
      </footer>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --navy:     #071e38;
          --navy-light:#0b3d6b;
          --blue:     #0b5394;
          --sky:      #1a8cd8;
          --gold:     #f5b914;
          --gold-l:   #fde68a;
          --white:    #ffffff;
          --gray-50:  #f8fafc;
          --gray-100: #f1f5f9;
          --gray-200: #e2e8f0;
          --gray-500: #64748b;
          --gray-700: #334155;
          --text:     #0f2340;
          --radius:   1rem;
          --shadow:   0 6px 24px rgba(7,30,56,.08);
        }

        html { scroll-behavior: smooth; }
        body {
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          background: var(--gray-50);
          color: var(--text);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        /* ── NAVBAR ─────────────────────────────────────────── */
        .navbar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(7,30,56,.96);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .navbar-inner {
          max-width: 1240px; margin: 0 auto;
          padding: .85rem 1.5rem;
          display: flex; align-items: center; justify-content: space-between;
          gap: 1rem;
        }
        .brand {
          display: flex; align-items: center; gap: .85rem;
          text-decoration: none; flex-shrink: 0;
        }
        .brand-crest {
          width: 2.75rem; height: 2.75rem;
          border-radius: 50%; overflow: hidden;
          border: 2px solid var(--gold);
          box-shadow: 0 0 12px rgba(245,185,20,.3);
          flex-shrink: 0; background: #fff;
        }
        .crest-img { width: 100%; height: 100%; object-fit: cover; }
        .brand-text { display: flex; flex-direction: column; }
        .brand-full { color: #fff; font-weight: 800; font-size: 1rem; line-height: 1.2; }
        .brand-short { color: var(--gold); font-size: .72rem; font-weight: 700; letter-spacing: .08em; }
        .nav-links { display: flex; align-items: center; gap: 1.75rem; }
        .nav-links a { color: rgba(255,255,255,.82); text-decoration: none; font-size: .9rem; font-weight: 500; transition: color .2s; }
        .nav-links a:hover { color: #fff; }
        .nav-cta {
          background: var(--gold) !important;
          color: var(--navy) !important;
          font-weight: 800 !important;
          padding: .55rem 1.2rem;
          border-radius: .5rem;
          font-size: .88rem !important;
          transition: transform .15s, box-shadow .15s !important;
        }
        .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(245,185,20,.4) !important; }
        .menu-toggle { display: none; }

        /* ── HERO ───────────────────────────────────────────── */
        .hero {
          position: relative; overflow: hidden;
          background: linear-gradient(145deg, #071e38 0%, #0b3d6b 50%, #0b5394 100%);
          padding: 5rem 1.5rem 4rem;
        }
        .hero-bg { position: absolute; inset: 0; pointer-events: none; }
        .hero-orb {
          position: absolute; border-radius: 50%;
          filter: blur(90px); opacity: .25;
        }
        .orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, #1a8cd8, transparent); top: -120px; left: -100px; }
        .orb-2 { width: 500px; height: 500px; background: radial-gradient(circle, var(--gold), transparent); bottom: -80px; right: -80px; opacity: .18; }
        .hero-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .hero-container {
          position: relative; z-index: 1;
          max-width: 1240px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 3rem; align-items: center;
        }
        .hero-badge-row {
          display: flex; align-items: center; gap: .75rem;
          margin-bottom: 1.25rem;
        }
        .hero-crest-mini {
          width: 2rem; height: 2rem; border-radius: 50%;
          border: 1.5px solid var(--gold);
        }
        .hero-overtitle {
          color: var(--gold); font-size: .85rem; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase;
        }
        .hero-title {
          font-size: clamp(2.5rem, 4.5vw, 4.2rem);
          font-weight: 900; line-height: 1.08;
          color: #fff; margin-bottom: 1.25rem;
          letter-spacing: -.02em;
        }
        .highlight {
          background: linear-gradient(135deg, var(--gold) 0%, #f97316 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          color: rgba(255,255,255,.82);
          font-size: 1.05rem; margin-bottom: 2rem;
          line-height: 1.7;
        }
        .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

        .btn {
          display: inline-block; text-decoration: none;
          font-weight: 700; border-radius: .6rem;
          padding: .85rem 1.75rem; font-size: .95rem;
          transition: transform .15s, box-shadow .15s;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn-primary {
          background: var(--gold); color: var(--navy);
          box-shadow: 0 6px 24px rgba(245,185,20,.35);
        }
        .btn-ghost { border: 1.5px solid rgba(255,255,255,.35); color: #fff; }
        .btn-ghost:hover { background: rgba(255,255,255,.08); }

        /* VISUEL HERO ÉTUDIANTE */
        .hero-visual-col { position: relative; }
        .hero-image-frame {
          position: relative; border-radius: 1.25rem;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,.4);
          border: 3px solid rgba(255,255,255,.15);
        }
        .hero-main-img {
          width: 100%; height: 420px; object-fit: cover;
          display: block;
        }
        .hero-image-caption {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: linear-gradient(0deg, rgba(7,30,56,.95) 0%, rgba(7,30,56,0) 100%);
          padding: 2rem 1.5rem 1.25rem; color: #fff;
        }
        .caption-tag {
          background: var(--gold); color: var(--navy);
          font-size: .7rem; font-weight: 800; text-transform: uppercase;
          padding: .2rem .6rem; border-radius: 2rem;
          display: inline-block; margin-bottom: .4rem;
        }
        .hero-image-caption p { font-size: .9rem; opacity: .9; }

        /* STATS */
        .hero-stats {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1px; background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: var(--radius);
          margin: 3.5rem auto 0;
          max-width: 1240px; overflow: hidden;
        }
        .stat-card {
          background: rgba(255,255,255,.04);
          padding: 1.4rem 1rem;
          display: flex; flex-direction: column; align-items: center;
          gap: .25rem;
        }
        .stat-value { font-size: 1.9rem; font-weight: 900; color: var(--gold); }
        .stat-label { color: rgba(255,255,255,.7); font-size: .82rem; text-align: center; }

        /* ── SECTIONS & SHOWCASE GALERIE ──────────────────────── */
        .section { padding: 5.5rem 1.5rem; }
        .section-alt { background: var(--white); }
        .section-inner { max-width: 1240px; margin: 0 auto; }
        .section-header { text-align: center; max-width: 760px; margin: 0 auto 3.5rem; }
        .eyebrow {
          color: var(--sky); font-size: .8rem; font-weight: 800;
          letter-spacing: .12em; text-transform: uppercase;
          margin-bottom: .4rem;
        }
        h2 { font-size: clamp(2rem, 3.5vw, 2.75rem); font-weight: 800; color: var(--navy); margin-bottom: .75rem; }
        .section-desc { color: var(--gray-500); font-size: 1.05rem; }
        .sub-title { font-size: 1.35rem; font-weight: 700; color: var(--navy); margin: 2.5rem 0 1.5rem; }

        .gallery-showcase { display: flex; flex-direction: column; gap: 3rem; }
        .gallery-card {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 2.5rem; align-items: center;
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: transform .25s, box-shadow .25s;
        }
        .gallery-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(7,30,56,.12); }
        .gallery-card.reverse { direction: rtl; }
        .gallery-card.reverse .gallery-content { direction: ltr; }
        .gallery-img-wrapper { position: relative; height: 340px; overflow: hidden; }
        .gallery-img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
        .gallery-card:hover .gallery-img { transform: scale(1.04); }
        .gallery-badge {
          position: absolute; top: 1.25rem; left: 1.25rem;
          background: rgba(7,30,56,.85); backdrop-filter: blur(8px);
          color: var(--gold); font-size: .75rem; font-weight: 800;
          padding: .35rem .85rem; border-radius: 2rem;
          text-transform: uppercase; letter-spacing: .06em;
        }
        .gallery-content { padding: 2.5rem 2rem; display: flex; flex-direction: column; gap: .75rem; }
        .gallery-subtitle { color: var(--sky); font-size: .82rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
        .gallery-content h3 { font-size: 1.4rem; font-weight: 800; color: var(--navy); line-height: 1.25; }
        .gallery-text { color: var(--gray-500); font-size: .98rem; line-height: 1.7; }
        .gallery-footer-tag { font-size: .82rem; font-weight: 600; color: var(--gray-700); margin-top: .5rem; }

        /* ── SHOWCASE ARMOIRIES ────────────────────────────── */
        .crest-showcase-box {
          display: grid; grid-template-columns: 320px 1fr;
          gap: 3.5rem; align-items: center;
          background: linear-gradient(135deg, #071e38 0%, #0b3d6b 100%);
          border-radius: var(--radius);
          padding: 3.5rem; color: #fff;
          box-shadow: 0 16px 40px rgba(7,30,56,.2);
        }
        .crest-showcase-img-col {
          display: flex; justify-content: center; align-items: center;
        }
        .crest-showcase-img {
          width: 240px; height: auto; border-radius: 1.25rem;
          box-shadow: 0 12px 32px rgba(0,0,0,.5);
          border: 3px solid var(--gold);
        }
        .crest-showcase-text-col h2 { color: #fff; }
        .crest-desc { color: rgba(255,255,255,.82); font-size: 1.05rem; margin-bottom: 1.5rem; }
        .crest-symbols-list { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
        .crest-symbols-list li { display: flex; align-items: flex-start; gap: 1rem; }
        .symbol-bullet { font-size: 1.3rem; flex-shrink: 0; margin-top: .1rem; }
        .crest-symbols-list strong { color: var(--gold); font-size: 1rem; }
        .crest-symbols-list div { color: rgba(255,255,255,.85); font-size: .95rem; }

        /* CARDS GRID */
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
        .card {
          background: var(--white); border: 1px solid var(--gray-200);
          border-radius: var(--radius); padding: 1.5rem;
          display: flex; flex-direction: column; gap: .65rem;
          box-shadow: var(--shadow); transition: transform .2s;
        }
        .card:hover { transform: translateY(-4px); }
        .faculty-card { border-top: 3px solid var(--sky); }
        .program-card { border-top: 3px solid var(--gold); }
        .card-badge {
          display: inline-block; background: #e7f3fc; color: var(--blue);
          font-size: .7rem; font-weight: 800; letter-spacing: .08em;
          padding: .25rem .65rem; border-radius: 2rem; width: fit-content;
        }
        .card-badge.yellow { background: #fef9c3; color: #92400e; }
        .card h3 { font-size: 1.05rem; font-weight: 700; color: var(--navy); }
        .card p { font-size: .92rem; color: var(--gray-500); flex: 1; }
        .card-link { color: var(--sky); font-weight: 700; font-size: .9rem; text-decoration: none; margin-top: auto; }

        /* SPACES */
        .spaces-grid { display: flex; flex-direction: column; gap: 1rem; }
        .space-card {
          display: flex; align-items: center; gap: 1.25rem;
          background: var(--white); border: 1px solid var(--gray-200);
          border-radius: var(--radius); padding: 1.5rem 1.75rem;
          text-decoration: none; color: inherit; box-shadow: var(--shadow);
          transition: transform .2s, border-color .2s;
        }
        .space-card:hover { transform: translateX(6px); border-color: var(--sky); }
        .space-icon { font-size: 2rem; flex-shrink: 0; }
        .space-card div { flex: 1; }
        .space-card h3 { font-size: 1.05rem; font-weight: 700; color: var(--navy); margin-bottom: .3rem; }
        .space-card p { font-size: .9rem; color: var(--gray-500); }
        .space-arrow { font-size: 1.3rem; color: var(--sky); font-weight: 700; flex-shrink: 0; }

        /* FOOTER */
        .footer { background: var(--navy); color: rgba(255,255,255,.65); }
        .footer-inner {
          max-width: 1240px; margin: 0 auto; padding: 3.5rem 1.5rem 2rem;
          display: flex; gap: 3rem; flex-wrap: wrap; justify-content: space-between;
        }
        .footer-brand { display: flex; align-items: flex-start; gap: 1rem; }
        .footer-crest-img { width: 2.75rem; height: 2.75rem; border-radius: 50%; border: 2px solid var(--gold); }
        .footer-brand strong { color: #fff; display: block; margin-bottom: .25rem; }
        .footer-links { display: flex; gap: 3rem; flex-wrap: wrap; }
        .footer-links > div { display: flex; flex-direction: column; gap: .6rem; }
        .footer-links strong { color: #fff; font-size: .85rem; margin-bottom: .25rem; }
        .footer-links a { color: rgba(255,255,255,.55); text-decoration: none; font-size: .85rem; }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,.08); padding: 1.25rem 1.5rem; text-align: center; font-size: .82rem; }

        @media (max-width: 900px) {
          .hero-container { grid-template-columns: 1fr; }
          .gallery-card, .gallery-card.reverse { grid-template-columns: 1fr; direction: ltr; }
          .crest-showcase-box { grid-template-columns: 1fr; padding: 2rem; }
        }
        @media (max-width: 600px) {
          .hero-stats { grid-template-columns: repeat(2, 1fr); }
          .nav-links { display: none; }
          .brand-full { display: none; }
        }
      `}</style>
    </>
  );
}
