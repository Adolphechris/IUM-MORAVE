import Header from '../../shared/src/Header';
import Footer from '../../shared/src/Footer';
import React, { FormEvent, useEffect, useState } from 'react';

type DocumentItem = {
  id: number;
  title: string;
  filePath: string;
  mime: string;
};

const apiUrl = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:4002';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function loadDocuments(search = '') {
    try {
      const response = await fetch(`${apiUrl}/documents?query=${encodeURIComponent(search)}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Documents indisponibles.');
      setDocuments(result);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Documents indisponibles.');
    }
  }

  useEffect(() => { loadDocuments(); }, []);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loadDocuments(query);
  }

  return (
    <main>
      <Header title="IUM-MORAVE"><a href="/">Retour au portail</a></Header>
      <section>
        <p className="eyebrow">Ressources</p>
        <h1>Documents institutionnels</h1>
        <form onSubmit={search}>
          <label htmlFor="search">Rechercher un document</label>
          <input id="search" value={query} onChange={(event) => setQuery(event.target.value)} />
          <button type="submit">Rechercher</button>
        </form>
        {error ? <p className="error" role="alert">{error}</p> : null}
        <ul>
          {documents.map((document) => (
            <li key={document.id}>
              <strong>{document.title}</strong>
              <span>{document.mime}</span>
              <a href={document.filePath}>Télécharger</a>
            </li>
          ))}
        </ul>
      </section>
      <style jsx>{`
        main { min-height: 100vh; background: #f6f8fb; color: #132238; font-family: Inter, system-ui, sans-serif; }
        header, section { max-width: 760px; margin: 0 auto; padding: 1.5rem; }
        header { display: flex; justify-content: space-between; }
        a { color: #07588e; font-weight: 700; text-decoration: none; }
        section { padding-top: 3rem; }
        .eyebrow { color: #0a689f; font-size: .8rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
        form { display: flex; flex-wrap: wrap; gap: .75rem; margin: 1.5rem 0; }
        label { flex-basis: 100%; font-weight: 700; }
        input { border: 1px solid #9fb0bf; border-radius: .35rem; font: inherit; padding: .65rem; }
        button { border: 0; border-radius: .35rem; background: #07588e; color: #fff; cursor: pointer; font: inherit; font-weight: 700; padding: .65rem .9rem; }
        ul { display: grid; gap: .75rem; list-style: none; padding: 0; }
        li { background: #fff; border: 1px solid #dce5ed; border-radius: .5rem; display: grid; gap: .35rem; padding: 1rem; }
        li span { color: #52677c; font-size: .85rem; }
        .error { color: #8e2020; font-weight: 700; }
      `}</style>
    <Footer />
      </main>
  );
}
