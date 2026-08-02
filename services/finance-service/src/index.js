const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4003;
const CORE_API_URL = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:4002';

app.use(cors({ origin: true }));
app.use(express.json());

let payments = [];
let paymentPlans = [];

app.get('/health', (req, res) => res.json({ status: 'OK', service: 'finance-service' }));

app.get('/payment-plans', (req, res) => {
  res.json(paymentPlans);
});

app.get('/payment-plans/:studentId', (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const plan = paymentPlans.find(p => p.studentId === studentId);
  if (!plan) return res.status(404).json({ error: 'Plan de paiement introuvable.' });
  res.json(plan);
});

app.post('/payment-plans', (req, res) => {
  const plan = {
    id: paymentPlans.length + 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  paymentPlans.push(plan);
  res.status(201).json(plan);
});

app.post('/payments', (req, res) => {
  const { paymentPlanId, amount, method } = req.body;
  const plan = paymentPlans.find(p => p.id === paymentPlanId);
  if (!plan) return res.status(404).json({ error: 'Plan de paiement introuvable.' });

  const payment = {
    id: payments.length + 1,
    paymentPlanId,
    amount,
    method,
    receiptNumber: `RECP-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    status: 'completed',
    paidAt: new Date().toISOString(),
    verified: false
  };
  payments.push(payment);

  const totalPaid = payments
    .filter(p => p.paymentPlanId === paymentPlanId && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  if (totalPaid >= plan.totalAmount) {
    plan.status = 'paid';
  } else if (totalPaid > 0) {
    plan.status = 'partial';
  }

  res.status(201).json(payment);
});

app.get('/receipts/:receiptNumber', (req, res) => {
  const payment = payments.find(p => p.receiptNumber === req.params.receiptNumber);
  if (!payment) return res.status(404).json({ error: 'Reçu introuvable.' });
  res.json(payment);
});

app.get('/student-status/:studentId', (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const plan = paymentPlans.find(p => p.studentId === studentId);
  if (!plan) {
    return res.json({ hasFinancialHold: false, status: 'no_plan' });
  }
  const hasHold = plan.status !== 'paid' && plan.dueDate && new Date(plan.dueDate) < new Date();
  res.json({ hasFinancialHold: hasHold, status: plan.status, plan });
});

app.listen(PORT, () => {
  console.log(`Finance Service running on http://localhost:${PORT}`);
});

module.exports = app;
