import React, { useEffect, useState } from 'react';

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

const values = [
  { icon: '🎓', title: 'Excellence Académique', desc: 'Des programmes rigoureux construits sur les standards LMD, animés par des enseignants-chercheurs de haut niveau.' },
  { icon: '🌍', title: 'Ouverture Internationale', desc: 'Des partenariats actifs avec des universités africaines et européennes pour élargir vos horizons.' },
  { icon: '💡', title: 'Innovation & Recherche', desc: 'Des laboratoires équipés et des projets de recherche appliquée au cœur de nos campus.' },
  { icon: '🤝', title: 'Accompagnement Personnalisé', desc: 'Un suivi individuel de chaque étudiant, du premier cours jusqu\'à l\'obtention du diplôme.' },
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
        // silently degrade — page still renders with static content
      }
    }
    loadPortalData();
  }, []);

  return (
    <>
      {/* ─── NAVIGATION ─────────────────────────────────────── */}
      <header className="navbar">
        <div className="navbar-inner">
          <a href="/" className="brand">
            <span className="brand-emblem">IUM</span>
            <span className="brand-text">
              <span className="brand-full">Institut Universitaire Morave</span>
              <span className="brand-short">IUM‑MORAVE</span>
            </span>
          </a>
          <button className="menu-toggle" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
          <nav className={`nav-links${menuOpen ? ' open' : ''}`}>
            <a href="#formations">Formations</a>
            <a href="#valeurs">L&apos;IUM</a>
            <a href="#actualites">Actualités</a>
            <a href="/contact">Contact</a>
            <a href="/espace" className="nav-cta">Espace numérique →</a>
          </nav>
        </div>
      </header>

      {/* ─── HERO ───────────────────────────────────────────── */}
      <section className="hero" id="accueil">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-grid" />
        </div>
        <div className="hero-content">
          <p className="hero-overtitle">Bienvenue à l&apos;Institut Universitaire Morave</p>
          <h1 className="hero-title">
            Formez les&nbsp;
            <span className="highlight">bâtisseurs</span>
            <br />de demain.
          </h1>
          <p className="hero-subtitle">
            L&apos;<strong>Institut Universitaire Morave (IUM‑MORAVE)</strong> est un établissement d&apos;enseignement
            supérieur de référence, engagé pour l&apos;excellence académique, la recherche
            et le développement du capital humain en République Démocratique du Congo et en Afrique.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#formations">Découvrir nos formations</a>
            <a className="btn btn-ghost" href="/contact">Nous contacter</a>
          </div>
        </div>
        <div className="hero-stats">
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── VALEURS ─────────────────────────────────────────── */}
      <section className="section" id="valeurs">
        <div className="section-inner">
          <p className="eyebrow">Pourquoi choisir l&apos;IUM ?</p>
          <h2>Une université au service de l&apos;excellence</h2>
          <div className="values-grid">
            {values.map((v) => (
              <div className="value-card" key={v.title}>
                <span className="value-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FACULTÉS & FORMATIONS ───────────────────────────── */}
      <section className="section section-alt" id="formations">
        <div className="section-inner">
          <p className="eyebrow">Offre académique</p>
          <h2>Facultés &amp; Formations</h2>

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
              <h3 className="sub-title">Programmes disponibles</h3>
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

          {faculties.length === 0 && programs.length === 0 && (
            <div className="placeholder-grid">
              {['Sciences & Technologies', 'Sciences Économiques & Gestion', 'Droit & Sciences Politiques', 'Médecine & Santé Publique'].map((name) => (
                <article className="card faculty-card" key={name}>
                  <span className="card-badge">FACULTÉ</span>
                  <h3>{name}</h3>
                  <p>Informations disponibles prochainement. Contactez la scolarité pour plus de détails.</p>
                  <a className="card-link" href="/contact">Demander des informations →</a>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── ESPACES NUMÉRIQUES ──────────────────────────────── */}
      <section className="section" id="espaces">
        <div className="section-inner">
          <p className="eyebrow">Services numériques</p>
          <h2>Vos espaces institutionnels</h2>
          <div className="spaces-grid">
            <a className="space-card" href="/espace">
              <span className="space-icon">🎓</span>
              <div>
                <h3>Espace Étudiant</h3>
                <p>Relevés de notes, emploi du temps, inscriptions et suivi académique LMD.</p>
              </div>
              <span className="space-arrow">→</span>
            </a>
            <a className="space-card" href="/espace">
              <span className="space-icon">📚</span>
              <div>
                <h3>Espace Enseignant</h3>
                <p>Saisie des notes, gestion des UE/ECUE et ressources pédagogiques.</p>
              </div>
              <span className="space-arrow">→</span>
            </a>
            <a className="space-card" href="/espace">
              <span className="space-icon">🏛️</span>
              <div>
                <h3>Administration &amp; Scolarité</h3>
                <p>Jurys de délibération, PV officiels, édition des diplômes et supervision.</p>
              </div>
              <span className="space-arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── ACTUALITÉS ──────────────────────────────────────── */}
      {news.length > 0 && (
        <section className="section section-alt" id="actualites">
          <div className="section-inner">
            <p className="eyebrow">Vie universitaire</p>
            <h2>Actualités de l&apos;IUM</h2>
            <div className="news-grid">
              {news.slice(0, 3).map((item) => (
                <article className="news-card" key={item.id}>
                  <p className="news-date">{item.publishedAt}</p>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <a className="card-link" href={`/actualites/${item.id}`}>Lire l&apos;article →</a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="brand-emblem sm">IUM</span>
            <div>
              <strong>Institut Universitaire Morave</strong>
              <p>IUM‑MORAVE — Ensemble pour l&apos;excellence</p>
            </div>
          </div>
          <div className="footer-links">
            <div>
              <strong>Académique</strong>
              <a href="#formations">Formations</a>
              <a href="/documents">Documents officiels</a>
            </div>
            <div>
              <strong>Institutions</strong>
              <a href="/contact">Contact</a>
              <a href="/espace">Portail numérique</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Institut Universitaire Morave — Tous droits réservés.</p>
        </div>
      </footer>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --navy:   #071e38;
          --blue:   #0b5394;
          --sky:    #1a8cd8;
          --gold:   #f5b914;
          --gold-l: #fde68a;
          --white:  #ffffff;
          --gray-50:#f8fafc;
          --gray-100:#f1f5f9;
          --gray-200:#e2e8f0;
          --gray-500:#64748b;
          --gray-700:#334155;
          --text:   #0f2340;
          --radius: .75rem;
          --shadow: 0 4px 24px rgba(7,30,56,.10);
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
          border-bottom: 1px solid rgba(255,255,255,.07);
        }
        .navbar-inner {
          max-width: 1200px; margin: 0 auto;
          padding: .9rem 1.5rem;
          display: flex; align-items: center; justify-content: space-between;
          gap: 1rem;
        }
        .brand {
          display: flex; align-items: center; gap: .75rem;
          text-decoration: none; flex-shrink: 0;
        }
        .brand-emblem {
          background: var(--gold);
          color: var(--navy);
          font-weight: 900; font-size: .75rem;
          letter-spacing: .08em;
          width: 2.5rem; height: 2.5rem;
          border-radius: .4rem;
          display: flex; align-items: center; justify-content: center;
        }
        .brand-emblem.sm { width: 2rem; height: 2rem; font-size: .65rem; }
        .brand-text { display: flex; flex-direction: column; }
        .brand-full { color: #fff; font-weight: 700; font-size: .95rem; line-height: 1.2; }
        .brand-short { color: var(--gold); font-size: .7rem; font-weight: 600; letter-spacing: .06em; }
        .nav-links { display: flex; align-items: center; gap: 1.75rem; }
        .nav-links a { color: rgba(255,255,255,.8); text-decoration: none; font-size: .9rem; font-weight: 500; transition: color .2s; }
        .nav-links a:hover { color: #fff; }
        .nav-cta {
          background: var(--gold) !important;
          color: var(--navy) !important;
          font-weight: 700 !important;
          padding: .5rem 1.1rem;
          border-radius: .4rem;
          font-size: .88rem !important;
          transition: opacity .2s !important;
        }
        .nav-cta:hover { opacity: .88 !important; }
        .menu-toggle { display: none; }

        /* ── HERO ───────────────────────────────────────────── */
        .hero {
          position: relative; overflow: hidden;
          background: linear-gradient(145deg, #071e38 0%, #0b3d6b 50%, #0b5394 100%);
          padding: 7rem 1.5rem 5rem;
          min-height: 90vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
        }
        .hero-bg { position: absolute; inset: 0; pointer-events: none; }
        .hero-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: .25;
        }
        .orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, #1a8cd8, transparent);
          top: -120px; left: -100px;
        }
        .orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, var(--gold), transparent);
          bottom: -80px; right: -80px;
          opacity: .15;
        }
        .hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .hero-content { position: relative; z-index: 1; max-width: 800px; }
        .hero-overtitle {
          display: inline-block;
          background: rgba(245,185,20,.15);
          border: 1px solid rgba(245,185,20,.35);
          color: var(--gold);
          font-size: .82rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          padding: .35rem 1rem; border-radius: 2rem;
          margin-bottom: 1.5rem;
        }
        .hero-title {
          font-size: clamp(2.8rem, 6vw, 5rem);
          font-weight: 900; line-height: 1.05;
          color: #fff;
          margin-bottom: 1.5rem;
          letter-spacing: -.02em;
        }
        .highlight {
          background: linear-gradient(135deg, var(--gold) 0%, #f97316 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          color: rgba(255,255,255,.78);
          font-size: clamp(1rem, 2vw, 1.15rem);
          max-width: 640px; margin: 0 auto 2.5rem;
          line-height: 1.75;
        }
        .hero-subtitle strong { color: #fff; }
        .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .btn {
          display: inline-block; text-decoration: none;
          font-weight: 700; border-radius: .5rem;
          padding: .85rem 2rem; font-size: 1rem;
          transition: transform .15s, box-shadow .15s, opacity .15s;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn-primary {
          background: var(--gold); color: var(--navy);
          box-shadow: 0 6px 24px rgba(245,185,20,.35);
        }
        .btn-primary:hover { box-shadow: 0 10px 32px rgba(245,185,20,.5); }
        .btn-ghost {
          border: 1.5px solid rgba(255,255,255,.35); color: #fff;
        }
        .btn-ghost:hover { background: rgba(255,255,255,.07); }

        /* ── STATS ──────────────────────────────────────────── */
        .hero-stats {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: var(--radius);
          margin-top: 4rem;
          width: 100%; max-width: 900px;
          overflow: hidden;
        }
        .stat-card {
          background: rgba(255,255,255,.04);
          padding: 1.5rem 1rem;
          display: flex; flex-direction: column; align-items: center;
          gap: .3rem;
          transition: background .2s;
        }
        .stat-card:hover { background: rgba(255,255,255,.08); }
        .stat-value {
          font-size: 2rem; font-weight: 900; color: var(--gold);
          line-height: 1;
        }
        .stat-label { color: rgba(255,255,255,.65); font-size: .82rem; text-align: center; }

        /* ── SECTIONS ───────────────────────────────────────── */
        .section { padding: 5rem 1.5rem; }
        .section-alt { background: var(--white); }
        .section-inner { max-width: 1200px; margin: 0 auto; }
        .eyebrow {
          color: var(--sky); font-size: .78rem; font-weight: 800;
          letter-spacing: .12em; text-transform: uppercase;
          margin-bottom: .5rem;
        }
        h2 {
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 800; color: var(--navy);
          margin-bottom: 2.5rem; line-height: 1.15;
        }
        .sub-title {
          font-size: 1.35rem; font-weight: 700;
          color: var(--navy); margin: 2.5rem 0 1.5rem;
        }

        /* ── CARDS ──────────────────────────────────────────── */
        .cards-grid, .placeholder-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        .card {
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          padding: 1.5rem;
          display: flex; flex-direction: column; gap: .65rem;
          box-shadow: var(--shadow);
          transition: transform .2s, box-shadow .2s;
        }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(7,30,56,.14); }
        .faculty-card { border-top: 3px solid var(--sky); }
        .program-card { border-top: 3px solid var(--gold); }
        .card-badge {
          display: inline-block;
          background: #e7f3fc; color: var(--blue);
          font-size: .7rem; font-weight: 800;
          letter-spacing: .08em; text-transform: uppercase;
          padding: .25rem .65rem; border-radius: 2rem;
          width: fit-content;
        }
        .card-badge.yellow { background: #fef9c3; color: #92400e; }
        .card h3 { font-size: 1.05rem; font-weight: 700; color: var(--navy); }
        .card p { font-size: .92rem; color: var(--gray-500); flex: 1; }
        .card-link {
          color: var(--sky); font-weight: 700; font-size: .9rem;
          text-decoration: none; margin-top: auto;
          transition: color .2s;
        }
        .card-link:hover { color: var(--blue); }
        .program-meta { font-size: .82rem; color: var(--gray-500); font-weight: 600; }
        .tracks-list { list-style: none; display: flex; flex-direction: column; gap: .5rem; }
        .tracks-list li {
          display: flex; flex-direction: column; gap: .15rem;
          padding-left: .75rem;
          border-left: 3px solid var(--gold-l);
        }
        .tracks-list strong { font-size: .88rem; color: var(--navy); }
        .tracks-list span { font-size: .82rem; color: var(--gray-500); }

        /* ── VALUES ─────────────────────────────────────────── */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        .value-card {
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          padding: 2rem 1.5rem;
          display: flex; flex-direction: column; gap: .75rem;
          transition: transform .2s, border-color .2s;
        }
        .value-card:hover { transform: translateY(-3px); border-color: var(--sky); }
        .value-icon { font-size: 2.2rem; }
        .value-card h3 { font-size: 1rem; font-weight: 700; color: var(--navy); }
        .value-card p { font-size: .9rem; color: var(--gray-500); line-height: 1.65; }

        /* ── SPACES ─────────────────────────────────────────── */
        .spaces-grid { display: flex; flex-direction: column; gap: 1rem; }
        .space-card {
          display: flex; align-items: center; gap: 1.25rem;
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          padding: 1.5rem 1.75rem;
          text-decoration: none; color: inherit;
          box-shadow: var(--shadow);
          transition: transform .2s, border-color .2s, box-shadow .2s;
        }
        .space-card:hover {
          transform: translateX(6px);
          border-color: var(--sky);
          box-shadow: 0 8px 30px rgba(7,30,56,.12);
        }
        .space-icon { font-size: 2rem; flex-shrink: 0; }
        .space-card div { flex: 1; }
        .space-card h3 { font-size: 1.05rem; font-weight: 700; color: var(--navy); margin-bottom: .3rem; }
        .space-card p { font-size: .9rem; color: var(--gray-500); }
        .space-arrow { font-size: 1.3rem; color: var(--sky); font-weight: 700; flex-shrink: 0; }

        /* ── NEWS ───────────────────────────────────────────── */
        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        .news-card {
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          padding: 1.5rem;
          display: flex; flex-direction: column; gap: .65rem;
          box-shadow: var(--shadow);
          transition: transform .2s;
        }
        .news-card:hover { transform: translateY(-3px); }
        .news-date { font-size: .78rem; color: var(--sky); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
        .news-card h3 { font-size: 1.05rem; font-weight: 700; color: var(--navy); }
        .news-card p { font-size: .9rem; color: var(--gray-500); flex: 1; }

        /* ── FOOTER ─────────────────────────────────────────── */
        .footer {
          background: var(--navy);
          color: rgba(255,255,255,.65);
        }
        .footer-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 3.5rem 1.5rem 2rem;
          display: flex; gap: 3rem; flex-wrap: wrap;
          justify-content: space-between;
        }
        .footer-brand { display: flex; align-items: flex-start; gap: .75rem; }
        .footer-brand strong { color: #fff; display: block; margin-bottom: .25rem; }
        .footer-brand p { font-size: .85rem; }
        .footer-links { display: flex; gap: 3rem; flex-wrap: wrap; }
        .footer-links > div { display: flex; flex-direction: column; gap: .6rem; }
        .footer-links strong { color: #fff; font-size: .85rem; margin-bottom: .25rem; }
        .footer-links a { color: rgba(255,255,255,.55); text-decoration: none; font-size: .85rem; transition: color .2s; }
        .footer-links a:hover { color: #fff; }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,.08);
          padding: 1.25rem 1.5rem;
          text-align: center; font-size: .82rem;
        }

        /* ── RESPONSIVE ─────────────────────────────────────── */
        @media (max-width: 768px) {
          .menu-toggle {
            display: flex; flex-direction: column; gap: 5px;
            background: none; border: none; cursor: pointer;
            padding: .4rem;
          }
          .menu-toggle span {
            display: block; width: 22px; height: 2px;
            background: #fff; border-radius: 2px;
          }
          .nav-links {
            display: none; position: absolute; top: 100%; left: 0; right: 0;
            background: var(--navy);
            flex-direction: column; align-items: flex-start;
            padding: 1rem 1.5rem; gap: 1rem;
            border-top: 1px solid rgba(255,255,255,.1);
          }
          .nav-links.open { display: flex; }
          .hero-stats { grid-template-columns: repeat(2, 1fr); }
          .hero-title { font-size: 2.5rem; }
          .brand-full { display: none; }
          .footer-inner { flex-direction: column; gap: 2rem; }
        }

        @media (max-width: 480px) {
          .hero-stats { grid-template-columns: 1fr 1fr; }
          .hero-actions { flex-direction: column; align-items: center; }
          .btn { width: 100%; text-align: center; }
        }
      `}</style>
    </>
  );
}
