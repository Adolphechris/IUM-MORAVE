import React, { useState, FormEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminMessaging from '../components/AdminMessaging';

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

type GradeItem = {
  code: string;
  title: string;
  credits: number;
  score: number;
};

type PresetTemplate = {
  name: string;
  studentName: string;
  matricule: string;
  programTitle: string;
  level: string;
  academicYear: string;
  grades: GradeItem[];
};

const PRESETS: PresetTemplate[] = [
  {
    name: 'Exemplaire 1 : Licence 3 Sciences Informatiques (Jean Kabamba)',
    studentName: 'Jean Kabamba Mukendi',
    matricule: '2026-SINT-042',
    programTitle: 'Licence en Sciences Informatiques & Nouvelles Technologies',
    level: 'Licence 3 (LMD)',
    academicYear: '2025-2026',
    grades: [
      { code: 'SINT-301', title: 'Algorithmique avancée et Structures de données', credits: 6, score: 17 },
      { code: 'SINT-302', title: 'Architecture des Systèmes Distribués & Cloud', credits: 6, score: 16 },
      { code: 'SINT-303', title: 'Base de données Avancées & SQL/NoSQL', credits: 6, score: 15.5 },
      { code: 'SINT-304', title: 'Ingénierie Logicielle & Méthodes Agiles', credits: 6, score: 17.5 },
      { code: 'SINT-305', title: 'Cybersécurité & Sécurité des Réseaux', credits: 6, score: 16 }
    ]
  },
  {
    name: 'Exemplaire 2 : Doctorat en Médecine Générale (Marie Tshilombo)',
    studentName: 'Marie Tshilombo Kankolongo',
    matricule: '2026-MED-018',
    programTitle: 'Doctorat en Médecine Générale & Chirurgie',
    level: 'Doctorat (M5)',
    academicYear: '2025-2026',
    grades: [
      { code: 'MED-501', title: 'Anatomie Pathologique & Pathologie Générale', credits: 8, score: 18.5 },
      { code: 'MED-502', title: 'Sémiologie Médicale et Chirurgicale', credits: 8, score: 17 },
      { code: 'MED-503', title: 'Pharmacologie Clinique & Thérapeutique', credits: 7, score: 18 },
      { code: 'MED-504', title: 'Stage Clinique Hospitalier & Gardes', credits: 7, score: 18 }
    ]
  },
  {
    name: 'Exemplaire 3 : Licence 3 Droit Privé (Patrick Mwamba)',
    studentName: 'Patrick Mwamba Ilunga',
    matricule: '2026-DROIT-099',
    programTitle: 'Licence en Droit Privé et Judiciaire',
    level: 'Licence 3 (LMD)',
    academicYear: '2025-2026',
    grades: [
      { code: 'DRT-301', title: 'Droit des Obligations & des Contrats', credits: 6, score: 14.5 },
      { code: 'DRT-302', title: 'Procédure Civile & Voies d\'Exécution', credits: 6, score: 15 },
      { code: 'DRT-303', title: 'Droit Pénal Spécial & Procédure Pénale', credits: 6, score: 14 },
      { code: 'DRT-304', title: 'Droit Commercial & Sociétés Commerciales', credits: 6, score: 15.5 },
      { code: 'DRT-305', title: 'Droit du Travail et Sécurité Sociale', credits: 6, score: 16 }
    ]
  }
];

export default function AdminPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'generator' | 'enrollments' | 'deliberations' | 'diplomas'>('overview');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Formulaire Générateur de Relevé
  const [studentName, setStudentName] = useState(PRESETS[0].studentName);
  const [matricule, setMatricule] = useState(PRESETS[0].matricule);
  const [programTitle, setProgramTitle] = useState(PRESETS[0].programTitle);
  const [level, setLevel] = useState(PRESETS[0].level);
  const [academicYear, setAcademicYear] = useState(PRESETS[0].academicYear);
  const [grades, setGrades] = useState<GradeItem[]>(PRESETS[0].grades);
  const [generatedTranscript, setGeneratedTranscript] = useState<any | null>(null);

  // Restauration automatique de session au rafraîchissement de la page (F5 / Reload)
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('ium_admin_session');
      if (saved) {
        const parsedSession: UserSession = JSON.parse(saved);
        if (parsedSession && parsedSession.token && parsedSession.user) {
          setSession(parsedSession);
          loadAdminData(parsedSession.token);
        }
      }
    } catch (e) {
      console.warn('Erreur lors de la restauration de la session admin:', e);
    }
  }, []);

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
      try {
        localStorage.setItem('ium_admin_session', JSON.stringify(data));
      } catch (saveErr) {
        console.warn('localStorage save failed:', saveErr);
      }
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

  function applyPreset(preset: PresetTemplate) {
    setStudentName(preset.studentName);
    setMatricule(preset.matricule);
    setProgramTitle(preset.programTitle);
    setLevel(preset.level);
    setAcademicYear(preset.academicYear);
    setGrades([...preset.grades]);
    setGeneratedTranscript(null);
  }

  function calculateWeightedAverage(items: GradeItem[]) {
    if (!items.length) return 0;
    const totalCredits = items.reduce((acc, curr) => acc + curr.credits, 0);
    const weightedSum = items.reduce((acc, curr) => acc + (curr.score * curr.credits), 0);
    return Math.round((weightedSum / totalCredits) * 100) / 100;
  }

  function getMention(avg: number) {
    if (avg >= 18) return 'Grande Distinction avec Félicitations';
    if (avg >= 16) return 'Grande Distinction';
    if (avg >= 14) return 'Distinction';
    if (avg >= 10) return 'Satisfaction';
    return 'Ajourné';
  }

  function handleGenerateTranscript(e: FormEvent) {
    e.preventDefault();
    const average = calculateWeightedAverage(grades);
    const totalCredits = grades.reduce((acc, curr) => acc + curr.credits, 0);
    const decision = average >= 10 ? `ADMIS (${getMention(average)})` : 'AJOURNÉ';
    const verificationCode = `IUM-TR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    setGeneratedTranscript({
      studentName,
      matricule,
      programTitle,
      level,
      academicYear,
      grades,
      average,
      totalCredits,
      decision,
      mention: getMention(average),
      verificationCode,
      issuedDate: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    });
  }

  function handleLogout() {
    try {
      localStorage.removeItem('ium_admin_session');
    } catch (e) {}
    setSession(null);
    setAdminData(null);
    setEmail('');
    setPassword('');
  }

  return (
    <>
      <Head>
        <title>Tableau de Bord & Générateur de Relevés | IUM-MORAVE</title>
        <meta name="description" content="Espace d'administration et générateur officiel de relevés de notes IUM-MORAVE." />
      </Head>

      <div style={{ fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
        {/* En-tête / Barre de navigation */}
        <header style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#1e293b', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 800, fontSize: '1.25rem' }}>
              🏛️ IUM-MORAVE
            </Link>
            <span style={{ backgroundColor: '#0284c7', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
              ADMINISTRATION & RELEVÉS
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
            /* Écran de connexion Administrateur */
            <div style={{ maxWidth: '440px', margin: '4rem auto 0', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.5rem 0' }}>Portail d'Administration</h1>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>Générateur de Relevés de Notes & Gestion LMD</p>
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
                  style={{ width: '100%', padding: '0.875rem', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'wait' : 'pointer' }}
                >
                  {loading ? 'Connexion en cours...' : 'Se connecter au système'}
                </button>
              </form>

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #334155', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
                🔑 Compte d'accès administrateur : <strong>admin@ium-morave.edu</strong>
              </div>
            </div>
          ) : (
            /* Tableau de Bord Administrateur */
            <div>
              {/* En-tête de session */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', backgroundColor: '#1e293b', padding: '1.25rem 1.5rem', borderRadius: '0.75rem', border: '1px solid #334155' }}>
                <div>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>
                    Espace Administrateur — {session.user.firstName} {session.user.lastName}
                  </h1>
                  <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>
                    Session sécurisée active : <strong>{session.user.email}</strong>
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {(['overview', 'messages', 'generator', 'enrollments', 'deliberations', 'diplomas'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: '0.6rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        backgroundColor: activeTab === tab ? '#0284c7' : '#334155',
                        color: '#ffffff'
                      }}
                    >
                      {tab === 'overview' && '📊 Vue globale'}
                      {tab === 'messages' && '📬 Messagerie Gmail'}
                      {tab === 'generator' && '📄 Générateur de Relevés'}
                      {tab === 'enrollments' && '🎓 Inscriptions'}
                      {tab === 'deliberations' && '⚖️ Délibérations'}
                      {tab === 'diplomas' && '📜 Diplômes'}
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: '0.6rem 1rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #991b1b',
                      backgroundColor: '#450a0a',
                      color: '#fca5a5',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                    title="Se déconnecter de la session d’administration"
                  >
                    🚪 Déconnexion
                  </button>
                </div>
              </div>

              {/* Onglet Messagerie Gmail-Style */}
              {activeTab === 'messages' && (
                <AdminMessaging token={session.token} />
              )}

              {/* Contenu Onglet 1 : Vue Globale */}
              {activeTab === 'overview' && adminData && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                    {Object.entries(adminData.totals).map(([key, val]) => (
                      <div key={key} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.25rem' }}>
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                          {key === 'students' && 'Étudiants'}
                          {key === 'teachers' && 'Enseignants'}
                          {key === 'programs' && 'Filières LMD'}
                          {key === 'deliberations' && 'Délibérations'}
                          {key === 'diplomasIssued' && 'Diplômes Délivrés'}
                        </span>
                        <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#38bdf8' }}>{val}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>📋 Événements académiques récents</h3>
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

              {/* Contenu Onglet 2 : GÉNÉRATEUR ET ÉMETTEUR DE RELEVÉS DE NOTES */}
              {activeTab === 'generator' && (
                <div>
                  <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#38bdf8' }}>
                      📄 Générateur Officiel de Relevés de Notes Certifiés LMD
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 1.5rem 0' }}>
                      Choisissez un modèle d'exemplaire pré-rempli ou saisissez les informations de l'étudiant pour générer un relevé officiel avec QR Code.
                    </p>

                    {/* Modèles d'exemplaires en 1 clic */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.5rem' }}>
                        ⚡ Charger un Exemplaire Exemple en 1-Clic :
                      </label>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => applyPreset(preset)}
                            style={{ backgroundColor: '#0f172a', border: '1px solid #0284c7', color: '#38bdf8', padding: '0.6rem 1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                          >
                            📋 {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Formulaire de saisie */}
                    <form onSubmit={handleGenerateTranscript} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.3rem' }}>Nom de l'étudiant</label>
                          <input
                            type="text"
                            required
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.375rem', color: '#fff', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.3rem' }}>Matricule</label>
                          <input
                            type="text"
                            required
                            value={matricule}
                            onChange={(e) => setMatricule(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.375rem', color: '#fff', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.3rem' }}>Programme / Intitulé Filière</label>
                          <input
                            type="text"
                            required
                            value={programTitle}
                            onChange={(e) => setProgramTitle(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.375rem', color: '#fff', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.3rem' }}>Niveau LMD / Année</label>
                          <input
                            type="text"
                            required
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.375rem', color: '#fff', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.3rem' }}>Année Académique</label>
                          <input
                            type="text"
                            required
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.375rem', color: '#fff', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      {/* Liste des Unités d'Enseignement (UEs) */}
                      <div style={{ marginTop: '1rem' }}>
                        <h4 style={{ margin: '0 0 0.75rem 0', color: '#f8fafc', fontSize: '0.95rem' }}>📚 Unités d'Enseignement (UEs) et Notes</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#0f172a', textAlign: 'left', borderBottom: '1px solid #334155' }}>
                              <th style={{ padding: '0.5rem' }}>Code UE</th>
                              <th style={{ padding: '0.5rem' }}>Intitulé de l'UE</th>
                              <th style={{ padding: '0.5rem' }}>Crédits ECTS</th>
                              <th style={{ padding: '0.5rem' }}>Note / 20</th>
                            </tr>
                          </thead>
                          <tbody>
                            {grades.map((g, index) => (
                              <tr key={index} style={{ borderBottom: '1px solid #334155' }}>
                                <td style={{ padding: '0.5rem', color: '#38bdf8', fontWeight: 700 }}>{g.code}</td>
                                <td style={{ padding: '0.5rem' }}>{g.title}</td>
                                <td style={{ padding: '0.5rem' }}>{g.credits} crédits</td>
                                <td style={{ padding: '0.5rem', fontWeight: 800, color: g.score >= 10 ? '#4ade80' : '#f87171' }}>{g.score} / 20</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <button
                        type="submit"
                        style={{ marginTop: '1rem', padding: '0.875rem', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '0.5rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
                      >
                        🎓 Générer le Relevé Officiel Certifié avec QR Code
                      </button>
                    </form>
                  </div>

                  {/* Document Relevé Officiel Généré */}
                  {generatedTranscript && (
                    <div id="printable-transcript" style={{ backgroundColor: '#ffffff', color: '#0f172a', padding: '2.5rem', borderRadius: '0.75rem', border: '3px double #0284c7', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
                      {/* En-tête Institutionnel */}
                      <div style={{ textAlign: 'center', borderBottom: '2px solid #0284c7', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                        <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#0369a1', fontWeight: 900, textTransform: 'uppercase' }}>
                          RÉPUBLIQUE DÉMOCRATIQUE DU CONGO
                        </h2>
                        <h3 style={{ margin: '0.2rem 0', fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>
                          INSTITUT UNIVERSITAIRE MORAVE DE MWENE-DITU
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569' }}>
                          Agrément ESU N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018 · B.P. 126 Mwene-Ditu, Lomami
                        </p>
                        <h4 style={{ margin: '1rem 0 0 0', fontSize: '1.25rem', color: '#0284c7', fontWeight: 900, letterSpacing: '0.05em' }}>
                          RELEVÉ DE NOTES OFFICIEL — SYSTÈME LMD
                        </h4>
                      </div>

                      {/* Informations Étudiant */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', marginBottom: '1.5rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                        <div>
                          <p style={{ margin: '0.2rem 0' }}><strong>Étudiant :</strong> {generatedTranscript.studentName}</p>
                          <p style={{ margin: '0.2rem 0' }}><strong>Matricule :</strong> {generatedTranscript.matricule}</p>
                          <p style={{ margin: '0.2rem 0' }}><strong>Programme :</strong> {generatedTranscript.programTitle}</p>
                        </div>
                        <div>
                          <p style={{ margin: '0.2rem 0' }}><strong>Niveau :</strong> {generatedTranscript.level}</p>
                          <p style={{ margin: '0.2rem 0' }}><strong>Année Académique :</strong> {generatedTranscript.academicYear}</p>
                          <p style={{ margin: '0.2rem 0' }}><strong>Code de Vérification :</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0369a1' }}>{generatedTranscript.verificationCode}</span></p>
                        </div>
                      </div>

                      {/* Tableau des Notes */}
                      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#0284c7', color: '#ffffff', textAlign: 'left' }}>
                            <th style={{ padding: '0.6rem' }}>Code UE</th>
                            <th style={{ padding: '0.6rem' }}>Intitulé de l'Unité d'Enseignement</th>
                            <th style={{ padding: '0.6rem', textAlign: 'center' }}>Crédits</th>
                            <th style={{ padding: '0.6rem', textAlign: 'center' }}>Note / 20</th>
                            <th style={{ padding: '0.6rem', textAlign: 'center' }}>Décision UE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {generatedTranscript.grades.map((item: GradeItem, idx: number) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                              <td style={{ padding: '0.6rem', fontWeight: 700, color: '#0369a1' }}>{item.code}</td>
                              <td style={{ padding: '0.6rem' }}>{item.title}</td>
                              <td style={{ padding: '0.6rem', textAlign: 'center' }}>{item.credits} ECTS</td>
                              <td style={{ padding: '0.6rem', textAlign: 'center', fontWeight: 800 }}>{item.score} / 20</td>
                              <td style={{ padding: '0.6rem', textAlign: 'center', color: item.score >= 10 ? '#166534' : '#991b1b', fontWeight: 700 }}>
                                {item.score >= 10 ? 'Validé' : 'Ajourné'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Résultat Synthétique */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e0f2fe', padding: '1rem 1.5rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid #7dd3fc' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#0369a1', fontWeight: 700 }}>TOTAL CRÉDITS VALIDÉS : {generatedTranscript.totalCredits} ECTS</p>
                          <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                            MOYENNE PONDÉRÉE : {generatedTranscript.average} / 20
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#15803d', backgroundColor: '#dcfce7', padding: '0.4rem 1rem', borderRadius: '0.375rem', border: '1px solid #86efac' }}>
                            {generatedTranscript.decision}
                          </span>
                        </div>
                      </div>

                      {/* Sceau & QR Code de Vérification */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.4rem 0' }}>
                            🔒 Document sécurisé certifié par signature d'intégrité HMAC-SHA256
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                            Vérification en ligne : <strong>https://iumorave-ac.org/verify</strong>
                          </p>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                            Fait à Mwene-Ditu, le {generatedTranscript.issuedDate}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#0369a1' }}>
                            Le Secrétaire Général Académique
                          </p>
                        </div>
                      </div>

                      {/* Bouton d'impression */}
                      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => window.print()}
                          style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '0.875rem 2rem', borderRadius: '0.5rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
                        >
                          🖨️ Imprimer / Exporter le Relevé Officiel en PDF
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Contenu Onglet Inscriptions */}
              {activeTab === 'enrollments' && adminData && (
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

              {/* Contenu Onglet Délibérations */}
              {activeTab === 'deliberations' && adminData && (
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

              {/* Contenu Onglet Diplômes */}
              {activeTab === 'diplomas' && adminData && (
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
            </div>
          )}
        </main>
      </div>
    </>
  );
}
