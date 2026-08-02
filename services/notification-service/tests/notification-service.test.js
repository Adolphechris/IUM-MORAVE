const { spawn } = require('child_process');
const test = require('node:test');
const assert = require('node:assert/strict');

const port = 4104;
const baseUrl = `http://127.0.0.1:${port}`;
let service;

async function waitForHealth() {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return;
    } catch {
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Service did not become healthy in time');
}

test.before(async () => {
  service = spawn(process.execPath, ['src/index.js'], {
    cwd: __dirname + '/..',
    env: { ...process.env, PORT: port }
  });
  service.stdout.on('data', () => {});
  service.stderr.on('data', () => {});
  await waitForHealth();
});

test.after(() => {
  if (service) service.kill();
});

test('GET /health returns OK status', async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.status, 'OK');
});

test('GET /templates returns array', async () => {
  const response = await fetch(`${baseUrl}/templates`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(Array.isArray(body), true);
  assert.ok(body.length > 0);
});

test('POST /send/:templateId sends notification', async () => {
  const response = await fetch(`${baseUrl}/send/grade_published`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipient: 'student@example.com', data: { studentName: 'Jean', courseTitle: 'Math', score: 16 } })
  });
  assert.equal(response.status, 201);
  const body = await response.json();
  assert.equal(body.recipient, 'student@example.com');
  assert.equal(body.status, 'sent');
});

test('POST /send-bulk/:templateId sends bulk notifications', async () => {
  const response = await fetch(`${baseUrl}/send-bulk/financial_reminder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipients: ['a@example.com', 'b@example.com'], data: { studentName: 'Test', amount: 1500000 } })
  });
  assert.equal(response.status, 201);
  const body = await response.json();
  assert.equal(body.length, 2);
});

test('GET /notifications returns history', async () => {
  const response = await fetch(`${baseUrl}/notifications`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(Array.isArray(body), true);
});
