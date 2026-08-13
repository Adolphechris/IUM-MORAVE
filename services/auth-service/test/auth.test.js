const { spawn } = require('child_process');
const { once } = require('events');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const port = 4101;
const baseUrl = `http://127.0.0.1:${port}`;
let service;

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
  throw new Error('auth-service did not start');
}

test.before(async () => {
  try {
    const { execSync } = require('child_process');
    execSync(`fuser -k ${port}/tcp 2>/dev/null || true`);
  } catch {}
  service = spawn('node', ['src/index.js'], {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, NODE_ENV: 'test', PORT: String(port), JWT_SECRET: 'test-auth-secret' },
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

test('registers a student without allowing privilege escalation', async () => {
  const response = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@example.test',
      password: 'A-strong-password-2026',
      role: 'admin',
      firstName: 'Student',
      lastName: 'Test'
    })
  });
  const result = await response.json();

  assert.equal(response.status, 201);
  assert.equal(result.user.role, 'student');
  assert.ok(result.token);
});

test('authenticates the bootstrap administrator and protects the profile route', async () => {
  const login = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ium-morave.edu', password: 'ChangeMe123!' })
  });
  const session = await login.json();

  assert.equal(login.status, 200);
  const profile = await fetch(`${baseUrl}/auth/profile`, {
    headers: { Authorization: `Bearer ${session.token}` }
  });
  const result = await profile.json();
  assert.equal(profile.status, 200);
  assert.equal(result.user.email, 'admin@ium-morave.edu');
});

test('lets an administrator provision a teacher account', async () => {
  const login = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ium-morave.edu', password: 'ChangeMe123!' })
  });
  const session = await login.json();

  const response = await fetch(`${baseUrl}/auth/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`
    },
    body: JSON.stringify({
      email: 'teacher@example.test',
      password: 'A-strong-password-2026',
      role: 'teacher',
      firstName: 'Teacher',
      lastName: 'Test'
    })
  });
  const result = await response.json();

  assert.equal(response.status, 201);
  assert.equal(result.user.role, 'teacher');
});

test('revokes access after logout and rejects blacklisted token', async () => {
  const login = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ium-morave.edu', password: 'ChangeMe123!' })
  });
  const session = await login.json();

  const logout = await fetch(`${baseUrl}/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.token}` }
  });
  assert.equal(logout.status, 200);

  const profile = await fetch(`${baseUrl}/auth/profile`, {
    headers: { Authorization: `Bearer ${session.token}` }
  });
  assert.equal(profile.status, 401);
});

test('resets password via forgot and reset flow', async () => {
  const forgot = await fetch(`${baseUrl}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ium-morave.edu' })
  });
  assert.equal(forgot.status, 200);
  const forgotResult = await forgot.json();
  assert.ok(forgotResult.resetToken);

  const reset = await fetch(`${baseUrl}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: forgotResult.resetToken, password: 'NewStrongPass123!' })
  });
  assert.equal(reset.status, 200);

  const login = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ium-morave.edu', password: 'NewStrongPass123!' })
  });
  assert.equal(login.status, 200);
});

test('rejects non-admin access to admin-only user list', async () => {
  const studentLogin = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student@example.test', password: 'A-strong-password-2026' })
  });
  const studentSession = await studentLogin.json();

  const users = await fetch(`${baseUrl}/auth/users`, {
    headers: { Authorization: `Bearer ${studentSession.token}` }
  });
  assert.equal(users.status, 403);
});
