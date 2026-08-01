# Guide de contribution - IUM-MORAVE

Merci de contribuer à IUM-MORAVE ! Ce guide explique comment proposer des changements et le flux de travail attendu.

Avant de commencer
------------------
- Vérifier les issues existantes: si votre changement correspond à une issue, commentez-la et assignez-vous si possible.

Branching
---------
- Créer une branche à partir de la branche de base (ex: main ou develop):
  - feature/<scope>-<brève-desc>
  - fix/<scope>-<brève-desc>

Commits
-------
- Messages clairs et courts (ex: "feat(auth): ajouter endpoint login").
- Lier l'issue: "closes #NN" si le commit/PR ferme l'issue.

Pull Requests
-------------
- Ouvrir une PR ciblant la branche de base.
- Inclure:
  - Objectif du changement
  - Captures/Étapes de test
  - Liste des commits importants
  - Indiquer reviewers demandés
- Attendre au moins une approbation de reviewer avant merge.

Tests & CI
---------
- Ajouter ou mettre à jour les tests relatifs à votre changement.
- CI doit réussir avant merge.

Code Review
-----------
- Être respectueux et constructif.
- Signaler les risques et impacts potentiels.

Sécurité
--------
- Ne pas committer de secrets.
- Si une vulnérabilité est découverte, ouvrir une issue privée si nécessaire et contacter les maintainers.

Style & linting
---------------
- Respecter les linters et conventions du projet (ex: eslint, prettier). Si non configurés, documenter le style suivi.

Merci !

Pour toute question de gouvernance: consulter docs/CONSTITUTION.md
