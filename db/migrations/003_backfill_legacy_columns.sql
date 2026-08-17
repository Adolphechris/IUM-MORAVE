-- enrollments: sample_seed.sql joins on e.matricule and references a UNIQUE matricule
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS matricule TEXT;
-- PostgreSQL does not support ADD CONSTRAINT IF NOT EXISTS before PG 15; use
-- DROP (idempotent) then ADD so the constraint lands on legacy schemas without
-- erroring on already-present constraints.
ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_matricule_unique;
ALTER TABLE enrollments ADD CONSTRAINT enrollments_matricule_unique UNIQUE (matricule);

-- courses: sample_seed inserts teacher_email
ALTER TABLE courses ADD COLUMN IF NOT EXISTS teacher_email TEXT;

-- diplomas: sample_seed inserts verification_code_hash
ALTER TABLE diplomas ADD COLUMN IF NOT EXISTS verification_code_hash TEXT;

-- payments: 001 defines plan_id + reference (UNIQUE). 001's CREATE INDEX runs
-- BEFORE this ADD COLUMN, so recreate the indexes here (after the column exists)
-- to avoid "column does not exist" on legacy payments tables.
ALTER TABLE payments ADD COLUMN IF NOT EXISTS plan_id INTEGER;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS reference TEXT;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_reference_unique;
ALTER TABLE payments ADD CONSTRAINT payments_reference_unique UNIQUE (reference);
DROP INDEX IF EXISTS idx_payments_plan_id;
DROP INDEX IF EXISTS idx_payments_reference;
CREATE INDEX IF NOT EXISTS idx_payments_plan_id ON payments(plan_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);