import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

type VerifyResult = {
  verified: boolean;
  documentType?: string;
  studentName?: string;
  birthInfo?: string;
  faculty?: string;
  programTitle?: string;
  level?: string;
  academicYear?: string;
  mention?: string;
  issuedDate?: string;
  weightedAverage?: number;
  pourcentage?: string;
  totalPoints?: string;
  credits?: string;
  decision?: string;
  memoire?: string;
  verificationCode?: string;
  verifiedAt?: string;
  error?: string;
};

export default function VerifyPage() {
  const router = useRouter();
  const [type, setType] = useState<'transcript' | 'diploma'>('transcript');
  const [code, setCode] = useState('');
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-verify when URL contains code query parameter (QR Code Scan)
  useEffect(() => {
    if (router.isReady && router.query.code) {
      const queryCode = String(router.query.code);
      setCode(queryCode);
      performVerification(queryCode, type);
    }
  }, [router.isReady, router.query]);

  async function performVerification(searchCode: string, docType: string) {
    if (!searchCode.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/verify?code=${encodeURIComponent(searchCode)}&type=${docType}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
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

  function handleManualSubmit(event: React.FormEvent) {
    event.preventDefault();
    performVerification(code, type);
  }

  return (
    <>
      <Head>
        <title>Vérification Officielle des Documents — IUM-MORAVE</title>
      </Head>

      <main className="verify-container">
        <div className="verify-card">
          <div className="hdr-badge">
            <img src="/images/blason-transparent.png" alt="IUM Morave Logo" className="logo" />
            <div>
              <h1 className="main-title">INSTITUT UNIVERSITAIRE MORAVE WILLSAMAL</h1>
              <p className="sub-title">Service Central de Vérification Numérique des Diplômes & Relevés</p>
              <p className="ministry">Agrément Ministériel N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018</p>
            </div>
          </div>

          <form onSubmit={handleManualSubmit} className="verify-form">
            <div className="form-group">
              <label>Type de document</label>
              <select value={type} onChange={(e) => setType(e.target.value as 'transcript' | 'diploma')}>
                <option value="transcript">Relevé des Cotes Officiel</option>
                <option value="diploma">Diplôme d'État / Universitaire</option>
              </select>
            </div>

            <div className="form-group">
              <label>Code de référence ou d'enregistrement</label>
              <div className="input-btn-row">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder="Ex: IUM-2023-M1-ISI-088/2023"
                  className="code-input"
                />
                <button type="submit" disabled={loading} className="verify-btn">
                  {loading ? 'Vérification…' : '🔍 Vérifier'}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="error-box">
              ❌ {error}
            </div>
          )}

          {result && (
            <section className={`result-box ${result.verified ? 'success' : 'failed'}`}>
              <div className="cert-header">
                <div className="status-badge">
                  {result.verified ? '✅ DOCUMENT OFFICIEL CERTIFIÉ & AUTHENTIQUE' : '❌ NON RECONNU'}
                </div>
                <div className="cert-date">
                  Vérifié le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
                </div>
              </div>

              {result.verified && (
                <div className="cert-grid">
                  <div className="grid-row">
                    <span className="grid-label">Document :</span>
                    <span className="grid-value highlight">{result.documentType}</span>
                  </div>
                  <div className="grid-row">
                    <span className="grid-label">Titulaire :</span>
                    <span className="grid-value name">{result.studentName}</span>
                  </div>
                  {result.birthInfo && (
                    <div className="grid-row">
                      <span className="grid-label">État civil :</span>
                      <span className="grid-value">{result.birthInfo}</span>
                    </div>
                  )}
                  {result.faculty && (
                    <div className="grid-row">
                      <span className="grid-label">Faculté :</span>
                      <span className="grid-value">{result.faculty}</span>
                    </div>
                  )}
                  {result.programTitle && (
                    <div className="grid-row">
                      <span className="grid-label">Programme / Option :</span>
                      <span className="grid-value">{result.programTitle}</span>
                    </div>
                  )}
                  {result.academicYear && (
                    <div className="grid-row">
                      <span className="grid-label">Année Académique :</span>
                      <span className="grid-value">{result.academicYear}</span>
                    </div>
                  )}
                  {result.pourcentage && (
                    <div className="grid-row">
                      <span className="grid-label">Pourcentage Pondéré :</span>
                      <span className="grid-value score">{result.pourcentage} ({result.weightedAverage}/20)</span>
                    </div>
                  )}
                  {result.credits && (
                    <div className="grid-row">
                      <span className="grid-label">Crédits Capitalisés :</span>
                      <span className="grid-value">{result.credits}</span>
                    </div>
                  )}
                  {result.mention && (
                    <div className="grid-row">
                      <span className="grid-label">Mention Obtenue :</span>
                      <span className="grid-value mention">{result.mention}</span>
                    </div>
                  )}
                  {result.memoire && (
                    <div className="grid-row memoire-row">
                      <span className="grid-label">Travail de Fin d'Études :</span>
                      <span className="grid-value">{result.memoire}</span>
                    </div>
                  )}
                  {result.issuedDate && (
                    <div className="grid-row">
                      <span className="grid-label">Date de Délivrance :</span>
                      <span className="grid-value">{result.issuedDate}</span>
                    </div>
                  )}
                  <div className="grid-row ref-row">
                    <span className="grid-label">Code d'Enregistrement :</span>
                    <span className="grid-value code"><code>{result.verificationCode}</code></span>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        <style jsx>{`
          .verify-container {
            min-height: 100vh;
            background: #0f172a;
            color: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2rem 1rem;
            font-family: 'Times New Roman', Times, Georgia, serif;
          }
          .verify-card {
            width: 100%;
            max-width: 720px;
            background: #ffffff;
            color: #0f172a;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
          }
          .hdr-badge {
            display: flex;
            align-items: center;
            gap: 1.25rem;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 1.25rem;
            margin-bottom: 1.5rem;
          }
          .logo {
            width: 72px;
            height: auto;
          }
          .main-title {
            font-size: 1.15rem;
            font-weight: 800;
            margin: 0;
            color: #0f172a;
            letter-spacing: 0.02em;
          }
          .sub-title {
            font-size: 0.9rem;
            color: #0284c7;
            margin: 2px 0 0 0;
            font-weight: 700;
            font-family: sans-serif;
          }
          .ministry {
            font-size: 0.75rem;
            color: #64748b;
            margin: 2px 0 0 0;
            font-family: sans-serif;
          }
          .verify-form {
            display: grid;
            gap: 1rem;
            margin-bottom: 1.5rem;
            font-family: sans-serif;
          }
          .form-group label {
            display: block;
            font-size: 0.85rem;
            font-weight: 700;
            margin-bottom: 0.35rem;
            color: #334155;
          }
          select, .code-input {
            width: 100%;
            padding: 0.65rem 0.85rem;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            font-size: 0.95rem;
            box-sizing: border-box;
          }
          .input-btn-row {
            display: flex;
            gap: 0.5rem;
          }
          .verify-btn {
            background: #16a34a;
            color: #fff;
            border: none;
            padding: 0 1.25rem;
            border-radius: 6px;
            font-weight: 700;
            cursor: pointer;
            white-space: nowrap;
          }
          .verify-btn:disabled {
            opacity: 0.6;
          }
          .error-box {
            background: #fef2f2;
            border: 1px solid #fca5a5;
            color: #991b1b;
            padding: 0.85rem;
            border-radius: 6px;
            font-size: 0.9rem;
            font-family: sans-serif;
          }
          .result-box {
            border: 2px solid #16a34a;
            border-radius: 8px;
            background: #f0fdf4;
            padding: 1.25rem;
          }
          .cert-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #bbf7d0;
            padding-bottom: 0.75rem;
            margin-bottom: 1rem;
            font-family: sans-serif;
          }
          .status-badge {
            color: #15803d;
            font-weight: 800;
            font-size: 0.95rem;
          }
          .cert-date {
            font-size: 0.75rem;
            color: #166534;
          }
          .cert-grid {
            display: grid;
            gap: 0.6rem;
            font-size: 0.95rem;
          }
          .grid-row {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px dashed #dcfce7;
            padding-bottom: 0.35rem;
          }
          .grid-label {
            color: #374151;
            font-weight: 600;
          }
          .grid-value {
            font-weight: 700;
            color: #0f172a;
            text-align: right;
          }
          .grid-value.name {
            font-size: 1.05rem;
            color: #0369a1;
          }
          .grid-value.score {
            color: #15803d;
          }
          .grid-value.mention {
            color: #b45309;
            letter-spacing: 0.05em;
          }
          .memoire-row {
            background: #dcfce7;
            padding: 0.4rem;
            border-radius: 4px;
          }
          .ref-row {
            border-bottom: none;
            margin-top: 0.5rem;
            font-family: sans-serif;
          }
          code {
            background: #e2e8f0;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.85rem;
          }
        `}</style>
      </main>
    </>
  );
}
