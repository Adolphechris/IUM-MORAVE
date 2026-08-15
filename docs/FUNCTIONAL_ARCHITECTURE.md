# Architecture fonctionnelle complète - IUM-MORAVE (Partie III)

Date: 2026-08-01

Objectif
--------
Documenter l'architecture fonctionnelle du portail, détaillant les modules, responsabilités et fonctionnalités attendues pour transformer le site en une plateforme universitaire dynamique.

Résumé des modules
------------------
1. Portail public — pages institutionnelles, actualités, événements, SEO.
2. Espace étudiant — profil, inscriptions, documents, résultats, notifications.
3. Espace enseignant — profil, supports pédagogiques, gestion des cours.
4. Espace administration — tableau de bord, gestion comptes, statistiques.
5. Gestion documentaire — dépôt, classement, recherche, téléchargement.
6. Services académiques — programmes, calendrier, inscriptions.
7. Communication — actualités, évènements, réseaux sociaux.

Chapitre par chapitre
---------------------
(voir docs/CAHIER_DES_CHARGES.md Partie III pour la version narrative complète)

Fonctionnalités transverses
--------------------------
- Authentification & autorisations (RBAC)
- API publique et privée (REST/GraphQL)
- Recherche rapide interne (possibilité d'intégrer Elasticsearch)
- CMS pour gestion des contenus (headless ou intégré)
- Stockage sécurisé des documents (S3 compatible)
- Monitoring & logs

Sécurité & conformité
---------------------
- RGPD-like handling for personal data where applicable
- HTTPS everywhere
- Gestion des secrets via GitHub Secrets
- Sauvegardes régulières

Roadmap fonctionnelle (suggestion)
----------------------------------
- Phase 1 (MVP): Portail public + CMS minimal + Page d'accueil dynamique + actualités + contacts.
- Phase 2: CMS complet, gestion facultés, programmes, actualités avancées.
- Phase 3: Espaces privés (étudiant/enseignant) et module admissions.
- Phase 4: Services avancés (bibliothèque numérique, vérification diplômes, LMS).

Prochaine étape
---------------
- Dresser la liste détaillée de user stories pour chaque module et créer issues/epics correspondants.
