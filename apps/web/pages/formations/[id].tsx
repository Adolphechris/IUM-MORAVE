import Header from '../../shared/src/Header';
import Header from '../../shared/src/Header';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const apiUrl = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:4002';

type ProgramDetail = {
  code: string;
  title: string;
  level: string;
  durationMonths: number;
  faculty: { name: string };
  tracks: Array<{ id: number; title: string; description: string }>;
  courses: Array<{ id: number; code: string; title: string; credits: number; semester: number }>;
};

export default function ProgramDetailPage() {
  const router = useRouter();
  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.query.id) return;
    fetch(`${apiUrl}/programs/${router.query.id}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Formation indisponible.');
        setProgram(result);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Formation indisponible.'));
  }, [router.query.id]);

  return (
    <main>
      <Header title="IUM-MORAVE"><a href="/#formations">Toutes les formations</a></Header>
      <section>
        {error ? <p role="alert">{error}</p> : null}
        {!program && !error ? <p>Chargement de la formation…</p> : null}
        {program ? <>
          <p className="code">{program.code} · {program.level}</p>
          <h1>{program.title}</h1>
          <p>{program.faculty.name} · {program.durationMonths} mois</p>
          <h2>Spécialités</h2>
          <div className="grid">{program.tracks.map((track) => <article key={track.id}><h3>{track.title}</h3><p>{track.description}</p></article>)}</div>
          <h2>Unités d&apos;enseignement</h2>
          <div className="grid">{program.courses.map((course) => <article key={course.id}><p className="code">{course.code}</p><h3>{course.title}</h3><p>Semestre {course.semester} · {course.credits} crédits</p></article>)}</div>
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
    </main>
  );
}
