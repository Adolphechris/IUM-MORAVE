const request = require('supertest');
const app = require('../src/index.js');

describe('Notification Service', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  it('should list notification templates', async () => {
    const res = await request(app).get('/templates');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should send a notification by template', async () => {
    const res = await request(app)
      .post('/send/grade_published')
      .send({ recipient: 'student@example.com', data: { studentName: 'Jean', courseTitle: 'Math', score: 16 } });
    expect(res.status).toBe(201);
    expect(res.body.recipient).toBe('student@example.com');
    expect(res.body.status).toBe('sent');
  });

  it('should send bulk notifications', async () => {
    const res = await request(app)
      .post('/send-bulk/financial_reminder')
      .send({ recipients: ['a@example.com', 'b@example.com'], data: { studentName: 'Test', amount: 1500000 } });
    expect(res.status).toBe(201);
    expect(res.body.length).toBe(2);
  });

  it('should return 404 for unknown template', async () => {
    const res = await request(app).get('/templates/unknown');
    expect(res.status).toBe(404);
  });
});
