# Auth Service

Service responsable de l'authentification, de la gestion des rôles et du contrôle d'accès.

## Démarrage

- `npm install` dans la racine du monorepo
- `cd services/auth-service && npm run start`

## Endpoints

- `GET /health` : vérifie que le service fonctionne.
- `POST /auth/register` : création d'un utilisateur et émission d'un token JWT.
- `POST /auth/login` : authentification par email et mot de passe.
- `GET /auth/profile` : récupération des informations du profil authentifié.

## Environnement
- `JWT_SECRET` : secret utilisé pour signer les tokens JWT.
- `PORT` : port d'écoute du service (par défaut 4001).
