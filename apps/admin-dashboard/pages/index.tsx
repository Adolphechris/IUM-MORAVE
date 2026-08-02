import { Header } from '@ium-morave/shared';
import { Footer } from '@ium-morave/shared';
import { Table } from '@ium-morave/shared'
import { Tabs } from '@ium-morave/shared';
import React, { FormEvent, useState } from 'react'

type Session = {
  token: string
  user: {
    email: string
    role: 'student' | 'teacher' | 'admin' | 'finance'
    firstName: string
    lastName: string
  }
}

type Dashboard = {
  totals: Record<string, number>
  recentAuditEvents: Array<{ action: string; resource: string; createdAt: string }>
  upcomingEvents: Array<{ id: number; title: string; startsAt: string }>
}

type AuditLog = {
  id: number
  actor: string
  action: string
  resource: string
  resourceId: number
  createdAt: string
}

type Enrollment = {
  id: number
  studentEmail: string
  studentName: string
  matricule: string
  programId: number
  trackId: number | null
  academicYear: string
  status: string
  program?: { title: string }
  track?: { title: string }
}

type AdminDocument = {
  id: number
  title: string
  filePath: string
  mime: string
  visibility: string
}

type AdminUser = {
  id: number
  email: string
  name: string
  type: 'student' | 'teacher'
}

const authApiUrl = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:4001'
const coreApiUrl = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:4002'

export default function AdminDashboard() {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [logs, setLogs] = useState<AuditLog[] | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[] | null>(null)
  const [adminDocuments, setAdminDocuments] = useState<AdminDocument[] | null>(null)
  const [adminUsers, setAdminUsers] = useState<AdminUser[] | null>(null)
  const [deliberations, setDeliberations] = useState<Array<{ id: number; enrollmentId: number; decision: string; finalizedAt: string; enrollment?: { studentName: string; matricule: string } }> | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setDashboard(null)
    setLogs(null)

    try {
      const response = await fetch(`${authApiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Connexion impossible.')
      setSession(result)
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Connexion impossible.')
    } finally {
      setLoading(false)
    }
  }

  async function loadDashboard() {
    if (!session) return
    setError(null)
    try {
      const response = await fetch(`${coreApiUrl}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${session.token}` }
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Tableau de bord indisponible.')
      setDashboard(result)
    } catch (dashboardError) {
      setError(dashboardError instanceof Error ? dashboardError.message : 'Tableau de bord indisponible.')
    }
  }

  async function loadAuditLogs() {
    if (!session) return
    setError(null)
    try {
      const response = await fetch(`${coreApiUrl}/admin/audit-logs`, {
        headers: { Authorization: `Bearer ${session.token}` }
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Journal indisponible.')
      setLogs(result)
    } catch (logsError) {
      setError(logsError instanceof Error ? logsError.message : 'Journal indisponible.')
    }
  }

  async function loadEnrollments() {
    if (!session) return
    setError(null)
    try {
      const response = await fetch(`${coreApiUrl}/admin/enrollments`, {
        headers: { Authorization: `Bearer ${session.token}` }
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Inscriptions indisponibles.')
      setEnrollments(result)
    } catch (enrollmentsError) {
      setError(enrollmentsError instanceof Error ? enrollmentsError.message : 'Inscriptions indisponibles.')
    }
  }

  async function loadDocuments() {
    if (!session) return
    setError(null)
    try {
      const response = await fetch(`${coreApiUrl}/admin/documents`, {
        headers: { Authorization: `Bearer ${session.token}` }
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Documents indisponibles.')
      setAdminDocuments(result)
    } catch (documentsError) {
      setError(documentsError instanceof Error ? documentsError.message : 'Documents indisponibles.')
    }
  }

  async function loadUsers() {
    if (!session) return
    setError(null)
    try {
      const response = await fetch(`${coreApiUrl}/admin/users`, {
        headers: { Authorization: `Bearer ${session.token}` }
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Utilisateurs indisponibles.')
      setAdminUsers(result)
    } catch (usersError) {
      setError(usersError instanceof Error ? usersError.message : 'Utilisateurs indisponibles.')
    }
  }

  async function loadDeliberations() {
    if (!session) return
    setError(null)
    try {
      const response = await fetch(`${coreApiUrl}/admin/deliberations`, {
        headers: { Authorization: `Bearer ${session.token}` }
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Délibérations indisponibles.')
      setDeliberations(result)
    } catch (deliberationsError) {
      setError(deliberationsError instanceof Error ? deliberationsError.message : 'Délibérations indisponibles.')
    }
  }

  return (
    <main>
      <Header title="IUM-MORAVE">
        <a href="/">IUM-MORAVE</a>
        <a href="/">Retour au portail</a>
      </Header>
      <section>
        <p className="eyebrow">Administration</p>
        <h1>{session ? `Bienvenue, ${session.user.firstName || session.user.email}` : 'Connexion sécurisée'}</h1>

        {!session ? (
          <form onSubmit={login}>
            <label htmlFor="email">Adresse email</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <label htmlFor="password">Mot de passe</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button type="submit" disabled={loading}>{loading ? 'Connexion…' : 'Se connecter'}</button>
          </form>
        ) : (
          <div className="panel">
            <p><strong>Rôle :</strong> {session.user.role}</p>
            <div className="actions">
              <button type="button" onClick={loadDashboard}>Tableau de bord</button>
              <button type="button" onClick={loadAuditLogs}>Journal d&apos;audit</button>
              <button type="button" onClick={loadEnrollments}>Inscriptions</button>
              <button type="button" onClick={loadDocuments}>Documents</button>
              <button type="button" onClick={loadUsers}>Utilisateurs</button>
              <button type="button" onClick={loadDeliberations}>Délibérations</button>
            </div>
          </div>
        )}

        {session ? (
          <Tabs
            labels={['Tableau de bord', 'Journal', 'Inscriptions', 'Documents', 'Utilisateurs', 'Délibérations']}
            active={activeTab}
            onChange={setActiveTab}
          >
            {dashboard ? (
              <article className="panel">
                <h2>Tableau de bord</h2>
                <div className="metrics">
                  {Object.entries(dashboard.totals).map(([label, value]) => (
                    <p key={label}><strong>{value}</strong><span>{label.replace(/([A-Z])/g, ' $1')}</span></p>
                  ))}
                </div>
                <h3>Événements à venir</h3>
                <ul>
                  {dashboard.upcomingEvents.map((event) => (
                    <li key={event.id}>{event.startsAt} — {event.title}</li>
                  ))}
                </ul>
              </article>
            ) : (
              <p>Aucune donnée. Cliquez sur &quot;Tableau de bord&quot; pour charger.</p>
            )}

            {logs ? (
              <article className="panel">
                <h2>Journal d&apos;audit</h2>
                <Table
                  columns={[
                    { key: 'createdAt', label: 'Date' },
                    { key: 'actor', label: 'Acteur' },
                    { key: 'action', label: 'Action' },
                    { key: 'resource', label: 'Ressource' }
                  ]}
                  data={logs.slice(-20).reverse()}
                  keyExtractor={(item) => item.id}
                />
              </article>
            ) : (
              <p>Aucune donnée. Cliquez sur &quot;Journal&quot; pour charger.</p>
            )}

            {enrollments ? (
              <article className="panel">
                <h2>Inscriptions</h2>
                <Table
                  columns={[
                    { key: 'studentName', label: 'Étudiant' },
                    { key: 'matricule', label: 'Matricule' },
                    { key: 'program', label: 'Programme', render: (value) => (value as Enrollment['program'])?.title || '' },
                    { key: 'track', label: 'Parcours', render: (value) => (value as Enrollment['track'])?.title || '' },
                    { key: 'academicYear', label: 'Année' }
                  ]}
                  data={enrollments}
                  keyExtractor={(item) => item.id}
                />
              </article>
            ) : (
              <p>Aucune donnée. Cliquez sur &quot;Inscriptions&quot; pour charger.</p>
            )}

            {adminDocuments ? (
              <article className="panel">
                <h2>Documents</h2>
                <Table
                  columns={[
                    { key: 'title', label: 'Titre' },
                    { key: 'mime', label: 'Type' },
                    { key: 'visibility', label: 'Visibilité' }
                  ]}
                  data={adminDocuments}
                  keyExtractor={(item) => item.id}
                />
              </article>
            ) : (
              <p>Aucune donnée. Cliquez sur &quot;Documents&quot; pour charger.</p>
            )}

            {adminUsers ? (
              <article className="panel">
                <h2>Utilisateurs</h2>
                <Table
                  columns={[
                    { key: 'name', label: 'Nom' },
                    { key: 'email', label: 'Email' },
                    { key: 'type', label: 'Type' }
                  ]}
                  data={adminUsers}
                  keyExtractor={(item) => item.id}
                />
              </article>
            ) : (
              <p>Aucune donnée. Cliquez sur &quot;Utilisateurs&quot; pour charger.</p>
            )}

            {deliberations ? (
              <article className="panel">
                <h2>Délibérations</h2>
                <Table
                  columns={[
                    { key: 'enrollmentId', label: 'Inscription' },
                    { key: 'studentName', label: 'Étudiant', render: (value) => (value as { studentName?: string })?.studentName || '' },
                    { key: 'decision', label: 'Décision' },
                    { key: 'finalizedAt', label: 'Finalisé le' }
                  ]}
                  data={deliberations.map((item) => ({ ...item, studentName: item.enrollment?.studentName }))}
                  keyExtractor={(item) => item.id}
                />
              </article>
            ) : (
              <p>Aucune donnée. Cliquez sur &quot;Délibérations&quot; pour charger.</p>
            )}
          </Tabs>
        ) : null}
      </section>
      <style jsx>{`
        main { min-height: 100vh; background: #f6f8fb; color: #132238; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
        header, section { max-width: 760px; margin: 0 auto; padding: 1.5rem; }
        header { display: flex; justify-content: space-between; }
        a { color: #07588e; font-weight: 700; text-decoration: none; }
        section { padding-top: 4rem; }
        .eyebrow { color: #0a689f; font-size: .8rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
        form, .panel { display: grid; gap: .75rem; max-width: 500px; background: white; border: 1px solid #dce5ed; border-radius: .7rem; padding: 1.5rem; }
        label { font-weight: 700; }
        input { border: 1px solid #9fb0bf; border-radius: .35rem; font: inherit; padding: .75rem; }
        button { width: fit-content; border: 0; border-radius: .35rem; background: #07588e; color: white; cursor: pointer; font: inherit; font-weight: 700; padding: .75rem 1rem; }
        button:disabled { opacity: .6; cursor: wait; }
        .actions { display: flex; flex-wrap: wrap; gap: .5rem; }
        .alert { color: #751b1b; margin-top: 1rem; }
        .metrics { display: grid; gap: .75rem; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); }
        .metrics p { background: #edf6fb; border-radius: .35rem; display: grid; gap: .2rem; margin: 0; padding: .75rem; }
        .metrics strong { color: #07588e; font-size: 1.5rem; }
        .metrics span { color: #52677c; font-size: .8rem; text-transform: capitalize; }
        ul { display: grid; gap: .75rem; list-style: none; padding: 0; }
        li { background: #fff; border: 1px solid #dce5ed; border-radius: .5rem; padding: 1rem; }
      `}</style>
    <Footer />
      </main>
  )
}
