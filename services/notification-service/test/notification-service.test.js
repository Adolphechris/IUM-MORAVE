const { spawn } = require('child_process');
const { once } = require('events');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const port = 4104;
const baseUrl = `http://127.0.0.1:${port}`;
const secret = 'test-notification-secret';
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
  throw new Error('notification-service did not start');
}

test.before(async () => {
  try {
    const { execSync } = require('child_process');
    execSync(`fuser -k ${port}/tcp 2>/dev/null || true`);
  } catch {}
  service = spawn('node', ['src/index.js'], {
    cwd: path.resolve(__dirname, '..'),
    env: {
      ...process.env,
      NODE_ENV: 'test',
      PORT: String(port),
      JWT_SECRET: secret,
      CORS_ORIGIN: 'http://localhost:3000'
    },
    stdio: 'ignore'
  });
  await waitForHealth();
});

test.after(async () => {
  if (service && !service.killed) {
    service.kill('SIGKILL');
  }
  try {
    const { execSync } = require('child_process');
    execSync(`fuser -k ${port}/tcp 2>/dev/null || true`);
  } catch {}
});

test('returns health status', async () => {
  const response = await fetch(`${baseUrl}/health`);
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.equal(result.status, 'OK');
  assert.equal(result.service, 'notification-service');
});

test('rejects unauthenticated request to templates', async () => {
  const response = await fetch(`${baseUrl}/templates`);
  assert.equal(response.status, 401);
});

test('allows admin to list templates', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });
  const response = await fetch(`${baseUrl}/templates`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(result));
});

test('allows admin to get template by id', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });
  const response = await fetch(`${baseUrl}/templates/grade_published`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.equal(result.id, 'grade_published');
});

test('allows admin to send notification', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });
  const response = await fetch(`${baseUrl}/send/grade_published`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      recipient: 'student@example.com',
      data: { studentName: 'Jean', courseTitle: 'Math', score: 14 }
    })
  });
  const result = await response.json();

  assert.equal(response.status, 201);
  assert.equal(result.status, 'sent');
});

test('allows admin to send bulk notifications', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });
  const response = await fetch(`${baseUrl}/send-bulk/financial_reminder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      recipients: ['student1@example.com', 'student2@example.com'],
      data: { studentName: 'Jean', amount: 500 }
    })
  });
  const result = await response.json();

  assert.equal(response.status, 201);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 2);
});

test('allows admin to list notifications', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });
  const response = await fetch(`${baseUrl}/notifications`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(result));
});

test('rejects non-admin role', async () => {
  const studentToken = tokenFor({ sub: 2, email: 'jean.kabamba@ium-morave.edu', role: 'student' });
  const response = await fetch(`${baseUrl}/templates`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  assert.equal(response.status, 403);
});
