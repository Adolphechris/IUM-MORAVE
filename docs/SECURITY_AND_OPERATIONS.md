# Sécurité & Exploitation - IUM-MORAVE

Date: 2026-08-01

Objectifs
---------
Décrire les pratiques de sécurité, sauvegarde et exploitation nécessaires pour garantir la disponibilité et la protection des données.

Mesures de sécurité recommandées
--------------------------------
- HTTPS pour toutes les connexions.
- Gestion des secrets via GitHub Secrets et accès restreint.
- Authentification robuste (OAuth2 / OIDC) et RBAC.
- Journalisation et monitoring centralisé (Sentry / Prometheus / ELK).
- Scans de sécurité réguliers (dependabot, nmap, audits de dépendances).

Sauvegarde & récupération
-------------------------
- Backups automatiques quotidiens des bases et stockage d'objets.
- Retention policy (30 jours par défaut, archivage long terme selon réglementation).
- Procédure de restauration testée (runbook).

Exploitation & runbook
----------------------
- Procédures de déploiement (staging -> prod), rollbacks, et communications d'incident.
- Contacts d'urgence et SLA internes.

Conformité & données
--------------------
- Protection des données personnelles (pseudo-anonymisation si nécessaire).
- Politique de conservation des données documentée.

Prochaine étape
---------------
- Créer docs/OPERATIONAL_RUNBOOK.md (procédures pas-à-pas) et templates pour sauvegarde et monitoring.
