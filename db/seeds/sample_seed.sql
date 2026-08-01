-- Sample seed data aligned with the current academic catalogue.
INSERT INTO faculties (code, name, description) VALUES
  ('FSINT', 'Faculté des Sciences Informatiques et Nouvelles Technologies', 'Informatique, systèmes numériques et technologies innovantes'),
  ('FSEG', 'Faculté des Sciences Économiques et de Gestion', 'Économie, management, finance et comptabilité')
ON CONFLICT (code) DO NOTHING;

INSERT INTO programs (faculty_id, code, title, level, duration_months)
SELECT id, 'LIC-SINT', 'Licence en Sciences Informatiques et Nouvelles Technologies', 'licence', 36
FROM faculties
WHERE code = 'FSINT'
  AND NOT EXISTS (SELECT 1 FROM programs WHERE code = 'LIC-SINT');

INSERT INTO programs (faculty_id, code, title, level, duration_months)
SELECT id, 'LIC-SEG', 'Licence en Sciences Économiques et de Gestion', 'licence', 36
FROM faculties
WHERE code = 'FSEG'
  AND NOT EXISTS (SELECT 1 FROM programs WHERE code = 'LIC-SEG');

INSERT INTO users (role, first_name, last_name, email) VALUES ('admin','System','Admin','admin@universitemorave.cd'), ('student','Jean','Doe','jean.doe@example.cd');

INSERT INTO diplomas (user_id, program_id, diploma_number, issued_date, status) VALUES (2, 1, 'DIP-2026-0001', '2026-07-01', 'issued');
