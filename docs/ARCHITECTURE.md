# Architecture proposée - IUM-MORAVE (ébauche)

Date: 2026-08-01

Objectif
--------
Fournir une proposition d'architecture modulaire, sécurisée et évolutive pour le portail institutionnel IUM.

Principes
---------
- Monorepo centralisé (déjà en place) pour tout le code, la documentation et les scripts.
- Modularité: chaque fonctionnalité est packagée comme module/service interne.
- Séparation des couches: présentation, API/logiciel métier, stockage/données, sécurité.
- Automatisation: CI/CD via GitHub Actions pour build, tests et déploiement.

Composants proposés
-------------------
- Frontend: Next.js (React) ou Nuxt.js (Vue) — rendu hybride (SSR/SSG) pour SEO et performance.
- Backend/API: Node.js (Express/Nest) ou Django (Python) selon préférence; exposer une API REST/GraphQL.
- Base de données: PostgreSQL (relationnelle) pour données structurées; possibilité d'ajouter Elasticsearch pour recherche.
- Stockage d'objets: S3-compatible (DigitalOcean Spaces / AWS S3) pour médias et documents.
- Authentification: OAuth2 / OpenID Connect, utiliser Keycloak ou Auth0 (ou GitHub OAuth pour MVP interne).
- CMS (contenu institutionnel): Headless CMS (Strapi, Netlify CMS, Sanity) ou un CMS intégré (Wagtail si Django choisi).
- CI/CD: GitHub Actions — workflows pour PRs (build + tests), déploiement sur staging/prod.
- Hébergement: plateformes PaaS (Railway, Render) ou VPS selon budget; utiliser HTTPS et CDN pour assets.

Schéma simple
-------------
[User Browser] -> [CDN] -> [Frontend (Next.js)] -> [API (Node/Django)] -> [Postgres]
                                      \-> [Auth service]
                                      \-> [Storage S3]

Modules prioritaires
--------------------
1. Pages institutionnelles (content pages + CMS)
2. Actualités / blog
3. Authentification & espaces privés
4. Inscription / formulaires administratifs
5. Gestion des documents / téléchargements

Sécurité
--------
- HTTPS obligatoire
- Gestion des secrets via GitHub Secrets
- Backups réguliers de la base de données
- Contrôle d'accès RBAC pour l'administration

Prochaine étape recommandée
---------------------------
- Valider le choix technologique (React/Next + Node/Postgres) ou alternative Django/Wagtail.
- Commencer l'implémentation d'un prototype: pages publiques + CMS minimal sur environment de staging.

Ce document est une ébauche; le fichier docs/ARCHITECTURE.md sera enrichi après atelier de choix technologique et validation par le comité de pilotage.
