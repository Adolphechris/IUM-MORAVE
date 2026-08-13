import { useState } from 'react';

type VerifyResult = {
  verified: boolean;
  documentType?: string;
  studentName?: string;
  programTitle?: string;
  level?: string;
  mention?: string;
  issuedDate?: string;
  weightedAverage?: number;
  decision?: string;
  integrityHash?: string;
  documentSignature?: string;
  verifiedAt?: string;
};

export default function VerifyPage() {
  const [type, setType] = useState<'transcript' | 'diploma'>('transcript');
  const [code, setCode] = useState('');
  const [hash, setHash] = useState('');
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function verify(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body: Record<string, string> = { type, code };
      if (type === 'transcript') {
        body.integrityHash = hash;
      }

      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Vérification impossible.');
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Vérification impossible.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1>Vérification de document — IUM-MORAVE</h1>
      <p style={{ color: '#64748b' }}>
        Vérifiez l'authenticité d'un relevé de notes ou d'un diplôme officiel.
      </p>

      <form onSubmit={verify} style={{ display: 'grid', gap: '1rem', maxWidth: 500, marginTop: '1.5rem' }}>
        <label>
          Type de document
          <select value={type} onChange={(e) => setType(e.target.value as 'transcript' | 'diploma')}>
            <option value="transcript">Relevé de notes</option>
            <option value="diploma">Diplôme</option>
          </select>
        </label>

        <label>
          Code de vérification
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder={type === 'transcript' ? 'UUID du relevé' : 'Numéro de diplôme'}
          />
        </label>

        {type === 'transcript' && (
          <label>
            Intégrité HMAC
            <input
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              required
              placeholder="Hash d'intégrité HMAC-SHA-256"
            />
          </label>
        )}

        <button type="submit" disabled={loading}>{loading ? 'Vérification…' : 'Vérifier'}</button>
      </form>

      {error && <p role="alert" style={{ color: '#751b1b', marginTop: '1rem' }}>{error}</p>}

      {result && (
        <section style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', background: '#fff' }}>
          <h2 style={{ marginBottom: '1rem' }}>
            {result.verified ? 'Document valide' : 'Document invalide ou inconnu'}
          </h2>

          {result.verified && (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <p><strong>Institution :</strong> {result.documentType}</p>
              {result.studentName && <p><strong>Étudiant :</strong> {result.studentName}</p>}
              {result.programTitle && <p><strong>Programme :</strong> {result.programTitle}</p>}
              {result.level && <p><strong>Niveau :</strong> {result.level}</p>}
              {result.mention && <p><strong>Mention :</strong> {result.mention}</p>}
              {result.issuedDate && <p><strong>Date d'émission :</strong> {result.issuedDate}</p>}
              {result.weightedAverage !== undefined && <p><strong>Moyenne :</strong> {result.weightedAverage}/20</p>}
              {result.decision && <p><strong>Décision :</strong> {result.decision}</p>}
              {result.integrityHash && <p><strong>Intégrité HMAC :</strong> <code>{result.integrityHash}</code></p>}
              {result.documentSignature && <p><strong>Signature document :</strong> <code>{result.documentSignature}</code></p>}
              {result.verifiedAt && <p><strong>Vérifié le :</strong> {new Date(result.verifiedAt).toLocaleString('fr-FR')}</p>}
            </div>
          )}
        </section>
      )}

      <style jsx>{`
        main { font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: #0f2340; }
        h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
        label { display: grid; gap: 0.25rem; font-weight: 700; font-size: 0.9rem; }
        input, select { padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 0.35rem; font: inherit; }
        button { padding: 0.6rem 1rem; border: 0; border-radius: 0.35rem; background: #071e38; color: #fff; font-weight: 700; cursor: pointer; }
        button:disabled { opacity: 0.6; cursor: wait; }
        code { font-size: 0.8rem; word-break: break-all; }
      `}</style>
    </main>
  );
}
