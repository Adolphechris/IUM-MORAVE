import Header from '@ium-morave/shared/src/Header';
import Footer from '@ium-morave/shared/src/Footer';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const apiUrl = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:4002';

type FacultyDetail = {
  code: string;
  name: string;
  description: string;
  programs: Array<{ id: number; code: string; title: string; level: string }>;
  tracks: Array<{ id: number; programId: number; title: string; description: string }>;
};

export default function FacultyDetailPage() {
  const router = useRouter();
  const [faculty, setFaculty] = useState<FacultyDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.query.id) return;
    fetch(`${apiUrl}/faculties/${router.query.id}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Faculté indisponible.');
        setFaculty(result);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Faculté indisponible.'));
  }, [router.query.id]);

  return (
    <main>
      <Header title="IUM-MORAVE"><a href="/#formations">Toutes les formations</a></Header>
      <section>
        {error ? <p role="alert">{error}</p> : null}
        {!faculty && !error ? <p>Chargement de la faculté…</p> : null}
        {faculty ? <>
          <p className="code">{faculty.code}</p>
          <h1>{faculty.name}</h1>
          <p>{faculty.description}</p>
          <h2>Programmes</h2>
          <div className="grid">
            {faculty.programs.map((program) => (
              <article key={program.id}><p className="code">{program.code}</p><h3>{program.title}</h3><p>{program.level}</p><a href={`/formations/${program.id}`}>Voir la formation</a></article>
            ))}
          </div>
          <h2>Spécialités</h2>
          <div className="grid">
            {faculty.tracks.map((track) => <article key={track.id}><h3>{track.title}</h3><p>{track.description}</p></article>)}
          </div>
        </> : null}
      </section>
      <style jsx>{`
        main { min-height: 100vh; background: #f6f8fb; color: #132238; font-family: Inter, system-ui, sans-serif; }
        header, section { max-width: 950px; margin: 0 auto; padding: 1.5rem; } header { display: flex; justify-content: space-between; }
        a { color: #07588e; font-weight: 700; text-decoration: none; } section { padding-top: 3rem; }
        .code { color: #0a689f; font-size: .8rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
        .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
        article { background: #fff; border: 1px solid #dce5ed; border-radius: .6rem; padding: 1rem; }
      `}</style>
    <Footer />
      </main>
  );
}
