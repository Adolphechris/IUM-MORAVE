import Header from '../../shared/src/Header';
import Footer from '../../shared/src/Footer';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const apiUrl = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:4002';
type NewsDetail = { title: string; summary: string; content: string; category: string; publishedAt: string };
export default function NewsDetailPage() {
  const router = useRouter();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!router.query.id) return;
    fetch(`${apiUrl}/news/${router.query.id}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Actualité indisponible.');
        setNews(result);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Actualité indisponible.'));
  }, [router.query.id]);
  return (
    <main>
      <Header title="IUM-MORAVE"><a href="/#actualites">Toutes les actualités</a></Header>
      <article>
        {error ? <p role="alert">{error}</p> : null}
        {!news && !error ? <p>Chargement de l&apos;actualité…</p> : null}
        {news ? <><p className="code">{news.category} · {news.publishedAt}</p><h1>{news.title}</h1><p className="summary">{news.summary}</p><p>{news.content}</p></> : null}
      </article>
      <style jsx>{`
        main { min-height: 100vh; background: #f6f8fb; color: #132238; font-family: Inter, system-ui, sans-serif; }
        header, article { max-width: 760px; margin: 0 auto; padding: 1.5rem; } header { display: flex; justify-content: space-between; }
        a { color: #07588e; font-weight: 700; text-decoration: none; } article { background: #fff; border: 1px solid #dce5ed; border-radius: .6rem; margin-top: 3rem; }
        .code { color: #0a689f; font-size: .8rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }.summary { font-size: 1.2rem; }
      `}</style>
    <Footer />
      </main>
  );
}
