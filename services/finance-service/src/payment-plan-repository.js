const { initDatabase } = require('../../../shared/db');

const inMemoryPlans = [];
const inMemoryPayments = [];

function getDb() {
  return initDatabase();
}

async function insertPaymentPlan(payload) {
  try {
    const db = getDb();
    if (db) {
      const { data } = await db.from('payment_plans').insert({
        student_id: payload.studentId,
        academic_year: payload.academicYear,
        total_amount: payload.totalAmount,
        currency: payload.currency || 'USD',
        status: payload.status || 'pending',
        due_date: payload.dueDate,
        metadata: payload.metadata || {}
      }).select().single();
      return { data, error: null };
    }
  } catch (error) {
    // Fallback to in-memory on DB failure/absence
  }

  const newPlan = {
    id: inMemoryPlans.length + 1,
    student_id: payload.studentId,
    academic_year: payload.academicYear,
    total_amount: payload.totalAmount,
    currency: payload.currency || 'USD',
    status: payload.status || 'pending',
    due_date: payload.dueDate,
    metadata: payload.metadata || {}
  };
  inMemoryPlans.push(newPlan);
  return { data: newPlan, error: null };
}

async function findPaymentPlanByStudentId(studentId) {
  try {
    const db = getDb();
    if (db) {
      const { data } = await db.from('payment_plans').select('*').eq('student_id', studentId).maybeSingle();
      if (data) return data;
    }
  } catch (error) {}

  return inMemoryPlans.find(p => p.student_id === Number(studentId) || p.id === Number(studentId)) || null;
}

async function listPaymentPlans() {
  try {
    const db = getDb();
    if (db) {
      const { data } = await db.from('payment_plans').select('*');
      if (data && data.length) return data;
    }
  } catch (error) {}

  return inMemoryPlans;
}

async function insertPayment(payload) {
  try {
    const db = getDb();
    if (db) {
      const { data } = await db.from('payments').insert({
        student_id: payload.studentId,
        plan_id: payload.planId,
        amount: payload.amount,
        currency: payload.currency || 'USD',
        method: payload.method || 'cash',
        reference: payload.reference,
        paid_at: payload.paidAt || new Date().toISOString(),
        metadata: payload.metadata || {}
      }).select().single();
      return { data, error: null };
    }
  } catch (error) {}

  const newPayment = {
    id: inMemoryPayments.length + 1,
    student_id: payload.studentId,
    plan_id: payload.planId,
    amount: payload.amount,
    currency: payload.currency || 'USD',
    method: payload.method || 'cash',
    reference: payload.reference,
    paid_at: payload.paidAt || new Date().toISOString(),
    metadata: payload.metadata || {}
  };
  inMemoryPayments.push(newPayment);

  // Update plan status if matched
  const plan = inMemoryPlans.find(p => p.id === payload.planId || p.student_id === payload.studentId);
  if (plan) {
    plan.status = 'paid';
  }

  return { data: newPayment, error: null };
}

async function findReceiptByNumber(receiptNumber) {
  try {
    const db = getDb();
    if (db) {
      const { data } = await db.from('payments').select('*').eq('reference', receiptNumber).maybeSingle();
      if (data) return data;
    }
  } catch (error) {}

  return inMemoryPayments.find(p => p.reference === receiptNumber) || null;
}

module.exports = {
  insertPaymentPlan,
  findPaymentPlanByStudentId,
  listPaymentPlans,
  insertPayment,
  findReceiptByNumber
};
