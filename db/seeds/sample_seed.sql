-- Sample seed data aligned with the current academic catalogue.
INSERT INTO faculties (code, name, description) VALUES
  ('FSINT', 'Faculté des Sciences Informatiques et Nouvelles Technologies', 'Informatique, systèmes numériques et technologies innovantes'),
  ('FSEG', 'Faculté des Sciences Économiques et de Gestion', 'Économie, management, finance et comptabilité')
ON CONFLICT (code) DO NOTHING;

INSERT INTO programs (faculty_id, code, title, level, duration_months, description)
SELECT id, 'LIC-SINT', 'Licence en Sciences Informatiques et Nouvelles Technologies', 'licence', 36,
  'Formation de base en informatique et technologies numériques.'
FROM faculties WHERE code = 'FSINT'
  AND NOT EXISTS (SELECT 1 FROM programs WHERE code = 'LIC-SINT');

INSERT INTO programs (faculty_id, code, title, level, duration_months, description)
SELECT id, 'LIC-SEG', 'Licence en Sciences Économiques et de Gestion', 'licence', 36,
  'Formation de base en économie, gestion et management.'
FROM faculties WHERE code = 'FSEG'
  AND NOT EXISTS (SELECT 1 FROM programs WHERE code = 'LIC-SEG');

INSERT INTO tracks (program_id, code, title, description)
SELECT id, 'SINT-DEV', 'Développement logiciel et applications',
  'Spécialité orientée conception, programmation et applications numériques.'
FROM programs WHERE code = 'LIC-SINT'
  AND NOT EXISTS (SELECT 1 FROM tracks WHERE code = 'SINT-DEV');

INSERT INTO tracks (program_id, code, title, description)
SELECT id, 'SINT-RC', 'Réseaux, systèmes et cybersécurité',
  'Spécialité orientée infrastructures, réseaux et protection des systèmes.'
FROM programs WHERE code = 'LIC-SINT'
  AND NOT EXISTS (SELECT 1 FROM tracks WHERE code = 'SINT-RC');

INSERT INTO tracks (program_id, code, title, description)
SELECT id, 'SEG-FC', 'Finance et comptabilité',
  'Spécialité orientée gestion financière et comptabilité.'
FROM programs WHERE code = 'LIC-SEG'
  AND NOT EXISTS (SELECT 1 FROM tracks WHERE code = 'SEG-FC');

INSERT INTO tracks (program_id, code, title, description)
SELECT id, 'SEG-MO', 'Management des organisations',
  'Spécialité orientée pilotage, gestion et entrepreneuriat.'
FROM programs WHERE code = 'LIC-SEG'
  AND NOT EXISTS (SELECT 1 FROM tracks WHERE code = 'SEG-MO');

INSERT INTO users (role, first_name, last_name, email) VALUES
  ('admin','System','Admin','admin@universitemorave.cd'),
  ('student','Jean','Doe','jean.doe@example.cd'),
  ('teacher','Professeur','IUM','professeur@ium-morave.edu')
ON CONFLICT (email) DO NOTHING;

INSERT INTO enrollments (user_id, program_id, track_id, year, status, matricule)
SELECT 2, p.id, t.id, 2025, 'active', 'IUM/2025/0001'
FROM programs p
JOIN tracks t ON t.program_id = p.id
WHERE p.code = 'LIC-SINT' AND t.code = 'SINT-DEV'
  AND NOT EXISTS (SELECT 1 FROM enrollments WHERE matricule = 'IUM/2025/0001');

INSERT INTO courses (track_id, code, title, credits, semester, teacher_email)
SELECT t.id, 'SINT101', 'Algorithmique et structures de données', 6, 1, 'professeur@ium-morave.edu'
FROM tracks t WHERE t.code = 'SINT-DEV'
  AND NOT EXISTS (SELECT 1 FROM courses WHERE code = 'SINT101');

INSERT INTO courses (track_id, code, title, credits, semester, teacher_email)
SELECT t.id, 'SINT102', 'Programmation orientée objet', 6, 1, 'professeur@ium-morave.edu'
FROM tracks t WHERE t.code = 'SINT-DEV'
  AND NOT EXISTS (SELECT 1 FROM courses WHERE code = 'SINT102');

INSERT INTO grades (enrollment_id, course_id, score, status)
SELECT e.id, c.id, 14.5, 'validated'
FROM enrollments e
JOIN courses c ON c.code = 'SINT101'
WHERE e.matricule = 'IUM/2025/0001'
  AND NOT EXISTS (SELECT 1 FROM grades WHERE enrollment_id = e.id AND course_id = c.id);

INSERT INTO grades (enrollment_id, course_id, score, status)
SELECT e.id, c.id, 13.0, 'validated'
FROM enrollments e
JOIN courses c ON c.code = 'SINT102'
WHERE e.matricule = 'IUM/2025/0001'
  AND NOT EXISTS (SELECT 1 FROM grades WHERE enrollment_id = e.id AND course_id = c.id);

INSERT INTO documents (owner_type, owner_id, title, file_path, mime, visibility, created_by)
SELECT 'public', 0, 'Règlement intérieur', '/documents/reglement-interieur.pdf', 'application/pdf', 'public', 1
WHERE NOT EXISTS (SELECT 1 FROM documents WHERE file_path = '/documents/reglement-interieur.pdf');

INSERT INTO documents (owner_type, owner_id, title, file_path, mime, visibility, created_by)
SELECT 'student', 2, 'Guide de l’étudiant', '/documents/guide-etudiant.pdf', 'application/pdf', 'student', 1
WHERE NOT EXISTS (SELECT 1 FROM documents WHERE file_path = '/documents/guide-etudiant.pdf');

INSERT INTO news (title, slug, summary, content, category, published_at)
SELECT 'Lancement du portail IUM-MORAVE', 'lancement-portail-ium-morave',
  'Le portail institutionnel est en cours de développement.',
  'L’IUM-MORAVE met progressivement en place son portail numérique pour améliorer l’accès aux informations, formations et services universitaires.',
  'institution', now()
WHERE NOT EXISTS (SELECT 1 FROM news WHERE slug = 'lancement-portail-ium-morave');

INSERT INTO news (title, slug, summary, content, category, published_at)
SELECT 'Préparation de la rentrée académique', 'rentree-academique-2026',
  'Les informations administratives et académiques seront publiées sur le portail.',
  'Les étudiants et candidats pourront consulter les dates importantes, les programmes et les documents nécessaires à la rentrée académique.',
  'academic', now()
WHERE NOT EXISTS (SELECT 1 FROM news WHERE slug = 'rentree-academique-2026');

INSERT INTO diplomas (user_id, program_id, diploma_number, issued_date, status, verification_code_hash)
SELECT 2, 1, 'DIP-2026-0001', '2026-07-01', 'issued', encode(digest('DIP-2026-0001-secret', 'sha256'), 'hex')
WHERE NOT EXISTS (SELECT 1 FROM diplomas WHERE diploma_number = 'DIP-2026-0001');
