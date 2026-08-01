import Footer from '../../shared/src/Footer';
import Header from '../../shared/src/Header';
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

type Transcript = {
  student: { name: string; matricule: string }
  program: { title: string }
  academicYear: string
  weightedAverage: number
  decision: string
  verificationCode: string
}

type ScheduleItem = {
  course: { code: string; title: string; credits: number }
  day: string
  time: string
  room: string
}

type Grade = {
  courseCode: string
  courseTitle: string
  credits: number
  score: number
  status: string
  course?: { code: string; title: string; credits: number }
}

type GradesResponse = {
  grades: Grade[]
  weightedAverage: number
  totalCredits: number
}

const authApiUrl = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:4001'
const coreApiUrl = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:4002'

export default function StudentSpace() {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [transcript, setTranscript] = useState<Transcript | null>(null)
  const [schedule, setSchedule] = useState<ScheduleItem[] | null>(null)
  const [grades, setGrades] = useState<GradesResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setTranscript(null)
    setSchedule(null)

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

  async function loadTranscript() {
    if (!session) return
    setError(null)
    try {
      const response = await fetch(`${coreApiUrl}/transcripts/me`, {
        headers: { Authorization: `Bearer ${session.token}` }
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Le relevé est indisponible.')
      setTranscript(result)
    } catch (transcriptError) {
      setError(transcriptError instanceof Error ? transcriptError.message : 'Le relevé est indisponible.')
    }
  }

  async function loadSchedule() {
    if (!session) return
    setError(null)
    try {
      const response = await fetch(`${coreApiUrl}/students/me/schedule`, {
        headers: { Authorization: `Bearer ${session.token}` }
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Emploi du temps indisponible.')
      setSchedule(result.schedule || result)
    } catch (scheduleError) {
      setError(scheduleError instanceof Error ? scheduleError.message : 'Emploi du temps indisponible.')
    }
  }

  async function loadGrades() {
    if (!session) return
    setError(null)
    try {
      const response = await fetch(`${coreApiUrl}/students/me/grades`, {
        headers: { Authorization: `Bearer ${session.token}` }
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Notes indisponibles.')
      setGrades(result)
    } catch (gradesError) {
      setError(gradesError instanceof Error ? gradesError.message : 'Notes indisponibles.')
    }
  }

  return (
    <main>
      <Header title="IUM-MORAVE">
        <a href="/">IUM-MORAVE</a>
        <a href="/">Retour au portail</a>
      </Header>
      <section>
        <p className="eyebrow">Espace étudiant</p>
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
            <button type="button" onClick={loadTranscript}>Consulter mon relevé de notes</button>
            <button type="button" onClick={loadGrades}>Voir mes notes détaillées</button>
            <button type="button" onClick={loadSchedule}>Voir mon emploi du temps</button>
          </div>
        )}

        {grades ? (
          <article className="panel">
            <h2>Mes notes</h2>
            <p><strong>Moyenne pondérée :</strong> {grades.weightedAverage}/20 · <strong>Crédits totalisés :</strong> {grades.totalCredits}</p>
            <ul>
              {grades.grades.map((grade, index) => (
                <li key={index}><strong>{grade.courseTitle} ({grade.courseCode})</strong> — {grade.score}/20 · {grade.credits} crédits</li>
              ))}
            </ul>
          </article>
        ) : null}

        {schedule ? (
          <article className="panel">
            <h2>Emploi du temps</h2>
            <ul>
              {schedule.map((item, index) => (
                <li key={index}>
                  <strong>{item.day} {item.time}</strong> — {item.course.title} ({item.course.code}, {item.course.credits} crédits)<br />
                  <span>Salle : {item.room}</span>
                </li>
              ))}
            </ul>
          </article>
        ) : null}

        {transcript ? (
          <article className="panel">
            <h2>Relevé de notes numérique</h2>
            <p><strong>Étudiant :</strong> {transcript.student.name} ({transcript.student.matricule})</p>
            <p><strong>Programme :</strong> {transcript.program.title}</p>
            <p><strong>Année académique :</strong> {transcript.academicYear}</p>
            <p><strong>Moyenne pondérée :</strong> {transcript.weightedAverage}/20</p>
            <p><strong>Décision :</strong> {transcript.decision}</p>
            <p className="verification">Code de vérification : {transcript.verificationCode}</p>
          </article>
        ) : null}
        {error ? <p role="alert" className="alert">{error}</p> : null}
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
        .alert { color: #751b1b; margin-top: 1rem; }
        .verification { color: #52677c; font-size: .9rem; }
        ul { display: grid; gap: .75rem; list-style: none; padding: 0; }
        li { background: #fff; border: 1px solid #dce5ed; border-radius: .5rem; padding: 1rem; }
      `}</style>
    <Footer />
      </main>
  )
}
