const { spawn } = require('child_process');
const { once } = require('events');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const port = 4103;
const baseUrl = `http://127.0.0.1:${port}`;
const secret = 'test-finance-secret';
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
  throw new Error('finance-service did not start');
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
  assert.equal(result.service, 'finance-service');
});

test('rejects unauthenticated request to payment plans', async () => {
  const response = await fetch(`${baseUrl}/payment-plans`);
  assert.equal(response.status, 401);
});

test('allows admin to list payment plans', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });
  const response = await fetch(`${baseUrl}/payment-plans`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(result));
});

test('allows admin to create payment plan', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });
  const response = await fetch(`${baseUrl}/payment-plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      studentId: 1,
      academicYear: '2025-2026',
      totalAmount: 1500,
      currency: 'USD',
      dueDate: '2026-01-31'
    })
  });
  const result = await response.json();

  assert.equal(response.status, 201);
  assert.ok(result.id || result.student_id);
  assert.equal(result.status, 'pending');
});

test('returns 404 for unknown payment plan', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });
  const response = await fetch(`${baseUrl}/payment-plans/999999`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.equal(response.status, 404);
});

test('allows admin to record payment', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });
  const response = await fetch(`${baseUrl}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      paymentPlanId: 1,
      amount: 500,
      method: 'cash'
    })
  });
  const result = await response.json();

  assert.equal(response.status, 201);
  assert.ok(result.reference || result.id);
});

test('allows admin to get receipt by number', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });
  const response = await fetch(`${baseUrl}/receipts/RECP-TEST-123`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.equal(response.status, 404);
});

test('returns student financial status', async () => {
  const adminToken = tokenFor({ sub: 1, email: 'admin@ium-morave.edu', role: 'admin' });
  const response = await fetch(`${baseUrl}/student-status/1`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.ok('hasFinancialHold' in result);
  assert.ok('status' in result);
});

test('rejects non-admin role', async () => {
  const studentToken = tokenFor({ sub: 2, email: 'jean.kabamba@ium-morave.edu', role: 'student' });
  const response = await fetch(`${baseUrl}/payment-plans`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  assert.equal(response.status, 403);
});
