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
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE faculties (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE programs (
  id SERIAL PRIMARY KEY,
  faculty_id INTEGER REFERENCES faculties(id) ON DELETE SET NULL,
  code TEXT,
  title TEXT NOT NULL,
  level TEXT,
  duration_months INTEGER,
  description TEXT,
  admission_conditions TEXT
);

CREATE TABLE tracks (
  id SERIAL PRIMARY KEY,
  program_id INTEGER REFERENCES programs(id) ON DELETE CASCADE,
  code TEXT,
  title TEXT,
  description TEXT
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  track_id INTEGER REFERENCES tracks(id) ON DELETE SET NULL,
  code TEXT,
  title TEXT,
  credits INTEGER,
  semester INTEGER,
  description TEXT
);

CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  program_id INTEGER REFERENCES programs(id),
  track_id INTEGER REFERENCES tracks(id),
  year INTEGER,
  status TEXT
);

CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  owner_type TEXT,
  owner_id INTEGER,
  title TEXT,
  file_path TEXT,
  mime TEXT,
  visibility TEXT,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE diplomas (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  program_id INTEGER REFERENCES programs(id),
  diploma_number TEXT UNIQUE,
  issued_date DATE,
  status TEXT,
  verification_code_hash TEXT
);

CREATE TABLE diploma_verifications (
  id SERIAL PRIMARY KEY,
  diploma_id INTEGER REFERENCES diplomas(id) ON DELETE CASCADE,
  verifier TEXT,
  verified_at TIMESTAMP DEFAULT now(),
  result TEXT,
  notes TEXT
);

-- Audit log table
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  action TEXT,
  resource TEXT,
  resource_id INTEGER,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);
