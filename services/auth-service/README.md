# Auth Service

Service responsable de l'authentification, de la gestion des rôles et du contrôle d'accès.

## Démarrage

- `npm install` dans la racine du monorepo
- `cd services/auth-service && npm run start`

## Endpoints

- `GET /health` : vérifie que le service fonctionne.
- `POST /auth/login` : point de départ pour l'authentification.
