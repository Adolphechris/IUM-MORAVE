import React, { useState, FormEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';

type UserSession = {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
};

type AdminData = {
  totals: Record<string, number>;
  recentAuditEvents: Array<{ action: string; resource: string; createdAt: string }>;
  upcomingEvents: Array<{ id: number; title: string; startsAt: string }>;
  enrollments: Array<{ id: number; studentEmail: string; studentName: string; matricule: string; academicYear: string; programTitle: string; status: string }>;
  deliberations: Array<{ id: number; enrollmentId: number; studentName: string; matricule: string; decision: string; weightedAverage: number; finalizedAt: string }>;
  diplomas: Array<{ diplomaNumber: string; studentName: string; programTitle: string; level: string; mention: string; issuedDate: string }>;
};

export default function AdminPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'enrollments' | 'deliberations' | 'diplomas'>('overview');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Connexion impossible.');

      if (data.user.role !== 'admin') {
        throw new Error('Accès réservé exclusivement aux administrateurs.');
      }

      setSession(data);
      loadAdminData(data.token);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  }

  async function loadAdminData(token: string) {
    try {
      const res = await fetch('/api/admin/data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Chargement des données impossible.');
      setAdminData(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  function handleLogout() {
    setSession(null);
    setAdminData(null);
    setEmail('');
    setPassword('');
  }

  return (
    <>
      <Head>
        <title>Tableau de Bord Administration | IUM-MORAVE</title>
        <meta name="description" content="Espace d'administration officielle de l'Institut Universitaire Morave." />
      </Head>

      <div style={{ fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
        {/* Navigation Bar */}
        <header style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#1e293b', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 800, fontSize: '1.25rem' }}>
              🏛️ IUM-MORAVE
            </Link>
            <span style={{ backgroundColor: '#0284c7', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
              ADMINISTRATION
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>
              ← Retour au site public
            </Link>
            {session && (
              <button
                onClick={handleLogout}
                style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Déconnexion
              </button>
            )}
          </div>
        </header>

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
          {!session ? (
            /* Ecran de connexion Admin */
            <div style={{ maxWidth: '420px', margin: '4rem auto 0', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.5rem 0' }}>Portail d'Administration</h1>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>Veuillez vous identifier pour accéder au système.</p>
              </div>

              {error && (
                <div style={{ backgroundColor: '#450a0a', border: '1px solid #991b1b', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label htmlFor="email" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Adresse Email Institutionnelle
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="admin@ium-morave.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f8fafc', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label htmlFor="password" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f8fafc', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', padding: '0.875rem', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'wait' : 'pointer', transition: 'background-color 0.2s' }}
                >
                  {loading ? 'Connexion en cours...' : 'Se connecter au système'}
                </button>
              </form>

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #334155', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
                🔑 Compte administrateur initial : <strong>admin@ium-morave.edu</strong>
              </div>
            </div>
          ) : (
            /* Tableau de Bord connecté */
            <div>
              {/* En-tête session */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155' }}>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>
                    Bonjour, {session.user.firstName} {session.user.lastName} 👋
                  </h1>
                  <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
                    Session active : <strong>{session.user.email}</strong> (Rôle : {session.user.role})
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(['overview', 'enrollments', 'deliberations', 'diplomas'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: '0.6rem 1.2rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        fontWeight: 700,
                        cursor: 'pointer',
                        backgroundColor: activeTab === tab ? '#0284c7' : '#334155',
                        color: '#ffffff'
                      }}
                    >
                      {tab === 'overview' && '📊 Vue d\'ensemble'}
                      {tab === 'enrollments' && '🎓 Inscriptions'}
                      {tab === 'deliberations' && '⚖️ Délibérations'}
                      {tab === 'diplomas' && '📜 Diplômes LMD'}
                    </button>
                  ))}
                </div>
              </div>

              {adminData && (
                <>
                  {activeTab === 'overview' && (
                    <div>
                      {/* Métriques */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                        {Object.entries(adminData.totals).map(([key, val]) => (
                          <div key={key} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                              {key === 'students' && 'Étudiants inscrits'}
                              {key === 'teachers' && 'Enseignants & Profs'}
                              {key === 'programs' && 'Filières & Formations'}
                              {key === 'deliberations' && 'Sessions Délibération'}
                              {key === 'diplomasIssued' && 'Diplômes Délivrés'}
                            </span>
                            <span style={{ fontSize: '2rem', fontWeight: 900, color: '#38bdf8' }}>{val}</span>
                          </div>
                        ))}
                      </div>

                      {/* Événements récents */}
                      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>📋 Journal d'activités système récents</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {adminData.recentAuditEvents.map((evt, idx) => (
                            <li key={idx} style={{ backgroundColor: '#0f172a', padding: '0.875rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
                              <span><strong>{evt.action}</strong> : {evt.resource}</span>
                              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{new Date(evt.createdAt).toLocaleDateString('fr-FR')}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'enrollments' && (
                    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
                      <h3 style={{ margin: '0 0 1rem 0' }}>🎓 Liste des Inscriptions académiques</h3>
                      <table style={{ width: '100%', borderCollapse: 'collapse', color: '#f8fafc', fontSize: '0.9rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #334155', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem' }}>Matricule</th>
                            <th style={{ padding: '0.75rem' }}>Nom de l'étudiant</th>
                            <th style={{ padding: '0.75rem' }}>Programme</th>
                            <th style={{ padding: '0.75rem' }}>Année</th>
                            <th style={{ padding: '0.75rem' }}>Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminData.enrollments.map((en) => (
                            <tr key={en.id} style={{ borderBottom: '1px solid #0f172a' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>{en.matricule}</td>
                              <td style={{ padding: '0.75rem' }}>{en.studentName}</td>
                              <td style={{ padding: '0.75rem' }}>{en.programTitle}</td>
                              <td style={{ padding: '0.75rem' }}>{en.academicYear}</td>
                              <td style={{ padding: '0.75rem' }}>
                                <span style={{ backgroundColor: en.status === 'Inscrit' ? '#166534' : '#854d0e', color: '#ffffff', padding: '0.2rem 0.6rem', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: 700 }}>
                                  {en.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === 'deliberations' && (
                    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
                      <h3 style={{ margin: '0 0 1rem 0' }}>⚖️ Procès-Verbaux de Délibération LMD</h3>
                      <table style={{ width: '100%', borderCollapse: 'collapse', color: '#f8fafc', fontSize: '0.9rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #334155', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem' }}>N° PV</th>
                            <th style={{ padding: '0.75rem' }}>Étudiant</th>
                            <th style={{ padding: '0.75rem' }}>Moyenne Pondérée</th>
                            <th style={{ padding: '0.75rem' }}>Décision du Jury</th>
                            <th style={{ padding: '0.75rem' }}>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminData.deliberations.map((deli) => (
                            <tr key={deli.id} style={{ borderBottom: '1px solid #0f172a' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 700 }}>PV-{deli.id}</td>
                              <td style={{ padding: '0.75rem' }}>{deli.studentName} ({deli.matricule})</td>
                              <td style={{ padding: '0.75rem', fontWeight: 800, color: '#38bdf8' }}>{deli.weightedAverage} / 20</td>
                              <td style={{ padding: '0.75rem', color: '#4ade80', fontWeight: 700 }}>{deli.decision}</td>
                              <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{deli.finalizedAt}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === 'diplomas' && (
                    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
                      <h3 style={{ margin: '0 0 1rem 0' }}>📜 Diplômes LMD Certifiés</h3>
                      <table style={{ width: '100%', borderCollapse: 'collapse', color: '#f8fafc', fontSize: '0.9rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #334155', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem' }}>N° Diplôme</th>
                            <th style={{ padding: '0.75rem' }}>Titulaire</th>
                            <th style={{ padding: '0.75rem' }}>Programme & Niveau</th>
                            <th style={{ padding: '0.75rem' }}>Mention</th>
                            <th style={{ padding: '0.75rem' }}>Date de délivrance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminData.diplomas.map((dip) => (
                            <tr key={dip.diplomaNumber} style={{ borderBottom: '1px solid #0f172a' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 700, color: '#fbbf24' }}>{dip.diplomaNumber}</td>
                              <td style={{ padding: '0.75rem' }}>{dip.studentName}</td>
                              <td style={{ padding: '0.75rem' }}>{dip.programTitle} ({dip.level})</td>
                              <td style={{ padding: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>{dip.mention}</td>
                              <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{dip.issuedDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
