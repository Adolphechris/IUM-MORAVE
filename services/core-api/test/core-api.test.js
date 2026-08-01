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
