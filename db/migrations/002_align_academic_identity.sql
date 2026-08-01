-- Align academic catalogue with the approved IUM-MORAVE identity.

UPDATE faculties
SET
  code = 'FSINT',
  name = 'Faculté des Sciences Informatiques et Nouvelles Technologies',
  description = 'Formation en informatique, systèmes numériques et technologies innovantes.',
  updated_at = now()
WHERE code IN ('FST', 'INF')
   OR name IN ('Faculté des Sciences et Technologies', 'Faculté d''Informatique');

INSERT INTO faculties (code, name, description)
VALUES (
  'FSEG',
  'Faculté des Sciences Économiques et de Gestion',
  'Économie, management, finance et comptabilité.'
)
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description, updated_at = now();

DELETE FROM programs WHERE code = 'MST-IA';

INSERT INTO programs (faculty_id, code, title, level, duration_months, description)
SELECT id, 'LIC-SINT', 'Licence en Sciences Informatiques et Nouvelles Technologies', 'licence', 36,
  'Formation de base en informatique et technologies numériques.'
FROM faculties
WHERE code = 'FSINT'
  AND NOT EXISTS (SELECT 1 FROM programs WHERE code = 'LIC-SINT');

INSERT INTO programs (faculty_id, code, title, level, duration_months, description)
SELECT id, 'LIC-SEG', 'Licence en Sciences Économiques et de Gestion', 'licence', 36,
  'Formation de base en économie, gestion et management.'
FROM faculties
WHERE code = 'FSEG'
  AND NOT EXISTS (SELECT 1 FROM programs WHERE code = 'LIC-SEG');

INSERT INTO tracks (program_id, code, title, description)
SELECT id, 'SINT-DEV', 'Développement logiciel et applications',
  'Spécialité orientée conception, programmation et applications numériques.'
FROM programs
WHERE code = 'LIC-SINT'
  AND NOT EXISTS (SELECT 1 FROM tracks WHERE code = 'SINT-DEV');

INSERT INTO tracks (program_id, code, title, description)
SELECT id, 'SINT-RC', 'Réseaux, systèmes et cybersécurité',
  'Spécialité orientée infrastructures, réseaux et protection des systèmes.'
FROM programs
WHERE code = 'LIC-SINT'
  AND NOT EXISTS (SELECT 1 FROM tracks WHERE code = 'SINT-RC');

INSERT INTO tracks (program_id, code, title, description)
SELECT id, 'SEG-FC', 'Finance et comptabilité',
  'Spécialité orientée gestion financière et comptabilité.'
FROM programs
WHERE code = 'LIC-SEG'
  AND NOT EXISTS (SELECT 1 FROM tracks WHERE code = 'SEG-FC');

INSERT INTO tracks (program_id, code, title, description)
SELECT id, 'SEG-MO', 'Management des organisations',
  'Spécialité orientée pilotage, gestion et entrepreneuriat.'
FROM programs
WHERE code = 'LIC-SEG'
  AND NOT EXISTS (SELECT 1 FROM tracks WHERE code = 'SEG-MO');
