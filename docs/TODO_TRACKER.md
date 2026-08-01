# Tracker TODO - IUM-MORAVE

But
----
Centraliser le backlog, les epics, milestones et les tâches courantes pour éviter la dispersion d'idées et garantir la progression ordonnée du chantier.

Format et conventions
---------------------
- Epics: grands domaines de travail (ex: "Auth & Users", "Infra", "Front V1").
- Milestones: regroupement temporel d'epics (ex: "MVP v0.1", "Production Beta").
- Tickets/Issues:Chaque tâche doit exister comme issue GitHub et contenir:
  - Contexte et but
  - Critères d'acceptation
  - Estimation (petit/moyen/large)
  - Labels: type/priority/area
- Sprint courant: liste de tickets assignés et priorité.

Priorités
---------
- P0: critique (bloquant la livraison)
- P1: haute (doit être faite pour la milestone)
- P2: normale
- P3: basse (améliorations, documentation)

Template rapide de backlog
--------------------------
## Epics
- [ ] Epic: Auth & Users
- [ ] Epic: API core
- [ ] Epic: Frontend base
- [ ] Epic: CI/CD & Infra

## Milestones
- MVP v0.1 - date cible: YYYY-MM-DD
  - Epics inclus: Auth & Users, API core, Frontend base

## Sprint courant
- Sprint 1 (YYYY-MM-DD → YYYY-MM-DD)
  - P0: # (issue link)
  - P1: #

Gestion des issues et labels
---------------------------
- Labels recommandés: epic, bug, enhancement, docs, infra, question, P0, P1, P2, P3
- Lier chaque PR à une issue et indiquer la milestone si applicable.

Réunions et synchronisation
--------------------------
- Standup asynchrone: chaque contributeur poste un bref statut dans l'issue/sprint ou dans le canal de communication.
- Revues de planning: à la fin de chaque sprint, revue des accomplissements et réaffectation des tâches.

Suivi et archivage
------------------
- Les tâches closes doivent référencer le(s) PR(s) qui les ferment.
- Les décisions importantes sont archivées dans docs/DECISIONS.md.

Comment ajouter une tâche
------------------------
1. Créer une issue en respectant le template (titre, description, critères d'acceptation, estimation).
2. Ajouter labels et milestone.
3. Assigner un responsable si déjà connu.

Ce fichier est le guide de travail: le backlog effectif est maintenu via les issues GitHub; utiliser ce document pour la structure et la répartition.
