const { spawn } = require('child_process');
const { once } = require('events');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const port = 4102;
const baseUrl = `http://127.0.0.1:${port}`;
const secret = 'test-core-api-secret';
let service;

function tokenFor(payload) {
  return jwt.sign(payload, secret, { expiresIn: '5m' });
}

async function waitForHealth() {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return;
    } catch {
      // The service has not started yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('core-api did not start');
}

test.before(async () => {
  service = spawn('node', ['src/index.js'], {
    cwd: path.resolve(__dirname, '..'),
    env: {
      ...process.env,
      NODE_ENV: 'test',
      PORT: String(port),
      JWT_SECRET: secret,
      TRANSCRIPT_SIGNING_SECRET: 'test-transcript-secret'
    },
    stdio: 'ignore'
  });
  await waitForHealth();
});

test.after(async () => {
  service.kill();
  await once(service, 'exit');
});

test('returns public academic data and filters programs by level', async () => {
  const response = await fetch(`${baseUrl}/programs?level=licence`);
  const programs = await response.json();

  assert.equal(response.status, 200);
  assert.equal(programs.length, 2);
  assert.equal(programs[0].code, 'LIC-SINT');
  assert.equal(programs.some((program) => program.code === 'MST-IA'), false);
});

test('returns public faculty details with programs and specialties', async () => {
  const response = await fetch(`${baseUrl}/faculties/1`);
  const faculty = await response.json();

  assert.equal(response.status, 200);
  assert.equal(faculty.code, 'FSINT');
  assert.ok(faculty.programs.length > 0);
  assert.ok(faculty.tracks.length > 0);
});

test('accepts a valid contact request and rejects malformed requests', async () => {
  const rejected = await fetch(`${baseUrl}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email: 'invalid', subject: 'Question', message: 'Message correct' })
  });
  assert.equal(rejected.status, 400);

  const accepted = await fetch(`${baseUrl}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      email: 'test@example.test',
      subject: 'Question institutionnelle',
      message: 'Je souhaite recevoir des informations sur les admissions.'
    })
  });
  const result = await accepted.json();
  assert.equal(accepted.status, 202);
  assert.equal(result.status, 'received');
});

test('requires an admin token to create a faculty', async () => {
  const denied = await fetch(`${baseUrl}/faculties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'FLSH', name: 'Lettres et Sciences Humaines' })
  });
  assert.equal(denied.status, 401);

  const created = await fetch(`${baseUrl}/faculties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' })}`
    },
    body: JSON.stringify({ code: 'FLSH', name: 'Lettres et Sciences Humaines' })
  });
  assert.equal(created.status, 201);
});

test('issues and verifies a signed student transcript', async () => {
  const studentToken = tokenFor({
    sub: 2,
    email: 'jean.kabamba@ium-morave.edu',
    role: 'student',
    enrollmentId: 1
  });
  const issued = await fetch(`${baseUrl}/transcripts/me`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const transcript = await issued.json();

  assert.equal(issued.status, 200);
  assert.equal(transcript.documentType, 'releve-de-notes');
  assert.ok(transcript.integrityHash);

  const verification = await fetch(`${baseUrl}/verification/transcript`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      verificationCode: transcript.verificationCode,
      integrityHash: transcript.integrityHash
    })
  });
  const result = await verification.json();
  assert.equal(result.verified, true);
});

test('provides a protected administration dashboard', async () => {
  const response = await fetch(`${baseUrl}/admin/dashboard`, {
    headers: {
      Authorization: `Bearer ${tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' })}`
    }
  });
  const dashboard = await response.json();

  assert.equal(response.status, 200);
  assert.ok(dashboard.totals.faculties >= 2);
  assert.equal(dashboard.totals.courses, 4);
});

test('returns grades and computed average for a student', async () => {
  const studentToken = tokenFor({
    sub: 2,
    email: 'jean.kabamba@ium-morave.edu',
    role: 'student',
    enrollmentId: 1
  });
  const response = await fetch(`${baseUrl}/students/me/grades`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(result.grades));
  assert.ok(typeof result.weightedAverage === 'number');
  assert.ok(result.totalCredits >= 0);
});

test('returns grades taught by the authenticated teacher', async () => {
  const teacherToken = tokenFor({
    sub: 1,
    email: 'professeur@ium-morave.edu',
    role: 'teacher'
  });
  const response = await fetch(`${baseUrl}/teachers/me/grades`, {
    headers: { Authorization: `Bearer ${teacherToken}` }
  });
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(result));
  assert.ok(result.some((grade) => grade.student));
});

test('returns enrollments for admin', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });
  const response = await fetch(`${baseUrl}/admin/enrollments`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(result));
  assert.ok(result[0].program);
});

test('returns documents for admin', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });
  const response = await fetch(`${baseUrl}/admin/documents`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(result));
  assert.ok(result.some((document) => document.title));
});

test('returns users for admin', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });
  const response = await fetch(`${baseUrl}/admin/users`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(result));
  assert.ok(result.some((user) => user.type === 'student' || user.type === 'teacher'));
});

test('returns deliberations for admin', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });
  const response = await fetch(`${baseUrl}/admin/deliberations`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(result));
});

test('allows admin to create and update academic catalog', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });

  const faculty = await fetch(`${baseUrl}/faculties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ code: 'FLSH', name: 'Lettres et Sciences Humaines' })
  });
  assert.equal(faculty.status, 201);
  const facultyData = await faculty.json();

  const program = await fetch(`${baseUrl}/programs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ facultyId: facultyData.id, code: 'LIC-LSH', title: 'Licence Lettres', level: 'licence', durationMonths: 36 })
  });
  assert.equal(program.status, 201);

  const updated = await fetch(`${baseUrl}/faculties/${facultyData.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ description: 'Nouvelle description' })
  });
  assert.equal(updated.status, 200);
  const updatedData = await updated.json();
  assert.equal(updatedData.description, 'Nouvelle description');
});

test('allows admin to create enrollment and grade', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });
  const enrollment = await fetch(`${baseUrl}/enrollments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ studentEmail: 'student@example.test', studentName: 'Test Student', matricule: 'IUM/2025/0099', programId: 1, academicYear: 2025 })
  });
  assert.equal(enrollment.status, 201);
  const enrollmentData = await enrollment.json();

  const grade = await fetch(`${baseUrl}/enrollments/${enrollmentData.id}/grades`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ courseCode: 'SINT101', courseTitle: 'Algorithmique', credits: 6, score: 16 })
  });
  assert.equal(grade.status, 201);
});

test('allows admin to deliberate and compute weighted average', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });
  const deliberation = await fetch(`${baseUrl}/enrollments/1/deliberation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    }
  });
  assert.equal(deliberation.status, 201);
  const deliberationData = await deliberation.json();
  assert.ok(['validated', 'rejected'].includes(deliberationData.decision));
  assert.ok(typeof deliberationData.weightedAverage === 'number');
});

test('returns course stats for authenticated user', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });
  const response = await fetch(`${baseUrl}/courses/1/stats`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.ok(result.course);
  assert.ok(typeof result.average === 'number');
});
