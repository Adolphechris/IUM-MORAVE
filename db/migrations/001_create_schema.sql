-- Migration 001: Create initial schema for IUM-MORAVE

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE faculties (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE programs (
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

CREATE TABLE tracks (
  id SERIAL PRIMARY KEY,
  program_id INTEGER REFERENCES programs(id) ON DELETE CASCADE,
  code TEXT,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE courses (
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

CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  program_id INTEGER REFERENCES programs(id),
  track_id INTEGER REFERENCES tracks(id),
  year INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  matricule TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE documents (
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

CREATE TABLE grades (
  id SERIAL PRIMARY KEY,
  enrollment_id INTEGER REFERENCES enrollments(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
  score NUMERIC(4,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE diplomas (
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

CREATE TABLE diploma_verifications (
  id SERIAL PRIMARY KEY,
  diploma_id INTEGER REFERENCES diplomas(id) ON DELETE CASCADE,
  verifier TEXT,
  verified_at TIMESTAMP DEFAULT now(),
  result TEXT,
  notes TEXT
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id INTEGER,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE calendar_events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  starts_at TIMESTAMP NOT NULL,
  ends_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE news (
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

CREATE TABLE deliberations (
  id SERIAL PRIMARY KEY,
  enrollment_id INTEGER REFERENCES enrollments(id) ON DELETE CASCADE,
  decision TEXT NOT NULL,
  finalized_by TEXT,
  finalized_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE email_notifications (
  id SERIAL PRIMARY KEY,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  category TEXT,
  delivery JSONB,
  sent_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_program_id ON enrollments(program_id);
CREATE INDEX idx_grades_enrollment_id ON grades(enrollment_id);
CREATE INDEX idx_diplomas_number ON diplomas(diploma_number);
CREATE INDEX idx_documents_visibility ON documents(visibility);

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

CREATE POLICY users_backend_only ON users FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY faculties_backend_only ON faculties FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY programs_backend_only ON programs FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY tracks_backend_only ON tracks FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY courses_backend_only ON courses FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY enrollments_backend_only ON enrollments FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY documents_backend_only ON documents FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY grades_backend_only ON grades FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY diplomas_backend_only ON diplomas FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY diploma_verifications_backend_only ON diploma_verifications FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY audit_logs_backend_only ON audit_logs FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY calendar_events_backend_only ON calendar_events FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY news_backend_only ON news FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY deliberations_backend_only ON deliberations FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY email_notifications_backend_only ON email_notifications FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
