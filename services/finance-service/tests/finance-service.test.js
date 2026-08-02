const { spawn } = require('child_process');
const { once } = require('events');
const test = require('node:test');
const assert = require('node:assert/strict');

const port = 4103;
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

test('GET /payment-plans returns array', async () => {
  const response = await fetch(`${baseUrl}/payment-plans`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(Array.isArray(body), true);
});

test('POST /payment-plans creates a plan', async () => {
  const response = await fetch(`${baseUrl}/payment-plans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId: 1, totalAmount: 1500000, installments: 2 })
  });
  assert.equal(response.status, 201);
  const body = await response.json();
  assert.equal(body.studentId, 1);
  assert.equal(body.totalAmount, 1500000);
});

test('POST /payments processes a payment', async () => {
  const plansRes = await fetch(`${baseUrl}/payment-plans`);
  const plans = await plansRes.json();
  const plan = plans[plans.length - 1];

  const response = await fetch(`${baseUrl}/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentPlanId: plan.id, amount: 750000, method: 'mobile' })
  });
  assert.equal(response.status, 201);
  const body = await response.json();
  assert.ok(body.receiptNumber);
});

test('GET /student-status/:id returns status', async () => {
  const response = await fetch(`${baseUrl}/student-status/1`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.ok('hasFinancialHold' in body);
});

test('POST /send/:templateId on unknown template returns 404', async () => {
  const response = await fetch(`${baseUrl}/send/unknown`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipient: 'test@example.com' })
  });
  assert.equal(response.status, 404);
});
