MODÈLE DE DONNÉES — LMD (ERD) pour IUM-MORAVE

But : fournir un schéma de données relationnel initial couvrant Users, Faculties, Programmes, Cours, Parcours, Inscriptions, Documents, Diplômes et vérification.

Entités principales (simplifiées) :

- users (id, role [student,teacher,admin], first_name, last_name, email, password_hash, metadata, created_at, updated_at)
- faculties (id, code, name, description, created_at, updated_at)
- departments (id, faculty_id, name, description)
- programs (id, faculty_id, code, title, level [licence,master,doctorat], duration_months, description, admission_conditions)
- tracks (id, program_id, code, title, description) -- parcours/spécialités
- courses (id, track_id, code, title, credits, semester, description)
- enrollments (id, user_id, program_id, track_id, year, status)
- documents (id, owner_type, owner_id, title, file_path, mime, visibility, created_by, created_at)
- diplomas (id, user_id, program_id, diploma_number, issued_date, status, verification_code_hash)
- diploma_verifications (id, diploma_id, verifier, verified_at, result, notes)

Exemple SQL (PostgreSQL) — schéma simplifié :

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

CREATE TABLE diplomas (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  program_id INTEGER REFERENCES programs(id),
  diploma_number TEXT UNIQUE,
  issued_date DATE,
  status TEXT,
  verification_code_hash TEXT
);

Notes et recommandations :
- Utiliser UUIDs en production si besoin d'un identifiant non séquentiel externe (privacy/security).
- Indexer les colonnes fréquemment recherchées (email, diploma_number, verification_code_hash).
- Garder une table d'audit (audit_logs) pour traçabilité (connexion, modification de contenu, validation).
- Les fichiers/documents doivent être stockés dans un stockage S3-compatible et référencés par file_path.

Fichier ERD (représentation) : proposer l'export d'un diagramme via dbdiagram.io ou draw.io pour la première release. Ce document sert de base — on affinera les relations et attributs lors de la conception détaillée.
