BEGIN;

-- Faculties
INSERT INTO faculties (id, code, name, description, created_at, updated_at, deleted_at) VALUES
  (1, 'FSINT', 'Faculté des Sciences Informatiques et Nouvelles Technologies', 'Formation en informatique, systèmes numériques et technologies innovantes.', NOW(), NOW(), NULL),
  (2, 'FSEG', 'Faculté des Sciences Économiques et de Gestion', 'Économie, Management, Comptabilité', NOW(), NOW(), NULL);

-- Programs
INSERT INTO programs (id, faculty_id, code, title, level, duration_months, description, admission_conditions, created_at, updated_at, deleted_at) VALUES
  (1, 1, 'LIC-SINT', 'Licence en Sciences Informatiques et Nouvelles Technologies', 'licence', 36, NULL, NULL, NOW(), NOW(), NULL),
  (2, 2, 'LIC-SEG', 'Licence en Sciences Économiques et de Gestion', 'licence', 36, NULL, NULL, NOW(), NOW(), NULL);

-- Tracks
INSERT INTO tracks (id, program_id, code, title, description, created_at, updated_at, deleted_at) VALUES
  (1, 1, 'SINT-DEV', 'Développement logiciel et applications', 'Spécialité orientée conception, programmation et applications numériques.', NOW(), NOW(), NULL),
  (2, 1, 'SINT-RC', 'Réseaux, systèmes et cybersécurité', 'Spécialité orientée infrastructures, réseaux et protection des systèmes.', NOW(), NOW(), NULL),
  (3, 2, 'SEG-FC', 'Finance et comptabilité', 'Spécialité orientée gestion financière et comptabilité.', NOW(), NOW(), NULL),
  (4, 2, 'SEG-MO', 'Management des organisations', 'Spécialité orientée pilotage, gestion et entrepreneuriat.', NOW(), NOW(), NULL);

-- Courses
INSERT INTO courses (id, track_id, code, title, credits, semester, description, teacher_email, created_at, updated_at, deleted_at) VALUES
  (1, 1, 'SINT101', 'Algorithmique et structures de données', 6, 1, NULL, 'professeur@ium-morave.edu', NOW(), NOW(), NULL),
  (2, 1, 'SINT102', 'Programmation orientée objet', 6, 1, NULL, 'professeur@ium-morave.edu', NOW(), NOW(), NULL),
  (3, 2, 'SINT103', 'Réseaux informatiques', 5, 2, NULL, 'professeur@ium-morave.edu', NOW(), NOW(), NULL),
  (4, 3, 'SEG101', 'Comptabilité générale', 5, 1, NULL, 'professeur@ium-morave.edu', NOW(), NOW(), NULL);

-- Students (users)
INSERT INTO users (id, role, first_name, last_name, email, password_hash, metadata, created_at, updated_at, deleted_at) VALUES
  (1, 'student', 'Jean', 'Kabamba', 'jean.kabamba@ium-morave.edu', '$2b$10$placeholderhash', '{"enrollmentId": 1}', NOW(), NOW(), NULL),
  (2, 'admin', 'Admin', 'System', 'admin@ium-morave.edu', '$2b$10$placeholderhash', '{}', NOW(), NOW(), NULL),
  (3, 'teacher', 'Professeur', 'IUM', 'professeur@ium-morave.edu', '$2b$10$placeholderhash', '{}', NOW(), NOW(), NULL);

-- Enrollments
INSERT INTO enrollments (id, user_id, program_id, track_id, year, status, matricule, created_at, updated_at, deleted_at) VALUES
  (1, 1, 1, 1, 2026, 'active', 'IUM/2026/0001', NOW(), NOW(), NULL);

-- Grades
INSERT INTO grades (enrollment_id, course_id, score, status, created_at, updated_at, deleted_at) VALUES
  (1, 1, 15, 'validated', NOW(), NOW(), NULL),
  (1, 2, 14, 'validated', NOW(), NOW(), NULL),
  (1, 3, 13, 'validated', NOW(), NOW(), NULL);

-- Documents
INSERT INTO documents (id, owner_type, owner_id, title, file_path, mime, visibility, created_by, created_at, deleted_at) VALUES
  (1, 'institution', 1, 'Règlement intérieur', '/documents/reglement-interieur.pdf', 'application/pdf', 'public', NULL, NOW(), NULL),
  (2, 'institution', 1, 'Guide de l''étudiant', '/documents/guide-etudiant.pdf', 'application/pdf', 'student', NULL, NOW(), NULL);

-- News
INSERT INTO news (id, title, slug, summary, content, category, published_at, created_at, updated_at, deleted_at) VALUES
  (1, 'Lancement du portail IUM-MORAVE', 'lancement-portail-ium-morave', 'Le portail institutionnel est en cours de développement.', 'L''IUM-MORAVE met progressivement en place son portail numérique pour améliorer l''accès aux informations, formations et services universitaires.', 'institution', '2026-08-01', NOW(), NOW(), NULL),
  (2, 'Préparation de la rentrée académique', 'rentree-academique-2026', 'Les informations administratives et académiques seront publiées sur le portail.', 'Les étudiants et candidats pourront consulter les dates importantes, les programmes et les documents nécessaires à la rentrée académique.', 'academic', '2026-08-05', NOW(), NOW(), NULL);

-- Calendar Events
INSERT INTO calendar_events (id, title, category, starts_at, ends_at, created_at, updated_at, deleted_at) VALUES
  (1, 'Rentrée académique', 'academic', '2026-09-01', '2026-09-01', NOW(), NOW(), NULL),
  (2, 'Session des examens', 'examination', '2026-12-07', '2026-12-19', NOW(), NOW(), NULL),
  (3, 'Délibérations du premier semestre', 'administration', '2026-12-22', '2026-12-23', NOW(), NOW(), NULL);

COMMIT;
