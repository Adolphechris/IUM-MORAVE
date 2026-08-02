const request = require('supertest');
const app = require('../src/index.js');

describe('Finance Service', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  it('should create a payment plan', async () => {
    const res = await request(app)
      .post('/payment-plans')
      .send({ studentId: 1, totalAmount: 1500000, installments: 2 });
    expect(res.status).toBe(201);
    expect(res.body.studentId).toBe(1);
  });

  it('should list payment plans', async () => {
    const res = await request(app).get('/payment-plans');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should process a payment', async () => {
    const plans = await request(app).get('/payment-plans');
    const plan = plans.body[plans.body.length - 1];
    const res = await request(app)
      .post('/payments')
      .send({ paymentPlanId: plan.id, amount: 750000, method: 'mobile' });
    expect(res.status).toBe(201);
    expect(res.body.receiptNumber).toBeDefined();
  });

  it('should retrieve receipt', async () => {
    const plans = await request(app).get('/payment-plans');
    const plan = plans.body[plans.body.length - 1];
    const payments = await request(app).get(`/payments/${plan.id}`);
    const receipt = payments.body[0];
    const res = await request(app).get(`/receipts/${receipt.receiptNumber}`);
    expect(res.status).toBe(200);
  });
});
