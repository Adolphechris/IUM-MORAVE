# Modèle Utilisateur — IUM-MORAVE

## Rôles
- `student`: accès aux données personnelles (notes, emploi du temps, documents).
- `teacher`: accès à ses cours, saisie des notes, supports.
- `admin`: gestion globale, inscriptions, délibérations, audit.
- `finance`: accès aux paiements, reçus, statut financier étudiant.

## Permissions par ressource
- `enrollment:read` — student/teacher/admin
- `enrollment:write` — admin
- `grade:read` — student/teacher/admin
- `grade:write` — teacher/admin
- `document:read` — public/student/admin
- `document:write` — admin
- `transcript:read` — student/admin
- `audit:read` — admin
- `user:write` — admin
- `finance:read` — finance/admin

## Champs utilisateur
- id, email, role, firstName, lastName, metadata, createdAt, updatedAt, deletedAt

## Sécurité
- Mot de passe hashé bcrypt rounds 12.
- Email vérifié via token envoyé par email.
- Reset password via token expirant.
- Logout par blacklist JWT.
