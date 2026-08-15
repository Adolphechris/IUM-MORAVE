const { from, usePostgres } = require('./db');

async function insertDeliberation(payload) {
  // usePostgres() is synchronous — safe to use without await.
  // initDatabase() is async (returns a Promise) so !initDatabase() is always false.
  if (!usePostgres()) return { data: { id: Date.now(), ...payload }, error: null };
  const db = await from('deliberations');
  const { data } = await db.insert({
    enrollment_id: payload.enrollmentId,
    decision: payload.decision,
    finalized_by: payload.finalizedBy,
    weighted_average: payload.weightedAverage,
    validated_credits: payload.validatedCredits,
    total_credits: payload.totalCredits,
    reason: payload.reason
  });
  return { data: data || { id: Date.now(), ...payload }, error: null };
}

async function listDeliberations() {
  if (!usePostgres()) return [];
  const db = await from('deliberations');
  const { data } = await db.select('id, enrollment_id, decision, finalized_by, finalized_at');
  return (data || []).map((item) => ({
    id: item.id,
    enrollmentId: item.enrollment_id,
    decision: item.decision,
    finalizedBy: item.finalized_by,
    finalizedAt: item.finalized_at
  }));
}

module.exports = {
  insertDeliberation,
  listDeliberations
};
