-- Migration 003: backfill columns referenced by 001 + seeds on legacy databases.
-- On an already-initialised legacy schema the tables exist (001 CREATE TABLE
-- IF NOT EXISTS is a no-op NOTICE) but older table definitions are missing
-- columns that 001 and sample_seed.sql assume. This migration is idempotent
-- (ADD COLUMN IF NOT EXISTS / ADD CONSTRAINT IF NOT EXISTS) and is a no-op on
-- fresh schemas where 001 already created these columns.

-- enrollments: sample_seed.sql joins on e.matricule and references a UNIQUE matricule
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS matricule TEXT;
ALTER TABLE enrollments ADD CONSTRAINT IF NOT EXISTS enrollments_matricule_unique UNIQUE (matricule);

-- courses: sample_seed inserts teacher_email; also ensure audit columns exist
ALTER TABLE courses ADD COLUMN IF NOT EXISTS teacher_email TEXT;

-- diplomas: sample_seed inserts verification_code_hash
ALTER TABLE diplomas ADD COLUMN IF NOT EXISTS verification_code_hash TEXT;

-- payments: 001 defines plan_id + reference (UNIQUE); backfill on legacy tables
ALTER TABLE payments ADD COLUMN IF NOT EXISTS plan_id INTEGER;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS reference TEXT;
ALTER TABLE payments ADD CONSTRAINT IF NOT EXISTS payments_reference_unique UNIQUE (reference);
