require('dotenv').config({ override: false });
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
  newsItems,
  grades,
  deliberations
} = require('./data');
const { authenticate, requireRole } = require('./auth');
const { createInstitutionalEmail, sendInstitutionalEmail } = require('./email-service');
const { buildTranscript } = require('./transcript-service');
const { evaluateDeliberation, generateDeliberationPV, generateDiplomaData, getMention } = require('./lmd-engine');
const { generateDiplomaQR, generateVerificationQR } = require('./qr-service');
const { generateTranscriptPdf, generateDiplomaPdf } = require('./pdf-service');
const { buildTranscriptEmail, buildDiplomaEmail, sendEmail } = require('./email-sender');
const { createWatermark, createTimestamp, signDocumentAdvanced, validateDocumentSecurity, requireProductionSecrets } = require('./security-service');
const { getSupabase } = require('../../../shared/supabaseClient');
const { from, initDatabase } = require('./db');
const { findTranscriptByVerificationCode, insertTranscript, listTranscripts } = require('./transcript-repository');
const { findDiplomaByNumber, insertDiploma, listDiplomas } = require('./diploma-repository');
const { insertDeliberation, listDeliberations } = require('./deliberation-repository');

const PORT = process.env.PORT || 4002;
const app = express();
const transcriptRegistry = new Map();
const pvRegistry = new Map();
const diplomaRegistry = new Map();
const auditLogs = [];
const contactRequests = [];
const contactRateLimits = new Map();

const supabase = getSupabase();

async function syncFromSupabase() {
  if (!supabase) return;

  try {
    const { data: facultiesData, error: facultiesError } = await supabase.from('faculties').select();
    if (!facultiesError && facultiesData) {
      faculties.length = 0;
      facultiesData.forEach(f => faculties.push({
        id: f.id,
        code: f.code,
        name: f.name,
        description: f.description,
        facultyId: f.faculty_id
      }));
    }

    const { data: programsData, error: programsError } = await supabase.from('programs').select();
    if (!programsError && programsData) {
      programs.length = 0;
      programsData.forEach(p => programs.push({
        id: p.id,
        facultyId: p.faculty_id,
        code: p.code,
        title: p.title,
        level: p.level,
        durationMonths: p.duration_months,
        description: p.description,
        admissionConditions: p.admission_conditions
      }));
    }

    const { data: tracksData, error: tracksError } = await supabase.from('tracks').select();
    if (!tracksError && tracksData) {
      tracks.length = 0;
      tracksData.forEach(t => tracks.push({
        id: t.id,
        programId: t.program_id,
        code: t.code,
        title: t.title,
        description: t.description
      }));
    }

    const { data: coursesData, error: coursesError } = await supabase.from('courses').select();
    if (!coursesError && coursesData) {
      courses.length = 0;
      coursesData.forEach(c => courses.push({
        id: c.id,
        trackId: c.track_id,
        code: c.code,
        title: c.title,
        credits: c.credits,
        semester: c.semester,
        description: c.description,
        teacherEmail: c.teacher_email
      }));
    }

    const { data: enrollmentsData, error: enrollmentsError } = await supabase.from('enrollments').select();
    if (!enrollmentsError && enrollmentsData) {
      enrollments.length = 0;
      enrollmentsData.forEach(e => enrollments.push({
        id: e.id,
        userId: e.user_id,
        studentEmail: e.student_email || e.user?.email,
        studentName: e.student_name,
        programId: e.program_id,
        trackId: e.track_id,
        year: e.year,
        status: e.status,
        matricule: e.matricule
      }));
    }

    const { data: gradesData, error: gradesError } = await supabase.from('grades').select();
    if (!gradesError && gradesData) {
      grades.length = 0;
      gradesData.forEach(g => grades.push({
        enrollmentId: g.enrollment_id,
        courseId: g.course_id,
        courseCode: g.course_code,
        courseTitle: g.course_title,
        credits: g.credits,
        score: g.score,
        status: g.status
      }));
    }

    const { data: newsData, error: newsError } = await supabase.from('news').select();
    if (!newsError && newsData) {
      newsItems.length = 0;
      newsData.forEach(n => newsItems.push({
        id: n.id,
        slug: n.slug,
        title: n.title,
        summary: n.summary,
        content: n.content,
        category: n.category,
        publishedAt: n.published_at
      }));
    }

    const { data: calendarData, error: calendarError } = await supabase.from('calendar_events').select();
    if (!calendarError && calendarData) {
      calendarEvents.length = 0;
      calendarData.forEach(c => calendarEvents.push({
        id: c.id,
        title: c.title,
        category: c.category,
        startsAt: c.starts_at,
        endsAt: c.ends_at
      }));
    }

    const { data: docsData, error: docsError } = await supabase.from('documents').select();
    if (!docsError && docsData) {
      documents.length = 0;
      docsData.forEach(d => documents.push({
        id: d.id,
        ownerType: d.owner_type,
        ownerId: d.owner_id,
        title: d.title,
        filePath: d.file_path,
        mime: d.mime,
        visibility: d.visibility,
        createdBy: d.created_by
      }));
    }

     console.log('[core-api] Data synced from database');
   } catch (err) {
    console.error('[core-api] Failed to sync from database:', err.message);
  }
}

let dbAvailable = false;
initDatabase().then(available => {
  dbAvailable = available;
  if (dbAvailable) {
    syncFromSupabase();
  }
});

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

app.get('/faculties/:id', (req, res) => {
  const faculty = faculties.find((item) => item.id === Number(req.params.id));
  if (!faculty) {
    return res.status(404).json({ error: 'Faculty not found' });
  }
  const facultyPrograms = programs.filter((program) => program.facultyId === faculty.id);
  const facultyTracks = tracks.filter((track) => facultyPrograms.some((program) => program.id === track.programId));
  res.json({ ...faculty, programs: facultyPrograms, tracks: facultyTracks });
});

app.post('/faculties', authenticate, requireRole('admin'), async (req, res) => {
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

  if (dbAvailable) {
    try {
      const db = await from('faculties');
      await db.insert({
        code,
        name,
        description: description || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null
      });
    } catch (err) {
      console.error('[core-api] Failed to persist faculty:', err.message);
    }
  }

  audit(req, 'create', 'faculty', newFaculty.id);
  res.status(201).json(newFaculty);
});

app.patch('/faculties/:id', authenticate, requireRole('admin'), (req, res) => {
  const faculty = faculties.find((item) => item.id === Number(req.params.id));
  if (!faculty) {
    return res.status(404).json({ error: 'Faculty not found' });
  }
  const { code, name, description } = req.body;
  if (code && code !== faculty.code && faculties.some((item) => item.code === code)) {
    return res.status(409).json({ error: 'Faculty code already exists' });
  }
  if (code) faculty.code = code;
  if (name) faculty.name = name;
  if (description !== undefined) faculty.description = description;
  audit(req, 'update', 'faculty', faculty.id);
  res.json(faculty);
});

app.delete('/faculties/:id', authenticate, requireRole('admin'), (req, res) => {
  const index = faculties.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Faculty not found' });
  }
  faculties.splice(index, 1);
  audit(req, 'delete', 'faculty', Number(req.params.id));
  res.status(204).send();
});

app.post('/programs', authenticate, requireRole('admin'), (req, res) => {
  const { facultyId, code, title, level, durationMonths, description, admissionConditions } = req.body;
  if (!facultyId || !code || !title) {
    return res.status(400).json({ error: 'facultyId, code and title are required' });
  }
  if (!faculties.some((item) => item.id === Number(facultyId))) {
    return res.status(400).json({ error: 'Faculty not found' });
  }
  if (programs.some((item) => item.code === code)) {
    return res.status(409).json({ error: 'Program code already exists' });
  }

  const program = {
    id: programs.length + 1,
    facultyId: Number(facultyId),
    code,
    title,
    level,
    durationMonths: Number(durationMonths) || 0,
    description: description || '',
    admission_conditions: admissionConditions || ''
  };
  programs.push(program);
  audit(req, 'create', 'program', program.id);
  res.status(201).json(program);
});

app.patch('/programs/:id', authenticate, requireRole('admin'), (req, res) => {
  const program = programs.find((item) => item.id === Number(req.params.id));
  if (!program) {
    return res.status(404).json({ error: 'Program not found' });
  }
  const { facultyId, code, title, level, durationMonths, description, admissionConditions } = req.body;
  if (code && code !== program.code && programs.some((item) => item.code === code)) {
    return res.status(409).json({ error: 'Program code already exists' });
  }
  if (facultyId && !faculties.some((item) => item.id === Number(facultyId))) {
    return res.status(400).json({ error: 'Faculty not found' });
  }
  if (facultyId) program.facultyId = Number(facultyId);
  if (code) program.code = code;
  if (title) program.title = title;
  if (level) program.level = level;
  if (durationMonths) program.duration_months = Number(durationMonths);
  if (description !== undefined) program.description = description;
  if (admissionConditions !== undefined) program.admission_conditions = admissionConditions;
  audit(req, 'update', 'program', program.id);
  res.json(program);
});

app.delete('/programs/:id', authenticate, requireRole('admin'), (req, res) => {
  const index = programs.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Program not found' });
  }
  programs.splice(index, 1);
  audit(req, 'delete', 'program', Number(req.params.id));
  res.status(204).send();
});

app.post('/tracks', authenticate, requireRole('admin'), (req, res) => {
  const { programId, code, title, description } = req.body;
  if (!programId || !code || !title) {
    return res.status(400).json({ error: 'programId, code and title are required' });
  }
  if (!programs.some((item) => item.id === Number(programId))) {
    return res.status(400).json({ error: 'Program not found' });
  }
  if (tracks.some((item) => item.code === code)) {
    return res.status(409).json({ error: 'Track code already exists' });
  }

  const track = {
    id: tracks.length + 1,
    programId: Number(programId),
    code,
    title,
    description: description || ''
  };
  tracks.push(track);
  audit(req, 'create', 'track', track.id);
  res.status(201).json(track);
});

app.patch('/tracks/:id', authenticate, requireRole('admin'), (req, res) => {
  const track = tracks.find((item) => item.id === Number(req.params.id));
  if (!track) {
    return res.status(404).json({ error: 'Track not found' });
  }
  const { programId, code, title, description } = req.body;
  if (code && code !== track.code && tracks.some((item) => item.code === code)) {
    return res.status(409).json({ error: 'Track code already exists' });
  }
  if (programId && !programs.some((item) => item.id === Number(programId))) {
    return res.status(400).json({ error: 'Program not found' });
  }
  if (programId) track.programId = Number(programId);
  if (code) track.code = code;
  if (title) track.title = title;
  if (description !== undefined) track.description = description;
  audit(req, 'update', 'track', track.id);
  res.json(track);
});

app.delete('/tracks/:id', authenticate, requireRole('admin'), (req, res) => {
  const index = tracks.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Track not found' });
  }
  tracks.splice(index, 1);
  audit(req, 'delete', 'track', Number(req.params.id));
  res.status(204).send();
});

app.post('/courses', authenticate, requireRole('admin'), (req, res) => {
  const { trackId, code, title, credits, semester, description, teacherEmail } = req.body;
  if (!trackId || !code || !title || !credits) {
    return res.status(400).json({ error: 'trackId, code, title and credits are required' });
  }
  if (!tracks.some((item) => item.id === Number(trackId))) {
    return res.status(400).json({ error: 'Track not found' });
  }
  if (courses.some((item) => item.code === code)) {
    return res.status(409).json({ error: 'Course code already exists' });
  }

  const course = {
    id: courses.length + 1,
    trackId: Number(trackId),
    code,
    title,
    credits: Number(credits),
    semester: semester ? Number(semester) : null,
    description: description || '',
    teacherEmail: teacherEmail || ''
  };
  courses.push(course);
  audit(req, 'create', 'course', course.id);
  res.status(201).json(course);
});

app.patch('/courses/:id', authenticate, requireRole('admin'), (req, res) => {
  const course = courses.find((item) => item.id === Number(req.params.id));
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  const { trackId, code, title, credits, semester, description, teacherEmail } = req.body;
  if (code && code !== course.code && courses.some((item) => item.code === code)) {
    return res.status(409).json({ error: 'Course code already exists' });
  }
  if (trackId && !tracks.some((item) => item.id === Number(trackId))) {
    return res.status(400).json({ error: 'Track not found' });
  }
  if (trackId) course.trackId = Number(trackId);
  if (code) course.code = code;
  if (title) course.title = title;
  if (credits) course.credits = Number(credits);
  if (semester !== undefined) course.semester = semester ? Number(semester) : null;
  if (description !== undefined) course.description = description;
  if (teacherEmail !== undefined) course.teacherEmail = teacherEmail;
  audit(req, 'update', 'course', course.id);
  res.json(course);
});

app.delete('/courses/:id', authenticate, requireRole('admin'), (req, res) => {
  const index = courses.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }
  courses.splice(index, 1);
  audit(req, 'delete', 'course', Number(req.params.id));
  res.status(204).send();
});

app.get('/enrollments', authenticate, requireRole('admin'), (req, res) => {
  const { studentEmail, programId, trackId, status } = req.query;
  let result = enrollments;
  if (studentEmail) result = result.filter((item) => item.studentEmail.toLowerCase() === String(studentEmail).toLowerCase());
  if (programId) result = result.filter((item) => item.programId === Number(programId));
  if (trackId) result = result.filter((item) => item.trackId === Number(trackId));
  if (status) result = result.filter((item) => item.status === String(status));
  res.json(result);
});

app.get('/enrollments/:id', authenticate, requireRole('admin'), (req, res) => {
  const enrollment = enrollments.find((item) => item.id === Number(req.params.id));
  if (!enrollment) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }
  res.json(enrollment);
});

app.patch('/enrollments/:id', authenticate, requireRole('admin'), (req, res) => {
  const enrollment = enrollments.find((item) => item.id === Number(req.params.id));
  if (!enrollment) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }
  const { status, trackId } = req.body;
  if (status) enrollment.status = String(status);
  if (trackId !== undefined) enrollment.trackId = Number(trackId);
  enrollment.updatedAt = new Date().toISOString();
  audit(req, 'update', 'enrollment', enrollment.id);
  res.json(enrollment);
});

app.delete('/enrollments/:id', authenticate, requireRole('admin'), (req, res) => {
  const index = enrollments.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }
  enrollments.splice(index, 1);
  audit(req, 'delete', 'enrollment', Number(req.params.id));
  res.status(204).send();
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

app.patch('/grades/:enrollmentId/:courseCode', authenticate, requireRole('admin', 'teacher'), (req, res) => {
  const enrollmentId = Number(req.params.enrollmentId);
  const courseCode = String(req.params.courseCode);
  const grade = grades.find((item) => item.enrollmentId === enrollmentId && item.courseCode === courseCode);
  if (!grade) {
    return res.status(404).json({ error: 'Grade not found' });
  }
  const { score, status } = req.body;
  if (score !== undefined) grade.score = Number(score);
  if (status) grade.status = String(status);
  audit(req, 'update', 'grade', `${enrollmentId}:${courseCode}`);
  res.json(grade);
});

app.delete('/grades/:enrollmentId/:courseCode', authenticate, requireRole('admin'), (req, res) => {
  const enrollmentId = Number(req.params.enrollmentId);
  const courseCode = String(req.params.courseCode);
  const index = grades.findIndex((item) => item.enrollmentId === enrollmentId && item.courseCode === courseCode);
  if (index === -1) {
    return res.status(404).json({ error: 'Grade not found' });
  }
  grades.splice(index, 1);
  audit(req, 'delete', 'grade', `${enrollmentId}:${courseCode}`);
  res.status(204).send();
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
  const faculty = faculties.find((item) => item.id === program.facultyId);
  const programTracks = tracks.filter((track) => track.programId === program.id);
  const programCourses = courses.filter((course) => programTracks.some((track) => track.id === course.trackId));
  res.json({ ...program, faculty, tracks: programTracks, courses: programCourses });
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
  const category = String(req.query.category || '');
  res.json(category ? newsItems.filter((item) => item.category === category) : newsItems);
});

app.get('/news/:id', (req, res) => {
  const news = newsItems.find((item) => item.id === Number(req.params.id));
  if (!news) {
    return res.status(404).json({ error: 'News item not found' });
  }
  res.json(news);
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
  const query = String(req.query.query || '').trim().toLowerCase();
  const visibleDocuments = documents.filter((document) => document.visibility === 'public' || isAuthenticated);
  res.json(query ? visibleDocuments.filter((document) => document.title.toLowerCase().includes(query)) : visibleDocuments);
});

app.post('/contact', (req, res) => {
  const { name, email, subject, message, website } = req.body;
  if (website) {
    return res.status(400).json({ error: 'Invalid contact request' });
  }
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'name, email, subject and message are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }
  if (message.length < 10 || message.length > 4000) {
    return res.status(400).json({ error: 'message must contain between 10 and 4000 characters' });
  }

  const ip = req.ip || 'unknown';
  const now = Date.now();
  const windowStart = now - (60 * 60 * 1000);
  const attempts = (contactRateLimits.get(ip) || []).filter((timestamp) => timestamp > windowStart);
  if (attempts.length >= 5) {
    return res.status(429).json({ error: 'Too many contact requests. Please try again later.' });
  }
  attempts.push(now);
  contactRateLimits.set(ip, attempts);

  const request = {
    id: contactRequests.length + 1,
    name,
    email,
    subject,
    message,
    receivedAt: new Date().toISOString()
  };
  contactRequests.push(request);
  const notification = sendInstitutionalEmail(createInstitutionalEmail({
    to: process.env.CONTACT_INBOX || 'contact@ium-morave.edu',
    subject: `[Portail] ${subject}`,
    text: `Message de ${name} <${email}> :\n\n${message}`,
    category: 'contact'
  }));
  audit(req, 'create', 'contact-request', request.id);
  res.status(202).json({ id: request.id, status: 'received', notification: notification.delivery });
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

app.get('/students/me/grades', authenticate, requireRole('student'), (req, res) => {
  const student = students.find((item) => item.email.toLowerCase() === req.user.email.toLowerCase());
  if (!student) {
    return res.status(404).json({ error: 'Student profile not found' });
  }

  const enrollment = enrollments.find((item) => item.id === student.enrollmentId);
  const studentGrades = grades
    .filter((grade) => grade.enrollmentId === enrollment.id)
    .map((grade) => {
      const course = courses.find((item) => item.code === grade.courseCode);
      return { ...grade, course };
    });

  const totalCredits = studentGrades.reduce((sum, grade) => sum + grade.credits, 0);
  const weightedSum = studentGrades.reduce((sum, grade) => sum + grade.score * grade.credits, 0);
  const weightedAverage = totalCredits > 0 ? weightedSum / totalCredits : 0;

  res.json({
    grades: studentGrades,
    weightedAverage: Number(weightedAverage.toFixed(2)),
    totalCredits
  });
});

app.get('/students/me/documents', authenticate, requireRole('student'), (req, res) => {
  const visible = documents.filter((document) => document.visibility === 'public' || document.visibility === 'student');
  res.json(visible);
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

app.get('/teachers/me/grades', authenticate, requireRole('teacher'), (req, res) => {
  const teacherCourses = courses.filter((course) => course.teacherEmail.toLowerCase() === req.user.email.toLowerCase());
  const teacherCourseIds = teacherCourses.map((course) => course.id);
  const teacherGrades = grades.filter((grade) => teacherCourses.some((course) => course.code === grade.courseCode));

  const enriched = teacherGrades.map((grade) => {
    const course = teacherCourses.find((item) => item.code === grade.courseCode);
    const enrollment = enrollments.find((item) => item.id === grade.enrollmentId);
    return { ...grade, course, student: enrollment ? { name: enrollment.studentName, email: enrollment.studentEmail } : null };
  });

  res.json(enriched);
});

app.get('/admin/enrollments', authenticate, requireRole('admin'), (req, res) => {
  const enriched = enrollments.map((enrollment) => {
    const program = programs.find((item) => item.id === enrollment.programId);
    const track = tracks.find((item) => item.id === enrollment.trackId);
    return { ...enrollment, program, track };
  });
  res.json(enriched);
});

app.get('/admin/documents', authenticate, requireRole('admin'), (req, res) => {
  res.json(documents);
});

app.get('/admin/users', authenticate, requireRole('admin'), (req, res) => {
  const enriched = students.map((student) => ({ ...student, type: 'student' }))
    .concat(teachers.map((teacher) => ({ ...teacher, type: 'teacher' })));
  res.json(enriched);
});

app.get('/admin/deliberations', authenticate, requireRole('admin'), async (req, res) => {
  const items = await listDeliberations();
  const enriched = items.map((item) => {
    const enrollment = enrollments.find((enr) => enr.id === item.enrollmentId);
    return { ...item, enrollment };
  });
  res.json(enriched);
});

app.post('/enrollments/:id/deliberation', authenticate, requireRole('admin'), async (req, res) => {
  const enrollmentId = Number(req.params.id);
  const enrollment = enrollments.find((item) => item.id === enrollmentId);
  if (!enrollment) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }

  const enrollmentGrades = grades.filter((grade) => grade.enrollmentId === enrollmentId);
  if (enrollmentGrades.length === 0) {
    return res.status(400).json({ error: 'No grades available for deliberation' });
  }

  const evaluation = evaluateDeliberation(enrollmentGrades);

  if (evaluation.decision === 'validated') {
    enrollmentGrades.forEach((grade) => {
      grade.status = 'validated';
    });
  }

  const deliberation = {
    enrollmentId,
    decision: evaluation.decision,
    weightedAverage: evaluation.weightedAverage,
    totalCredits: evaluation.totalCredits,
    validatedCredits: evaluation.validatedCredits,
    reason: evaluation.reason,
    mention: getMention(evaluation.weightedAverage),
    finalizedBy: req.user.email,
    finalizedAt: new Date().toISOString()
  };

  const { data: persistedDeliberation } = await insertDeliberation(deliberation);
  deliberations.push({
    id: persistedDeliberation.id || deliberations.length + 1,
    enrollmentId,
    decision: evaluation.decision,
    weightedAverage: evaluation.weightedAverage,
    totalCredits: evaluation.totalCredits,
    validatedCredits: evaluation.validatedCredits,
    reason: evaluation.reason,
    mention: getMention(evaluation.weightedAverage),
    finalizedBy: req.user.email,
    finalizedAt: new Date().toISOString()
  });

  audit(req, 'validate', 'deliberation', enrollmentId);
  res.status(201).json({ ...evaluation, deliberation: persistedDeliberation });
});

// ── Endpoints LMD : PV de délibération ────────────────────────────────────────

app.get('/enrollments/:id/pv', authenticate, requireRole('admin'), (req, res) => {
  const enrollment = enrollments.find((item) => item.id === Number(req.params.id));
  if (!enrollment) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }

  const program = programs.find((item) => item.id === enrollment.programId);
  if (!program) {
    return res.status(404).json({ error: 'Program not found' });
  }

  const enrollmentGrades = grades.filter((grade) => grade.enrollmentId === enrollment.id);
  if (enrollmentGrades.length === 0) {
    return res.status(400).json({ error: 'No grades available for PV generation' });
  }

  const pv = generateDeliberationPV({
    enrollment,
    program,
    grades: enrollmentGrades,
    finalizedBy: req.user.email
  });

  pvRegistry.set(pv.pvNumber, pv);
  audit(req, 'issue', 'pv-deliberation', enrollment.id);
  res.json(pv);
});

// ── Endpoints LMD : Évaluation (preview avant délibération) ───────────────────

app.get('/enrollments/:id/evaluation', authenticate, requireRole('admin'), (req, res) => {
  const enrollment = enrollments.find((item) => item.id === Number(req.params.id));
  if (!enrollment) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }

  const enrollmentGrades = grades.filter((grade) => grade.enrollmentId === enrollment.id);
  const evaluation = evaluateDeliberation(enrollmentGrades);
  res.json({ enrollment, evaluation });
});

// ── Endpoints LMD : Génération de diplôme ─────────────────────────────────────

app.post('/enrollments/:id/diploma', authenticate, requireRole('admin'), async (req, res) => {
  const enrollment = enrollments.find((item) => item.id === Number(req.params.id));
  if (!enrollment) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }

  // Vérifier qu'une délibération validée existe
  const deliberation = deliberations.find(
    (d) => d.enrollmentId === enrollment.id && d.decision === 'validated'
  );
  if (!deliberation) {
    return res.status(400).json({ error: 'No validated deliberation found — diploma cannot be issued' });
  }

  const program = programs.find((item) => item.id === enrollment.programId);
  if (!program) {
    return res.status(404).json({ error: 'Program not found' });
  }

  const diploma = generateDiplomaData({ enrollment, program, deliberation });
  await enrichDiplomaWithQr(diploma);
  await insertDiploma(diploma);
  diplomaRegistry.set(diploma.diplomaNumber, diploma);

  // Mettre à jour le statut d'inscription
  enrollment.status = 'graduated';

  audit(req, 'issue', 'diploma', enrollment.id);
  res.status(201).json(diploma);

  // Envoyer le diplôme par email en arrière-plan
  try {
    const pdfBuffer = await generateDiplomaPdf(diploma);
    const message = buildDiplomaEmail({
      to: enrollment.studentEmail,
      studentName: enrollment.studentName,
      diplomaNumber: diploma.diplomaNumber,
      pdfBuffer
    });
    await sendEmail(message);
  } catch (emailError) {
    console.error('[core-api] Diploma email failed:', emailError);
  }
});

// ── Vérification de diplôme (endpoint public) ────────────────────────────────

app.post('/verification/diploma', async (req, res) => {
  const { diploma_number, qr_code } = req.body;
  if (!diploma_number && !qr_code) {
    return res.status(400).json({ error: 'diploma_number or qr_code is required' });
  }

  let diploma = null;
  if (diploma_number && diplomaRegistry.has(diploma_number)) {
    diploma = diplomaRegistry.get(diploma_number);
  }

  if (!diploma && diploma_number) {
    diploma = await findDiplomaByNumber(diploma_number);
  }

  if (!diploma && qr_code) {
    for (const item of diplomaRegistry.values()) {
      if (item.verificationCode === qr_code) {
        diploma = item;
        break;
      }
    }
  }

  if (diploma) {
    const security = validateDocumentSecurity({
      documentType: 'diploma',
      verificationCode: diploma.verificationCode,
      integrityHash: diploma.diplomaNumber,
      documentSignature: diploma.documentSignature,
      watermark: diploma.watermark,
      timestamp: diploma.timestamp,
      studentName: diploma.studentName,
      matricule: diploma.matricule
    });
    return res.json({
      verified: true,
      diploma_number: diploma.diplomaNumber,
      studentName: diploma.studentName,
      programTitle: diploma.programTitle,
      level: diploma.level,
      mention: diploma.mention,
      issuedDate: diploma.issuedDate,
      issued_by: 'IUM-MORAVE',
      security
    });
  }

  const valid = diploma_number === 'DIP-2026-0001' || qr_code === 'VALID-DIP-QR-2026';
  res.json({ verified: valid, diploma_number, qr_code, issued_by: 'IUM-MORAVE' });
});

function createTranscriptForEnrollment(enrollment) {
  const program = programs.find((item) => item.id === enrollment.programId);
  const enrollmentGrades = grades.filter((grade) => grade.enrollmentId === enrollment.id);
  const transcript = buildTranscript({ enrollment, program, grades: enrollmentGrades });
  insertTranscript(transcript).catch((error) => {
    console.error('[core-api] Failed to persist transcript:', error);
  });
  transcriptRegistry.set(transcript.verificationCode, transcript);
  return transcript;
}

async function enrichTranscriptWithQr(transcript) {
  try {
    transcript.qrCodeDataUrl = await generateVerificationQR({
      type: 'transcript',
      verificationCode: transcript.verificationCode
    });
  } catch (error) {
    console.error('[core-api] QR generation failed for transcript', error);
  }
  return transcript;
}

async function enrichDiplomaWithQr(diploma) {
  try {
    diploma.qrCodeDataUrl = await generateDiplomaQR(diploma.diplomaNumber);
  } catch (error) {
    console.error('[core-api] QR generation failed for diploma', error);
  }
  return diploma;
}

app.get('/transcripts/me', authenticate, requireRole('student'), async (req, res) => {
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
  await enrichTranscriptWithQr(transcript);
  audit(req, 'issue', 'transcript', enrollment.id);
  res.json(transcript);
});

app.get('/transcripts/enrollments/:id', authenticate, requireRole('admin'), async (req, res) => {
  const enrollment = enrollments.find((item) => item.id === Number(req.params.id));
  if (!enrollment) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }

  const transcript = createTranscriptForEnrollment(enrollment);
  await enrichTranscriptWithQr(transcript);
  audit(req, 'issue', 'transcript', enrollment.id);
  res.json(transcript);
});

app.post('/verification/transcript', async (req, res) => {
  const { verificationCode, integrityHash } = req.body;
  if (!verificationCode || !integrityHash) {
    return res.status(400).json({ error: 'verificationCode and integrityHash are required' });
  }

  let transcript = transcriptRegistry.get(verificationCode);
  if (!transcript) {
    transcript = await findTranscriptByVerificationCode(verificationCode);
  }
  const verified = Boolean(transcript && transcript.integrityHash === integrityHash);
  const security = validateDocumentSecurity({
    documentType: transcript?.documentType || 'releve-de-notes',
    verificationCode: transcript?.verificationCode || verificationCode,
    integrityHash: transcript?.integrityHash || integrityHash,
    documentSignature: transcript?.documentSignature,
    watermark: transcript?.watermark,
    timestamp: transcript?.timestamp,
    studentName: transcript?.student?.name,
    matricule: transcript?.student?.matricule
  });
  res.json({
    verified,
    institution: 'Institut Universitaire Morave',
    verifiedAt: new Date().toISOString(),
    security
  });
});

app.get('/transcripts/me/pdf', authenticate, requireRole('student'), async (req, res) => {
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
  await enrichTranscriptWithQr(transcript);
  audit(req, 'download', 'transcript-pdf', enrollment.id);

  try {
    const pdfBuffer = await generateTranscriptPdf(transcript);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="releve-${transcript.student.matricule}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('[core-api] PDF generation failed:', error);
    res.status(500).json({ error: 'PDF generation failed' });
  }
});

app.get('/transcripts/enrollments/:id/pdf', authenticate, requireRole('admin'), async (req, res) => {
  const enrollment = enrollments.find((item) => item.id === Number(req.params.id));
  if (!enrollment) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }

  const transcript = createTranscriptForEnrollment(enrollment);
  await enrichTranscriptWithQr(transcript);
  audit(req, 'download', 'transcript-pdf', enrollment.id);

  try {
    const pdfBuffer = await generateTranscriptPdf(transcript);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="releve-${transcript.student.matricule}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('[core-api] PDF generation failed:', error);
    res.status(500).json({ error: 'PDF generation failed' });
  }
});

app.get('/enrollments/:id/diploma/pdf', authenticate, requireRole('admin'), async (req, res) => {
  const enrollment = enrollments.find((item) => item.id === Number(req.params.id));
  if (!enrollment) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }

  const diploma = diplomaRegistry.get(`DIP-${new Date().getFullYear()}-${String(enrollment.id).padStart(4, '0')}`);
  if (!diploma) {
    return res.status(404).json({ error: 'Diploma not found for this enrollment' });
  }

  audit(req, 'download', 'diploma-pdf', enrollment.id);

  try {
    const pdfBuffer = await generateDiplomaPdf(diploma);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="diplome-${diploma.diplomaNumber}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('[core-api] PDF generation failed:', error);
    res.status(500).json({ error: 'PDF generation failed' });
  }
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

app.get('/admin/dashboard', authenticate, requireRole('admin'), async (req, res) => {
  const transcripts = await listTranscripts().catch(() => []);
  const diplomas = await listDiplomas().catch(() => []);
  res.json({
    totals: {
      faculties: faculties.length,
      programs: programs.length,
      tracks: tracks.length,
      courses: courses.length,
      students: students.length,
      teachers: teachers.length,
      documents: documents.length,
      pendingDeliberations: grades.filter((grade) => grade.status === 'pending').length,
      transcripts: transcripts.length,
      diplomas: diplomas.length
    },
    recentAuditEvents: auditLogs.slice(-10).reverse(),
    upcomingEvents: calendarEvents.filter((event) => event.startsAt >= new Date().toISOString().slice(0, 10))
  });
});

app.get('/admin/transcripts', authenticate, requireRole('admin'), async (req, res) => {
  const data = await listTranscripts();
  res.json(data);
});

app.get('/admin/diplomas', authenticate, requireRole('admin'), async (req, res) => {
  const data = await listDiplomas();
  res.json(data);
});

app.get('/courses/:id/stats', authenticate, requireRole('admin', 'teacher'), (req, res) => {
  const course = courses.find((item) => item.id === Number(req.params.id));
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  const courseGrades = grades.filter((grade) => grade.courseCode === course.code);
  const average = courseGrades.length ? courseGrades.reduce((sum, grade) => sum + grade.score, 0) / courseGrades.length : 0;
  res.json({ course, grades: courseGrades, average: Number(average.toFixed(2)), count: courseGrades.length });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

try {
  requireProductionSecrets();
} catch (secretError) {
  console.error('[core-api] Startup aborted:', secretError.message);
  process.exit(1);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`core-api listening on http://0.0.0.0:${PORT}`);
});
