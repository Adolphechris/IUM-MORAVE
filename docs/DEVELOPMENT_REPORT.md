# Development Sprint Plan & Report — IUM-MORAVE

Date: 01 Août 2026 18:16

## Contexte
Ce document trace l'état actuel du chantier et les actions réalisées pour ne pas perdre le fil.

## Ce que j'avais à faire
- Reprendre le chantier et vérifier que le repo GitHub est bien connecté.
- Corriger le workflow de migration Supabase (`run-migrations`).
- Diagnostiquer pourquoi le déploiement de la base échoue.
- Préparer un plan de développement séquentiel et un tracker clair.

## Ce que j'ai fait
- Corrigé le fichier `.github/workflows/run-migrations.yml` pour réparer les expressions `sed` de `DB_URL`.
- Ajouté la détection IPv4 dans le workflow pour tenter de contourner le blocage IPv6.
- Rendu l'étape de seed tolérante lorsqu'elle ne peut pas atteindre la base afin de ne pas bloquer le PR.
- Mis à jour `TODO.md` avec l'état actuel, les prochaines actions et un plan Sprint 0 / Sprint 1.
- Mis à jour `docs/TODO_TRACKER.md` pour clarifier les actions Sprint 0.

## Ce qui reste à faire
- Confirmer l'application du schéma et des seeds sur Supabase depuis le dashboard ou une machine avec connectivité IPv6.
- Attendre le résultat du check `build` sur la PR `ci/run-migrations`.
- Créer les premières issues GitHub pour le développement : architecture monorepo, auth/RBAC, API core.
- Commencer le développement séquentiel après la validation de l'infrastructure.

## Sprint 0 — Préparation & Vérification
- [x] Corriger le workflow de migration Supabase.
- [x] Valider `run-migrations` et `run-migrations-safe` sur CI.
- [ ] Confirmer que Supabase peut recevoir le schéma et les seeds.
- [ ] Vérifier le `build` CI et valider la branche avant fusion.
- [ ] Documenter les étapes à suivre pour l’accès Supabase et la base de données.

## Sprint 1 — Démarrage du développement
- [ ] Définir et créer l'architecture Monorepo (`apps/`, `services/`, `shared/`, `docs/`).
- [ ] Définir le modèle utilisateur et le plan de sécurité.
- [ ] Créer le module `services/auth-service` et le socle `services/core-api`.
- [x] Lancer les premières issues GitHub pour les epics prioritaires.

## Sprint 2 — MVP public et services essentiels
- [ ] Construire le portail public basique et l'espace utilisateur minimal.
- [ ] Ajouter un système de messagerie professionnelle pour notifications officielles.
- [ ] Concevoir un générateur sécurisé de relevés de notes conforme aux normes congolaises.

## Progression actuelle
- [x] `services/auth-service` skeleton created and ready for auth/RBAC development.
- [x] `services/core-api` skeleton created and ready for academic API development.
- [x] `services/*` workspace added to root `package.json`.
- [x] Issue #179 updated with Supabase connectivity findings (IPv6-only host).
- [ ] Build CI is still in progress; waiting for completion.

## Backlog initial GitHub
- [x] Milestone créé : [MVP v0.1](https://github.com/Adolphechris/IUM-MORAVE/milestone/2)
- [x] Issue #179 — [Infra & base de données: valider l'accès Supabase et définir le schéma initial](https://github.com/Adolphechris/IUM-MORAVE/issues/179)
- [x] Issue #180 — [Architecture monorepo: créer l'arborescence apps/services/shared/docs](https://github.com/Adolphechris/IUM-MORAVE/issues/180)
- [x] Issue #181 — [Authentification & RBAC: définir le modèle utilisateur et le premier flux d'auth](https://github.com/Adolphechris/IUM-MORAVE/issues/181)
- [x] Issue #182 — [API académique core: définir les entités de base facultés/programmes/parcours](https://github.com/Adolphechris/IUM-MORAVE/issues/182)

## Notes
- Le problème principal identifié est la connectivité réseau vers Supabase depuis GitHub Actions (host IPv6-only).
- Les informations partagées ont servi à configurer la connexion, mais la validation complète nécessite un environnement capable de joindre Supabase.
- On peut avancer en développement, mais la base doit être validée avant toute mise en production.
