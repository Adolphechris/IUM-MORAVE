-- Sample seed data
INSERT INTO faculties (code, name, description) VALUES ('INF', 'Faculté d''Informatique', 'Faculté stratégique');
INSERT INTO faculties (code, name) VALUES ('DROIT', 'Faculté de Droit');

INSERT INTO programs (faculty_id, code, title, level, duration_months) VALUES (1, 'LIC-INF', 'Licence Informatique', 'licence', 36), (1, 'MST-IA', 'Master Intelligence Artificielle', 'master', 24);

INSERT INTO users (role, first_name, last_name, email) VALUES ('admin','System','Admin','admin@universitemorave.cd'), ('student','Jean','Doe','jean.doe@example.cd');

INSERT INTO diplomas (user_id, program_id, diploma_number, issued_date, status) VALUES (2, 1, 'DIP-2026-0001', '2026-07-01', 'issued');
