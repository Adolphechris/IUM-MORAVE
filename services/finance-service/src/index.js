const express = require('express');
const cors = require('cors');
const { authenticate, requireRole } = require('../../../shared/auth');
const { insertPaymentPlan, findPaymentPlanByStudentId, listPaymentPlans, insertPayment, findReceiptByNumber } = require('./payment-plan-repository');
const { rateLimit } = require('../../../shared/rate-limiter');

const app = express();
const PORT = process.env.PORT || 4003;
const CORE_API_URL = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:4002';

app.use(cors({ origin: process.env.CORS_ORIGIN || 'https://ium-morave.vercel.app' }));
app.use(express.json());

const financeRateLimiter = rateLimit({
  windowMs: 60000,
  max: 120,
  keyGenerator: (req) => req.user?.email || req.ip || 'anonymous'
});

app.get('/health', (req, res) => res.json({ status: 'OK', service: 'finance-service' }));

app.use(authenticate);
app.use(requireRole('admin', 'finance'));
app.use(financeRateLimiter);

app.get('/payment-plans', async (req, res) => {
  const plans = await listPaymentPlans();
  res.json(plans);
});

app.get('/payment-plans/:studentId', async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const plan = await findPaymentPlanByStudentId(studentId);
  if (!plan) return res.status(404).json({ error: 'Plan de paiement introuvable.' });
  res.json(plan);
});

app.post('/payment-plans', async (req, res) => {
  const plan = await insertPaymentPlan({
    ...req.body,
    status: 'pending'
  });
  if (plan.error) return res.status(500).json({ error: plan.error.message || 'Insert failed' });
  res.status(201).json(plan.data);
});

app.post('/payments', async (req, res) => {
  const { paymentPlanId, amount, method } = req.body;
  const plan = await findPaymentPlanByStudentId(paymentPlanId);
  if (!plan) return res.status(404).json({ error: 'Plan de paiement introuvable.' });

  const receiptNumber = `RECP-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const payment = await insertPayment({
    studentId: paymentPlanId,
    planId: paymentPlanId,
    amount,
    method,
    reference: receiptNumber,
    status: 'completed',
    paidAt: new Date().toISOString()
  });

  if (payment.error) return res.status(500).json({ error: payment.error.message || 'Payment failed' });

  const payments = await listPaymentPlans();
  res.status(201).json(payment.data);
});

app.get('/receipts/:receiptNumber', async (req, res) => {
  const receipt = await findReceiptByNumber(req.params.receiptNumber);
  if (!receipt) return res.status(404).json({ error: 'Reçu introuvable.' });
  res.json(receipt);
});

app.get('/student-status/:studentId', async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const plan = await findPaymentPlanByStudentId(studentId);
  if (!plan) {
    return res.json({ hasFinancialHold: false, status: 'no_plan' });
  }
  const hasHold = plan.status !== 'paid' && plan.due_date && new Date(plan.due_date) < new Date();
  res.json({ hasFinancialHold: hasHold, status: plan.status, plan });
});

app.listen(PORT, () => {
  console.log(`Finance Service running on http://localhost:${PORT}`);
});

module.exports = app;
