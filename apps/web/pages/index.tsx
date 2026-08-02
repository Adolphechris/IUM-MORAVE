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

const campusShowcase = [
  {
    image: '/images/student-campus.jpg',
    title: 'Cadre Pédagogique Moderne',
    subtitle: 'Campus Principal IUM-MORAVE',
    desc: 'Des bâtiments modernes dotés de couloirs aérés et de structures adaptées, offrant un environnement d\'apprentissage sécurisé et inspirant.',
    badge: 'Campus',
  },
  {
    image: '/images/amphitheater-class.jpg',
    title: 'Cours Magistraux en Amphithéâtre',
    subtitle: 'Grands Amphithéâtres Académiques',
    desc: 'Nos amphithéâtres accueillent des centaines d\'étudiants pour des cours interactifs animés par un corps professoral hautement qualifié.',
    badge: 'Enseignement',
  },
  {
    image: '/images/student-laptop.jpg',
    title: 'Innovation & Campus Numérique',
    subtitle: 'Technologies & Outils de Travail',
    desc: 'L\'IUM-MORAVE intègre les technologies modernes et l\'apprentissage connecté pour préparer des diplômés prêts pour le marché du travail.',
    badge: 'Innovation',
  },
  {
    image: '/images/student-arcade.jpg',
    title: 'Épanouissement & Vie Étudiante',
    subtitle: 'Galeries & Espaces de Détente',
    desc: 'Des espaces de travail et de convivialité en plein air où les étudiants échangent, révisent et tissent des liens durables.',
    badge: 'Vie Étudiante',
  },
  {
    image: '/images/auditorium-exam.jpg',
    title: 'Grands Auditoires d\'Évaluation',
    subtitle: 'Examens Officiels LMD',
    desc: 'Des salles spacieuses garantissant l\'équité, la discipline et la transparence lors de toutes les sessions d\'évaluation académique.',
    badge: 'Rigueur LMD',
  },
  {
    image: '/images/student-library.jpg',
    title: 'Bibliothèque & Centre de Recherches',
    subtitle: 'Ressources & Documentation',
    desc: 'Un accès privilégié à des milliers d\'ouvrages, manuels scientifiques et publications pour soutenir la recherche et la rédaction des mémoires.',
    badge: 'Recherche',
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
            <a href="#diplomes">Diplômes &amp; Réussite</a>
            <a href="#armoiries">Armoiries</a>
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
                <span className="caption-tag">Campus IUM-MORAVE</span>
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

      {/* ─── GALERIE COMPLÈTE DU CAMPUS EN IMAGES ───────────────── */}
      <section className="section" id="campus">
        <div className="section-inner">
          <div className="section-header">
            <p className="eyebrow">Immersion Institutionnelle</p>
            <h2>Le Campus IUM-MORAVE en Images</h2>
            <p className="section-desc">
              Découvrez en images la richesse de nos infrastructures, la rigueur de nos salles de cours,
              l&apos;accès au numérique et le dynamisme de nos étudiants.
            </p>
          </div>

          <div className="showcase-grid">
            {campusShowcase.map((item) => (
              <article className="showcase-card" key={item.title}>
                <div className="showcase-img-box">
                  <img src={item.image} alt={item.title} className="showcase-img" />
                  <span className="showcase-badge">{item.badge}</span>
                </div>
                <div className="showcase-body">
                  <p className="showcase-subtitle">{item.subtitle}</p>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION DÉDIÉE À LA RÉUSSITE ET COLLATION DES GRADES ─ */}
      <section className="section section-grad" id="diplomes">
        <div className="section-inner">
          <div className="grad-box">
            <div className="grad-img-col">
              <div className="grad-img-frame">
                <img src="/images/graduation-ceremony.jpg" alt="Collation des Grades et Diplômés IUM-MORAVE" className="grad-img" />
                <div className="grad-badge-overlay">🏆 Promotion d&apos;Excellence LMD</div>
              </div>
            </div>

            <div className="grad-text-col">
              <p className="eyebrow eyebrow-light">Couronnement des Écoles</p>
              <h2>Collation des Grades &amp; Remise des Diplômes</h2>
              <p className="grad-lead">
                Le moment fort de la vie académique : la célébration du mérite, de la persévérance et du succès de nos étudiants.
              </p>
              <p className="grad-desc">
                Chaque année, l&apos;Institut Universitaire Morave délivre des diplômes scellés et authentifiés dans le respect strict des normes du Ministère de l&apos;Enseignement Supérieur et Universitaire (ESU). Nos diplômés rejoignent les grandes entreprises, les institutions publiques et les centres de recherche à travers le continent.
              </p>

              <div className="grad-highlights">
                <div className="grad-hl-item">
                  <span className="grad-hl-icon">📜</span>
                  <div>
                    <strong>Diplômes Officiels Homologués</strong>
                    <span>Licence, Master et Doctorat conformes au système LMD.</span>
                  </div>
                </div>
                <div className="grad-hl-item">
                  <span className="grad-hl-icon">🔐</span>
                  <div>
                    <strong>Authentification Numérique Sécurisée</strong>
                    <span>Chaque relevé et diplôme est doté d&apos;une signature cryptographique HMAC.</span>
                  </div>
                </div>
              </div>

              <a className="btn btn-primary btn-grad" href="/contact">Rejoindre la prochaine promotion →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOCUS ÉVALUATION & EXAMENS ───────────────────────── */}
      <section className="section section-alt" id="rigueur">
        <div className="section-inner">
          <div className="eval-box">
            <div className="eval-text-col">
              <p className="eyebrow">Rigueur &amp; Discipline</p>
              <h2>Évaluations &amp; Sessions d&apos;Examens Officiels</h2>
              <p className="eval-text">
                L&apos;IUM-MORAVE attache une importance capitale à l&apos;intégrité académique. Nos sessions d&apos;examens se déroulent sous une surveillance stricte et un anonymat rigoureux, garantissant l&apos;équité des résultats et le mérite absolu des étudiants.
              </p>
              <div className="eval-features">
                <div className="eval-feat">
                  <strong>100%</strong>
                  <span>Transparence des jurys de délibération</span>
                </div>
                <div className="eval-feat">
                  <strong>LMD</strong>
                  <span>Contrôle continu et travaux pratiques intégrés</span>
                </div>
              </div>
            </div>

            <div className="eval-img-col">
              <div className="eval-img-frame">
                <img src="/images/students-work.jpg" alt="Étudiants concentrés pendant l'évaluation" className="eval-img" />
                <div className="eval-img-caption">
                  <span>Séance d&apos;évaluation officielle en salle de cours.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BLASON OFFICIEL ET SYMBOLES DE L'UNIVERSITÉ ────────── */}
      <section className="section" id="armoiries">
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
      <section className="section section-alt" id="formations">
        <div className="section-inner">
          <p className="eyebrow">Offre académique</p>
          <h2>Facultés &amp; Formations LMD</h2>

          {faculties.length > 0 ? (
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
          ) : (
            <div className="cards-grid">
              {[
                { code: 'FST', name: 'Faculté des Sciences et Technologies', desc: 'Informatique, Génie Logiciel, Réseaux, Mathématiques Appliquées.' },
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
      <section className="section" id="espaces">
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
              <a href="#diplomes">Diplômes &amp; Réussite</a>
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
          padding: .55rem 1.2rem; border-radius: .5rem;
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
        .hero-orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: .25; }
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
        .hero-badge-row { display: flex; align-items: center; gap: .75rem; margin-bottom: 1.25rem; }
        .hero-crest-mini { width: 2rem; height: 2rem; border-radius: 50%; border: 1.5px solid var(--gold); }
        .hero-overtitle { color: var(--gold); font-size: .85rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
        .hero-title {
          font-size: clamp(2.5rem, 4.5vw, 4.2rem);
          font-weight: 900; line-height: 1.08; color: #fff; margin-bottom: 1.25rem; letter-spacing: -.02em;
        }
        .highlight {
          background: linear-gradient(135deg, var(--gold) 0%, #f97316 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .hero-subtitle { color: rgba(255,255,255,.82); font-size: 1.05rem; margin-bottom: 2rem; line-height: 1.7; }
        .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

        .btn {
          display: inline-block; text-decoration: none; font-weight: 700;
          border-radius: .6rem; padding: .85rem 1.75rem; font-size: .95rem;
          transition: transform .15s, box-shadow .15s;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn-primary { background: var(--gold); color: var(--navy); box-shadow: 0 6px 24px rgba(245,185,20,.35); }
        .btn-ghost { border: 1.5px solid rgba(255,255,255,.35); color: #fff; }
        .btn-ghost:hover { background: rgba(255,255,255,.08); }

        /* VISUEL HERO */
        .hero-visual-col { position: relative; }
        .hero-image-frame {
          position: relative; border-radius: 1.25rem; overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,.4); border: 3px solid rgba(255,255,255,.15);
        }
        .hero-main-img { width: 100%; height: 420px; object-fit: cover; display: block; }
        .hero-image-caption {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: linear-gradient(0deg, rgba(7,30,56,.95) 0%, rgba(7,30,56,0) 100%);
          padding: 2rem 1.5rem 1.25rem; color: #fff;
        }
        .caption-tag {
          background: var(--gold); color: var(--navy); font-size: .7rem;
          font-weight: 800; text-transform: uppercase; padding: .2rem .6rem;
          border-radius: 2rem; display: inline-block; margin-bottom: .4rem;
        }
        .hero-image-caption p { font-size: .9rem; opacity: .9; }

        /* STATS */
        .hero-stats {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px;
          background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.12);
          border-radius: var(--radius); margin: 3.5rem auto 0; max-width: 1240px; overflow: hidden;
        }
        .stat-card { background: rgba(255,255,255,.04); padding: 1.4rem 1rem; display: flex; flex-direction: column; align-items: center; gap: .25rem; }
        .stat-value { font-size: 1.9rem; font-weight: 900; color: var(--gold); }
        .stat-label { color: rgba(255,255,255,.7); font-size: .82rem; text-align: center; }

        /* ── SECTIONS & SHOWCASE GALERIE GRID ───────────────────── */
        .section { padding: 5.5rem 1.5rem; }
        .section-alt { background: var(--white); }
        .section-inner { max-width: 1240px; margin: 0 auto; }
        .section-header { text-align: center; max-width: 760px; margin: 0 auto 3.5rem; }
        .eyebrow { color: var(--sky); font-size: .8rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; margin-bottom: .4rem; }
        h2 { font-size: clamp(2rem, 3.5vw, 2.75rem); font-weight: 800; color: var(--navy); margin-bottom: .75rem; }
        .section-desc { color: var(--gray-500); font-size: 1.05rem; }

        .showcase-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.75rem;
        }
        .showcase-card {
          background: var(--white); border: 1px solid var(--gray-200);
          border-radius: var(--radius); overflow: hidden;
          box-shadow: var(--shadow); transition: transform .25s, box-shadow .25s;
          display: flex; flex-direction: column;
        }
        .showcase-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(7,30,56,.12); }
        .showcase-img-box { position: relative; height: 230px; overflow: hidden; }
        .showcase-img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
        .showcase-card:hover .showcase-img { transform: scale(1.05); }
        .showcase-badge {
          position: absolute; top: 1rem; left: 1rem;
          background: rgba(7,30,56,.85); backdrop-filter: blur(8px);
          color: var(--gold); font-size: .72rem; font-weight: 800;
          padding: .3rem .75rem; border-radius: 2rem; text-transform: uppercase;
        }
        .showcase-body { padding: 1.5rem; display: flex; flex-direction: column; gap: .5rem; flex: 1; }
        .showcase-subtitle { color: var(--sky); font-size: .78rem; font-weight: 800; text-transform: uppercase; }
        .showcase-body h3 { font-size: 1.15rem; font-weight: 800; color: var(--navy); }
        .showcase-body p { color: var(--gray-500); font-size: .92rem; line-height: 1.6; }

        /* ── SECTION DIPLÔMES ET REMISE DES GRADES ─────────────── */
        .section-grad {
          background: linear-gradient(135deg, #071e38 0%, #0b3d6b 100%);
          color: #fff; padding: 6rem 1.5rem;
        }
        .eyebrow-light { color: var(--gold); }
        .grad-box {
          display: grid; grid-template-columns: 1fr 1.1fr;
          gap: 4rem; align-items: center;
        }
        .grad-img-frame {
          position: relative; border-radius: 1.25rem; overflow: hidden;
          border: 3px solid var(--gold); box-shadow: 0 20px 50px rgba(0,0,0,.5);
        }
        .grad-img { width: 100%; height: 440px; object-fit: cover; display: block; }
        .grad-badge-overlay {
          position: absolute; bottom: 1.5rem; left: 1.5rem;
          background: rgba(245,185,20,.95); color: var(--navy);
          font-weight: 900; font-size: .9rem; padding: .5rem 1.2rem;
          border-radius: 2rem; box-shadow: 0 6px 20px rgba(0,0,0,.3);
        }
        .grad-text-col h2 { color: #fff; margin-bottom: 1rem; }
        .grad-lead { font-size: 1.15rem; font-weight: 600; color: var(--gold-l); margin-bottom: 1rem; }
        .grad-desc { color: rgba(255,255,255,.82); font-size: 1rem; margin-bottom: 2rem; line-height: 1.75; }
        .grad-highlights { display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 2.5rem; }
        .grad-hl-item { display: flex; align-items: flex-start; gap: 1rem; }
        .grad-hl-icon { font-size: 1.6rem; flex-shrink: 0; }
        .grad-hl-item strong { color: #fff; display: block; font-size: 1rem; }
        .grad-hl-item span { color: rgba(255,255,255,.75); font-size: .9rem; }
        .btn-grad { padding: 1rem 2.25rem; font-size: 1rem; }

        /* ── SECTION RIGUEUR & ÉVALUATION ───────────────────────── */
        .eval-box {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 3.5rem; align-items: center;
        }
        .eval-text { color: var(--gray-500); font-size: 1.05rem; margin-bottom: 2rem; line-height: 1.7; }
        .eval-features { display: flex; gap: 2.5rem; }
        .eval-feat { display: flex; flex-direction: column; gap: .25rem; }
        .eval-feat strong { font-size: 2.2rem; font-weight: 900; color: var(--navy); line-height: 1; }
        .eval-feat span { font-size: .85rem; color: var(--gray-500); font-weight: 600; max-width: 180px; }
        .eval-img-frame {
          position: relative; border-radius: 1.25rem; overflow: hidden;
          box-shadow: var(--shadow); border: 1px solid var(--gray-200);
        }
        .eval-img { width: 100%; height: 350px; object-fit: cover; display: block; }
        .eval-img-caption {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: rgba(7,30,56,.85); backdrop-filter: blur(8px);
          color: #fff; padding: .85rem 1.25rem; font-size: .85rem; font-weight: 600;
        }

        /* ── SHOWCASE ARMOIRIES ────────────────────────────── */
        .crest-showcase-box {
          display: grid; grid-template-columns: 320px 1fr; gap: 3.5rem; align-items: center;
          background: linear-gradient(135deg, #071e38 0%, #0b3d6b 100%);
          border-radius: var(--radius); padding: 3.5rem; color: #fff;
          box-shadow: 0 16px 40px rgba(7,30,56,.2);
        }
        .crest-showcase-img-col { display: flex; justify-content: center; align-items: center; }
        .crest-showcase-img { width: 240px; height: auto; border-radius: 1.25rem; box-shadow: 0 12px 32px rgba(0,0,0,.5); border: 3px solid var(--gold); }
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
        .card-badge { display: inline-block; background: #e7f3fc; color: var(--blue); font-size: .7rem; font-weight: 800; padding: .25rem .65rem; border-radius: 2rem; width: fit-content; }
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
          .hero-container, .grad-box, .eval-box { grid-template-columns: 1fr; gap: 2rem; }
          .crest-showcase-box { grid-template-columns: 1fr; padding: 2rem; }
          .showcase-grid { grid-template-columns: 1fr; }
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
