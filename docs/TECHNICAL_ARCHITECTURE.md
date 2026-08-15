# Architecture technique - IUM-MORAVE (Partie IV)

Date: 2026-08-01

Objectif
--------
Décrire les choix techniques, l'infrastructure et les pratiques de développement pour construire un portail universitaire moderne, sécurisé et évolutif.

Résumé des choix recommandés
----------------------------
- Frontend: Next.js (React) pour SSR/SSG, SEO et performance.
- Backend: Node.js (NestJS) ou Django selon préférence (API REST/GraphQL).
- Base de données: PostgreSQL.
- Stockage: S3-compatible pour médias et documents.
- Auth: OAuth2 / OpenID Connect (Keycloak ou service IAM managé pour MVP).
- CI/CD: GitHub Actions (PR checks, build, tests, deploy).
- Hébergement: PaaS (Render, Railway) pour MVP; migration vers VPS/Cloud (OVH/Hetzner/AWS) pour prod.

Environnements
--------------
- dev: workflows et branches feature
- staging: PR merged -> déploiement staging
- prod: release tagged -> déploiement prod

Sécurité & opérations
---------------------
- HTTPS obligatoire, gestion des secrets via GitHub Secrets.
- Backups périodiques de la base et stockage.
- Monitoring: Sentry/Prometheus + alerting.

Sauvegarde & récupération
-------------------------
- Export quotidien des données critiques vers stockage externe.
- Procédure de restauration documentée dans docs/OPERATIONAL_RUNBOOK.md.

Tests & QA
----------
- Tests unitaires, d'intégration, e2e (Cypress/Playwright).
- Exécutions automatiques sur GitHub Actions.

Déploiement continu
-------------------
- Workflows: ci.yml (PR checks), deploy-staging.yml, deploy-prod.yml.

Prochaine étape
---------------
- Rédiger docs/OPERATIONAL_RUNBOOK.md et templates GitHub Actions basiques.
- Lister user stories techniques pour Phase 1 (MVP) et créer issues enfants.
