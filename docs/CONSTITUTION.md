# Constitution du projet IUM-MORAVE

Version: 1.0
Date: 2026-08-01

But
-------
Assurer la réussite coordonnée, traçable et durable du chantier logiciel IUM-MORAVE en centralisant tout le développement et la gouvernance dans un seul dépôt (monorepo). Toute décision d'architecture, de sous-dépôt, ou de séparation doit être prise et documentée dans ce dépôt.

Principes fondamentaux
----------------------
1. Un seul dépôt (monorepo): toutes les sources, sous-projets, modules, documentations et artefacts liés au projet sont hébergés dans ce dépôt.
2. Transparence et traçabilité: chaque décision majeure, exigence, design et action opérationnelle doit être documentée (issues, PR, décision dans docs/decisions.md).
3. Responsabilité: chaque changement doit être rattaché à une issue et une PR, avec des reviewers définis.
4. Qualité et tests: toute nouvelle fonctionnalité doit être accompagnée de tests automatisés et/ou d'une stratégie de tests documentée.
5. Revue de code obligatoire: les PRs doivent recevoir au moins une approbation (sauf exceptions documentées) avant merge.
6. Automatisation: CI/CD doit exécuter builds, tests et validations avant tout merge sur main.
7. Déploiement et releases: versionnement sémantique (semver) et changelogs clairs.

Organisation & structure
------------------------
- racine/  : scripts et orchestration
- services/: services et backends (chaque service dans son sous-dossier)
- libs/    : bibliothèques partagées
- infra/   : scripts d'infrastructure et IaC
- docs/    : documentation générale (constitution, tracker, décisions)
- tools/   : outils internes, scripts de dev

Branches & workflow
-------------------
- main: branche protégée, seule branche contenant la version de production stable.
- develop (optionnel): intégration continue des fonctionnalités (si utile).
- feature/<nom>-<ticket>: branches de fonctionnalité liées à une issue (ex: feature/auth-1234).
- fix/<nom>-<ticket>: corrections rapides.
- release/x.y.z: préparations de release.
- hotfix/x.y.z: corrections critiques en production.

Conventions de commits
----------------------
- Utiliser un style lisible: 
  - feat(scope): courte description
  - fix(scope): courte description
  - docs(scope): modifications de doc
  - chore(scope): tâches non fonctionnelles
- Inclure la référence de l'issue si applicable (ex: "feat(auth): ajouter login (closes #12)")

Issue / PR / Revue
------------------
- Toute fonctionnalité ou correction démarre par une issue décrivant but, critères d'acceptation et impact.
- Une PR doit lier l'issue correspondante et inclure une description claire, étape de reproduction (si bug), et notes de test.

Décisions & gouvernance
-----------------------
- Les décisions d'architecture majeures sont documentées dans docs/DECISIONS.md (date, auteurs, options considérées, décision finale).
- Modifications de la constitution se font via PR et exigent approbation de 2 maintainers.

Suivi des tâches et planning
---------------------------
- Un tracker central (docs/TODO_TRACKER.md) définit epics, milestones et sprints. Les tâches sont synchronisées avec les issues GitHub.

Sécurité & secrets
------------------
- Ne jamais committer de secrets dans le dépôt.
- Utiliser des secrets GitHub Actions pour les clefs sensibles.

Respect & communication
-----------------------
- Respecter les conventions, être explicite dans les messages et rester constructif lors des revues.

Annexes
-------
- docs/TODO_TRACKER.md : format du tracker
- .github/CONTRIBUTING.md : guide de contribution
- docs/DECISIONS.md : journal des décisions

Cette constitution peut évoluer: toute modification doit se faire via PR et suivre le processus documenté ci-dessus.
