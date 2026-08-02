import Header from '@ium-morave/shared/src/Header';
import Footer from '@ium-morave/shared/src/Footer';
import React, { FormEvent, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:4002';
export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          subject: form.get('subject'),
          message: form.get('message'),
          website: form.get('website')
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Votre message ne peut pas être envoyé.');
      event.currentTarget.reset();
      setStatus('Votre message a été reçu. L’administration vous répondra dès que possible.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Votre message ne peut pas être envoyé.');
    } finally {
      setLoading(false);
    }
  }
  return (
    <main>
      <Header title="IUM-MORAVE"><a href="/">Retour au portail</a></Header>
      <section>
        <p className="eyebrow">Nous contacter</p>
        <h1>Contact institutionnel</h1>
        <p>Adressez vos questions à l&apos;IUM-MORAVE. Les champs marqués sont nécessaires au traitement de votre demande.</p>
        <form onSubmit={submit}>
          <label htmlFor="name">Nom complet</label>
          <input id="name" name="name" required autoComplete="name" />
          <label htmlFor="email">Adresse email</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
          <label htmlFor="subject">Objet</label>
          <input id="subject" name="subject" required />
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" minLength={10} maxLength={4000} required />
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="website">Site internet</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Envoi…' : 'Envoyer le message'}</button>
        </form>
        {status ? <p className="success" role="status">{status}</p> : null}
        {error ? <p className="error" role="alert">{error}</p> : null}
      </section>
      <style jsx>{`
        main { min-height: 100vh; background: #f6f8fb; color: #132238; font-family: Inter, system-ui, sans-serif; }
        header, section { max-width: 760px; margin: 0 auto; padding: 1.5rem; }
        header { display: flex; justify-content: space-between; }
        a { color: #07588e; font-weight: 700; text-decoration: none; }
        section { padding-top: 3rem; }
        .eyebrow { color: #0a689f; font-size: .8rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
        form { background: #fff; border: 1px solid #dce5ed; border-radius: .7rem; display: grid; gap: .75rem; margin-top: 1.5rem; padding: 1.5rem; }
        label { font-weight: 700; }
        input, textarea { border: 1px solid #9fb0bf; border-radius: .35rem; font: inherit; padding: .75rem; }
        textarea { min-height: 150px; resize: vertical; }
        button { border: 0; border-radius: .35rem; background: #07588e; color: #fff; cursor: pointer; font: inherit; font-weight: 700; padding: .75rem 1rem; width: fit-content; }
        .honeypot { height: 0; overflow: hidden; position: absolute; width: 0; }
        .success { color: #15623c; font-weight: 700; }
        .error { color: #8e2020; font-weight: 700; }
      `}</style>
    <Footer />
      </main>
  );
}
