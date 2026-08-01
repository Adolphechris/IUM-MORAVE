require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {
  faculties,
  programs,
  tracks,
  courses,
  enrollments,
  students,
  teachers,
  calendarEvents,
  documents,
  grades,
  deliberations
} = require('./data');
const { authenticate, requireRole } = require('./auth');
const { createInstitutionalEmail, sendInstitutionalEmail } = require('./email-service');
const { buildTranscript } = require('./transcript-service');

const PORT = process.env.PORT || 4002;
const app = express();
const transcriptRegistry = new Map();
const auditLogs = [];

app.use(cors({ origin: process.env.WEB_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

function audit(req, action, resource, resourceId) {
  auditLogs.push({
    id: auditLogs.length + 1,
    actor: req.user ? req.user.email : 'anonymous',
    action,
    resource,
    resourceId,
    createdAt: new Date().toISOString()
  });
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'core-api' });
});

app.get('/faculties', (req, res) => {
  res.json(faculties);
});

app.post('/faculties', authenticate, requireRole('admin'), (req, res) => {
  const { code, name, description } = req.body;
  if (!code || !name) {
    return res.status(400).json({ error: 'code and name are required' });
  }

  const exists = faculties.some((item) => item.code === code);
  if (exists) {
    return res.status(409).json({ error: 'Faculty code already exists' });
  }

  const newFaculty = {
    id: faculties.length + 1,
    code,
    name,
    description: description || ''
  };
  faculties.push(newFaculty);
  audit(req, 'create', 'faculty', newFaculty.id);
  res.status(201).json(newFaculty);
});

app.get('/programs', (req, res) => {
  const { level } = req.query;
  const result = level ? programs.filter((program) => program.level === level) : programs;
  res.json(result);
});

app.get('/programs/:id', (req, res) => {
  const program = programs.find((item) => item.id === Number(req.params.id));
  if (!program) {
    return res.status(404).json({ error: 'Program not found' });
  }
  res.json(program);
});

app.get('/tracks', (req, res) => {
  const programId = Number(req.query.programId);
  res.json(programId ? tracks.filter((track) => track.programId === programId) : tracks);
});

app.get('/faculty/:id', (req, res) => {
  const faculty = faculties.find((item) => item.id === Number(req.params.id));
  if (!faculty) {
    return res.status(404).json({ error: 'Faculty not found' });
  }
  res.json(faculty);
});

app.get('/news', (req, res) => {
  res.json([
    { id: 1, title: 'Lancement du portail IUM-MORAVE', summary: 'Le portail institutionnel est en cours de développement.', publishedAt: '2026-08-01' }
  ]);
});

app.get('/courses', (req, res) => {
  const trackId = Number(req.query.trackId);
  res.json(trackId ? courses.filter((course) => course.trackId === trackId) : courses);
});

app.get('/calendar', (req, res) => {
  res.json(calendarEvents);
});

app.get('/documents', (req, res) => {
  const isAuthenticated = Boolean(req.headers.authorization);
  res.json(documents.filter((document) => document.visibility === 'public' || isAuthenticated));
});

app.post('/enrollments', authenticate, requireRole('admin'), (req, res) => {
  const { studentEmail, studentName, matricule, programId, trackId, academicYear } = req.body;
  if (!studentEmail || !studentName || !matricule || !programId || !academicYear) {
    return res.status(400).json({ error: 'studentEmail, studentName, matricule, programId and academicYear are required' });
  }

  if (!programs.some((program) => program.id === Number(programId))) {
    return res.status(400).json({ error: 'Program not found' });
  }

  const enrollment = {
    id: enrollments.length + 1,
    studentEmail,
    studentName,
    matricule,
    programId: Number(programId),
    trackId: trackId ? Number(trackId) : null,
    academicYear,
    status: 'active'
  };
  enrollments.push(enrollment);
  audit(req, 'create', 'enrollment', enrollment.id);
  res.status(201).json(enrollment);
});

app.post('/enrollments/:id/grades', authenticate, requireRole('admin', 'teacher'), (req, res) => {
  const enrollmentId = Number(req.params.id);
  const { courseCode, courseTitle, credits, score } = req.body;
  if (!courseCode || !courseTitle || !Number.isFinite(credits) || !Number.isFinite(score)) {
    return res.status(400).json({ error: 'courseCode, courseTitle, credits and score are required' });
  }
  if (!enrollments.some((enrollment) => enrollment.id === enrollmentId)) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }
  if (credits <= 0 || score < 0 || score > 20) {
    return res.status(400).json({ error: 'credits must be positive and score must be between 0 and 20' });
  }

  const grade = { enrollmentId, courseCode, courseTitle, credits, score, status: 'pending' };
  grades.push(grade);
  audit(req, 'create', 'grade', `${enrollmentId}:${courseCode}`);
  res.status(201).json(grade);
});

app.get('/students/me', authenticate, requireRole('student'), (req, res) => {
  const student = students.find((item) => item.email.toLowerCase() === req.user.email.toLowerCase());
  if (!student) {
    return res.status(404).json({ error: 'Student profile not found' });
  }

  const enrollment = enrollments.find((item) => item.id === student.enrollmentId);
  const program = programs.find((item) => item.id === enrollment.programId);
  const track = tracks.find((item) => item.id === enrollment.trackId);
  res.json({ student, enrollment, program, track });
});

app.get('/students/me/schedule', authenticate, requireRole('student'), (req, res) => {
  const student = students.find((item) => item.email.toLowerCase() === req.user.email.toLowerCase());
  if (!student) {
    return res.status(404).json({ error: 'Student profile not found' });
  }

  const enrollment = enrollments.find((item) => item.id === student.enrollmentId);
  const schedule = courses
    .filter((course) => course.trackId === enrollment.trackId)
    .map((course, index) => ({
      course,
      day: ['Lundi', 'Mercredi', 'Vendredi'][index % 3],
      time: ['08:00 - 10:00', '10:30 - 12:30', '14:00 - 16:00'][index % 3],
      room: `Auditoire ${index + 1}`
    }));
  res.json(schedule);
});

app.get('/teachers/me', authenticate, requireRole('teacher'), (req, res) => {
  const teacher = teachers.find((item) => item.email.toLowerCase() === req.user.email.toLowerCase());
  if (!teacher) {
    return res.status(404).json({ error: 'Teacher profile not found' });
  }
  res.json(teacher);
});

app.get('/teachers/me/courses', authenticate, requireRole('teacher'), (req, res) => {
  res.json(courses.filter((course) => course.teacherEmail.toLowerCase() === req.user.email.toLowerCase()));
});

app.post('/enrollments/:id/deliberation', authenticate, requireRole('admin'), (req, res) => {
  const enrollmentId = Number(req.params.id);
  const enrollmentGrades = grades.filter((grade) => grade.enrollmentId === enrollmentId);
  if (!enrollments.some((enrollment) => enrollment.id === enrollmentId)) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }
  if (enrollmentGrades.length === 0) {
    return res.status(400).json({ error: 'No grades available for deliberation' });
  }

  enrollmentGrades.forEach((grade) => {
    grade.status = 'validated';
  });
  const deliberation = {
    id: deliberations.length + 1,
    enrollmentId,
    decision: 'validated',
    finalizedBy: req.user.email,
    finalizedAt: new Date().toISOString()
  };
  deliberations.push(deliberation);
  audit(req, 'validate', 'deliberation', deliberation.id);
  res.status(201).json(deliberation);
});

function createTranscriptForEnrollment(enrollment) {
  const program = programs.find((item) => item.id === enrollment.programId);
  const enrollmentGrades = grades.filter((grade) => grade.enrollmentId === enrollment.id);
  const transcript = buildTranscript({ enrollment, program, grades: enrollmentGrades });
  transcriptRegistry.set(transcript.verificationCode, transcript);
  return transcript;
}

app.get('/transcripts/me', authenticate, requireRole('student'), (req, res) => {
  if (!Number.isInteger(req.user.enrollmentId)) {
    return res.status(403).json({ error: 'Academic enrollment is not linked to this account' });
  }

  const enrollment = enrollments.find((item) => (
    item.id === req.user.enrollmentId
    && item.studentEmail.toLowerCase() === req.user.email.toLowerCase()
  ));
  if (!enrollment) {
    return res.status(404).json({ error: 'No enrollment found for this student' });
  }

  const transcript = createTranscriptForEnrollment(enrollment);
  audit(req, 'issue', 'transcript', enrollment.id);
  res.json(transcript);
});

app.get('/transcripts/enrollments/:id', authenticate, requireRole('admin'), (req, res) => {
  const enrollment = enrollments.find((item) => item.id === Number(req.params.id));
  if (!enrollment) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }

  const transcript = createTranscriptForEnrollment(enrollment);
  audit(req, 'issue', 'transcript', enrollment.id);
  res.json(transcript);
});

app.post('/verification/transcript', (req, res) => {
  const { verificationCode, integrityHash } = req.body;
  if (!verificationCode || !integrityHash) {
    return res.status(400).json({ error: 'verificationCode and integrityHash are required' });
  }

  const transcript = transcriptRegistry.get(verificationCode);
  const verified = Boolean(transcript && transcript.integrityHash === integrityHash);
  res.json({
    verified,
    institution: 'Institut Universitaire Morave',
    verifiedAt: new Date().toISOString()
  });
});

app.post('/notifications/preview', authenticate, requireRole('admin'), (req, res) => {
  try {
    const message = createInstitutionalEmail(req.body);
    const delivered = sendInstitutionalEmail(message);
    audit(req, 'preview', 'institutional-email', delivered.id);
    res.status(201).json(delivered);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/admin/audit-logs', authenticate, requireRole('admin'), (req, res) => {
  res.json(auditLogs);
});

app.get('/admin/dashboard', authenticate, requireRole('admin'), (req, res) => {
  res.json({
    totals: {
      faculties: faculties.length,
      programs: programs.length,
      tracks: tracks.length,
      courses: courses.length,
      students: students.length,
      teachers: teachers.length,
      documents: documents.length,
      pendingDeliberations: grades.filter((grade) => grade.status === 'pending').length
    },
    recentAuditEvents: auditLogs.slice(-10).reverse(),
    upcomingEvents: calendarEvents.filter((event) => event.startsAt >= new Date().toISOString().slice(0, 10))
  });
});

app.post('/verification/diploma', (req, res) => {
  const { diploma_number, qr_code } = req.body;
  if (!diploma_number && !qr_code) {
    return res.status(400).json({ error: ' diploma_number or qr_code is required' });
  }

  const valid = diploma_number === 'DIP-2026-0001' || qr_code === 'VALID-DIP-QR-2026';
  res.json({ verified: valid, diploma_number, qr_code, issued_by: 'IUM-MORAVE' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`core-api listening on http://localhost:${PORT}`);
});
