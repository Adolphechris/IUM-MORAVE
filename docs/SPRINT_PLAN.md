# Plan de Sprint — IUM-MORAVE

Date : 01 Août 2026

## Vision
Ce document décrit le déroulé séquentiel du projet en sprints, afin de conserver une trajectoire claire et éviter l'éparpillement.

## Sprint 0 — Préparation et validation
Objectif : stabiliser l'infrastructure et confirmer les prérequis avant de démarrer le développement fonctionnel.

Tâches :
- vérifier la liaison GitHub et le statut de la PR `ci/run-migrations`
- corriger les workflows CI de migration Supabase
- valider `run-migrations` et `run-migrations-safe`
- confirmer que le schéma Supabase est appliqué ou documenter le blocage
- créer les premières issues GitHub pour le backlog initial
- mettre en place le tracker et la documentation de suivi

Livrables :
- `TODO.md` à jour
- `docs/DEVELOPMENT_REPORT.md`
- `docs/SPRINT_PLAN.md`
- issues GitHub #179 à #184

## Sprint 1 — Architecture et socle technique
Objectif : poser l'architecture monorepo et les fondations techniques du MVP.

Tâches :
- créer/valider l'arborescence `apps/`, `services/`, `shared/`, `docs/`
- documenter l'architecture et les conventions de développement
- définir le modèle utilisateur et la sécurité RBAC
- implémenter le socle `services/auth-service`
- implémenter le socle `services/core-api`

Critères d'acceptation :
- les services backend peuvent démarrer
- les premiers endpoints d'auth fonctionnent
- la structure du repo est claire et documentée

## Sprint 2 — MVP public et services essentiels
Objectif : développer les services utilisateur de base et les livrables institutionnels.

Tâches :
- construire le portail public `apps/web-portal`
- développer l'espace utilisateur étudiant/enseignant minimal
- créer un système de mail professionnel pour les notifications
- concevoir un générateur sécurisé de relevés de notes conforme aux normes congolaises
- connecter le frontend au backend API core

Critères d'acceptation :
- l'utilisateur peut se connecter et consulter une page publique
- les notifications email peuvent être émises
- un relevé de notes peut être généré et téléchargé

## Sprint 3 — Modules académiques et administration
Objectif : ajouter les services académiques et l'administration de base.

Tâches :
- implémenter la gestion des facultés, programmes et parcours
- ajouter la gestion des inscriptions et des délibérations
- fournir des outils d'administration et de reporting
- renforcer la sécurisation des documents académiques
- préparer l'intégration des notes et des diplômes

Critères d'acceptation :
- les entités académiques sont gérées via l'API
- les opérations d'inscription et de délibération sont possibles
- l'administration peut consulter des rapports basiques

## Suivi et mise à jour
- mettre à jour `TODO.md` à chaque fin de sprint ou livraison majeure
- documenter chaque décision dans `docs/DECISIONS.md`
- relier les issues GitHub aux milestones et aux sprints

## Priorités immédiates
1. Finaliser l'issue #179 : infra Supabase et schéma.
2. Lancer l'issue #180 : architecture monorepo.
3. Lancer l'issue #181 : auth & RBAC.
4. Lancer l'issue #182 : API académique core.
5. Intégrer les éléments MVP #183 et #184 dès Sprint 2.
