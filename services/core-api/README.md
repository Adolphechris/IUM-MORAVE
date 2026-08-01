# Core API Service

Service responsable de l'API académique et de la gestion des entités métier de base.

## Démarrage

- `npm install` dans la racine du monorepo
- `cd services/core-api && npm run start`

## Endpoints

- `GET /health` : vérifie que le service fonctionne.
- `GET /faculties` : retourne la liste des facultés.
- `GET /programs` : retourne la liste des programmes.
- `GET /tracks` : retourne la liste des parcours.
- `GET /faculty/:id` : retourne les détails d'une faculté.

## Environnement
- `PORT` : port d'écoute du service (par défaut 4002).
