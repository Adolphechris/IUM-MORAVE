-- Migration 001: Create initial schema for IUM-MORAVE

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'finance')),
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faculties (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS programs (
  id SERIAL PRIMARY KEY,
  faculty_id INTEGER REFERENCES faculties(id) ON DELETE SET NULL,
  code TEXT UNIQUE,
  title TEXT NOT NULL,
  level TEXT,
  duration_months INTEGER,
  description TEXT,
  admission_conditions TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tracks (
  id SERIAL PRIMARY KEY,
  program_id INTEGER REFERENCES programs(id) ON DELETE CASCADE,
  code TEXT,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  track_id INTEGER REFERENCES tracks(id) ON DELETE SET NULL,
  code TEXT,
  title TEXT NOT NULL,
  credits INTEGER NOT NULL,
  semester INTEGER,
  description TEXT,
  teacher_email TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  program_id INTEGER REFERENCES programs(id),
  track_id INTEGER REFERENCES tracks(id),
  year INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'suspended')),
  matricule TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  owner_type TEXT NOT NULL,
  owner_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  mime TEXT,
  visibility TEXT NOT NULL DEFAULT 'private',
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grades (
  id SERIAL PRIMARY KEY,
  enrollment_id INTEGER REFERENCES enrollments(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
  score NUMERIC(4,2) NOT NULL CHECK (score >= 0 AND score <= 20),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS diplomas (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  program_id INTEGER REFERENCES programs(id),
  diploma_number TEXT UNIQUE NOT NULL,
  issued_date DATE,
  status TEXT NOT NULL DEFAULT 'issued',
  verification_code_hash TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS diploma_verifications (
  id SERIAL PRIMARY KEY,
  diploma_id INTEGER REFERENCES diplomas(id) ON DELETE CASCADE,
  verifier TEXT,
  verified_at TIMESTAMP DEFAULT now(),
  result TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id INTEGER,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  starts_at TIMESTAMP NOT NULL,
  ends_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  content TEXT,
  category TEXT,
  published_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deliberations (
  id SERIAL PRIMARY KEY,
  enrollment_id INTEGER REFERENCES enrollments(id) ON DELETE CASCADE,
  decision TEXT NOT NULL,
  finalized_by TEXT,
  finalized_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_notifications (
  id SERIAL PRIMARY KEY,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  category TEXT,
  delivery JSONB,
  sent_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transcripts (
  id SERIAL PRIMARY KEY,
  verification_code TEXT UNIQUE NOT NULL,
  student_name TEXT NOT NULL,
  matricule TEXT NOT NULL,
  program_code TEXT,
  program_title TEXT,
  program_level TEXT,
  academic_year TEXT,
  grades JSONB,
  weighted_average NUMERIC(4,2),
  decision TEXT,
  issued_at TIMESTAMP DEFAULT now(),
  integrity_hash TEXT,
  qr_code_data_url TEXT,
  document_signature TEXT,
  created_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_plans (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  academic_year TEXT,
  total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid')),
  due_date DATE,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  plan_id INTEGER,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  method TEXT NOT NULL DEFAULT 'cash',
  reference TEXT UNIQUE,
  paid_at TIMESTAMP DEFAULT now(),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notification_templates (
  id TEXT PRIMARY KEY,
  channel TEXT[] NOT NULL DEFAULT '{email}',
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'email',
  status TEXT NOT NULL DEFAULT 'sent',
  template_id TEXT,
  metadata JSONB,
  sent_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payment_plans_student_id ON payment_plans(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_plan_id ON payments(plan_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);
CREATE INDEX IF NOT EXISTS idx_notifications_template_id ON notifications(template_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient);
CREATE INDEX IF NOT EXISTS idx_transcripts_verification_code ON transcripts(verification_code);

ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS transcripts_backend_only ON transcripts FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS email_notifications_backend_only ON email_notifications FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS payment_plans_backend_only ON payment_plans FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS payments_backend_only ON payments FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS notification_templates_backend_only ON notification_templates FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS notifications_backend_only ON notifications FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_program_id ON enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_grades_enrollment_id ON grades(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_diplomas_number ON diplomas(diploma_number);
CREATE INDEX IF NOT EXISTS idx_documents_visibility ON documents(visibility);

-- All database access is brokered by backend services using the service-role key.
-- Explicitly deny browser roles; the service role bypasses RLS.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE diplomas ENABLE ROW LEVEL SECURITY;
ALTER TABLE diploma_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliberations ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS users_backend_only ON users FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS faculties_backend_only ON faculties FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS programs_backend_only ON programs FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS tracks_backend_only ON tracks FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS courses_backend_only ON courses FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS enrollments_backend_only ON enrollments FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS documents_backend_only ON documents FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS grades_backend_only ON grades FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS diplomas_backend_only ON diplomas FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS diploma_verifications_backend_only ON diploma_verifications FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS audit_logs_backend_only ON audit_logs FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS calendar_events_backend_only ON calendar_events FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS news_backend_only ON news FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS deliberations_backend_only ON deliberations FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY IF NOT EXISTS email_notifications_backend_only ON email_notifications FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
