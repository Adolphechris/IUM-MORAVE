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

const apiUrl = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:4002';

export default function Home() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPortalData() {
      try {
        const [facultyResponse, programResponse, newsResponse] = await Promise.all([
          fetch(`${apiUrl}/faculties`),
          fetch(`${apiUrl}/programs`),
          fetch(`${apiUrl}/news`)
        ]);

        if (!facultyResponse.ok || !programResponse.ok || !newsResponse.ok) {
          throw new Error('Le portail ne peut pas charger les informations académiques pour le moment.');
        }

        setFaculties(await facultyResponse.json());
        setPrograms(await programResponse.json());
        setNews(await newsResponse.json());
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Erreur de chargement du portail.');
      }
    }

    loadPortalData();
  }, []);

  return (
    <main>
      <header>
        <a className="brand" href="#accueil" aria-label="Accueil IUM-MORAVE">
          IUM-MORAVE
        </a>
        <nav aria-label="Navigation principale">
          <a href="#formations">Formations</a>
          <a href="#actualites">Actualités</a>
          <a href="#espaces">Espaces</a>
        </nav>
      </header>

      <section className="hero" id="accueil">
        <p className="eyebrow">Institut Universitaire Morave</p>
        <h1>Un portail universitaire clair, sécurisé et centré sur la réussite.</h1>
        <p>
          Découvrez les formations, les services académiques et les espaces numériques
          de l&apos;IUM-MORAVE.
        </p>
        <div className="actions">
          <a className="button primary" href="#formations">Voir les formations</a>
          <a className="button secondary" href="/espace">Accéder aux espaces</a>
        </div>
      </section>

      {error ? (
        <p className="alert" role="alert">
          {error} Vérifiez que le service API académique est disponible sur {apiUrl}.
        </p>
      ) : null}

      <section id="formations" aria-labelledby="formations-title">
        <p className="eyebrow">Offre académique</p>
        <h2 id="formations-title">Facultés et formations</h2>
        <div className="grid">
          {faculties.map((faculty) => (
            <article className="card" key={faculty.id}>
              <p className="code">{faculty.code}</p>
              <h3>{faculty.name}</h3>
              <p>{faculty.description}</p>
            </article>
          ))}
        </div>
        <div className="grid program-grid">
          {programs.map((program) => (
            <article className="card program" key={program.id}>
              <p className="code">{program.code}</p>
              <h3>{program.title}</h3>
              <p>{program.level} · {program.durationMonths} mois</p>
            </article>
          ))}
        </div>
      </section>

      <section id="espaces" aria-labelledby="espaces-title">
        <p className="eyebrow">Services numériques</p>
        <h2 id="espaces-title">Vos espaces institutionnels</h2>
        <div className="grid">
          <article className="card">
            <h3>Étudiants</h3>
            <p>Consultez votre parcours, vos résultats et vos documents académiques.</p>
            <a className="space-link" href="/espace">Ouvrir mon espace</a>
          </article>
          <article className="card">
            <h3>Enseignants</h3>
            <p>Gérez la saisie des notes et les informations pédagogiques.</p>
            <a className="space-link" href="/espace">Ouvrir mon espace</a>
          </article>
          <article className="card">
            <h3>Administration</h3>
            <p>Supervisez les inscriptions, délibérations et communications officielles.</p>
            <a className="space-link" href="/espace">Ouvrir mon espace</a>
          </article>
        </div>
      </section>

      <section id="actualites" aria-labelledby="actualites-title">
        <p className="eyebrow">Vie universitaire</p>
        <h2 id="actualites-title">Actualités</h2>
        <div className="grid">
          {news.map((item) => (
            <article className="card" key={item.id}>
              <p className="code">{item.publishedAt}</p>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} Institut Universitaire Morave · Portail MVP</p>
      </footer>

      <style jsx>{`
        main {
          min-height: 100vh;
          color: #132238;
          background: #f6f8fb;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        header, section, footer {
          max-width: 1120px;
          margin: 0 auto;
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        }
        header {
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand {
          color: #0a4f82;
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: .06em;
          text-decoration: none;
        }
        nav { display: flex; gap: 1.25rem; }
        nav a { color: #25425e; text-decoration: none; font-weight: 600; }
        .hero {
          max-width: none;
          padding: 6rem max(1.5rem, calc((100% - 1072px) / 2));
          background: linear-gradient(120deg, #063d68, #0b6aa8);
          color: white;
        }
        .hero > * { max-width: 720px; }
        h1 { font-size: clamp(2.25rem, 5vw, 4.4rem); line-height: 1.05; margin: .5rem 0 1.25rem; }
        h2 { font-size: clamp(1.75rem, 3vw, 2.5rem); margin-top: .25rem; }
        h3 { margin: .35rem 0 .5rem; }
        section { padding-top: 4.5rem; }
        .eyebrow, .code { color: #0a689f; font-size: .82rem; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; }
        .hero .eyebrow { color: #bde6ff; }
        .actions { display: flex; flex-wrap: wrap; gap: .85rem; margin-top: 2rem; }
        .button { border-radius: .45rem; padding: .8rem 1rem; font-weight: 700; text-decoration: none; }
        .primary { background: #f3b930; color: #152335; }
        .secondary { border: 1px solid #d7ecf9; color: white; }
        .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
        .program-grid { margin-top: 1rem; }
        .card { background: white; border: 1px solid #dce5ed; border-radius: .7rem; box-shadow: 0 5px 18px rgba(20, 49, 78, .06); padding: 1.35rem; }
        .program { border-top: 4px solid #f3b930; }
        .space-link { color: #07588e; font-weight: 700; }
        .alert { max-width: 1072px; margin: 1.5rem auto 0; padding: 1rem 1.5rem; background: #fff1f1; border-left: 4px solid #bd3030; color: #751b1b; }
        footer { padding-top: 4rem; padding-bottom: 2rem; color: #52677c; }
        @media (max-width: 600px) {
          header { flex-direction: column; gap: .85rem; padding-top: 1rem; padding-bottom: 1rem; }
          nav { gap: .75rem; font-size: .9rem; }
        }
      `}</style>
    </main>
  );
}
