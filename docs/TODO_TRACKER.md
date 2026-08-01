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

### Epics dérivés du Cahier des charges (IUM)
- [ ] Epic: Interface publique (site vitrine, pages facultés, actualités, calendriers académiques)
- [ ] Epic: Espaces privés & authentification (étudiants, enseignants, admins)
- [ ] Epic: CMS & gestion des contenus institutionnels
- [ ] Epic: Modules administratifs (inscriptions, gestion académique, communiqués)
- [ ] Epic: Infrastructure, CI/CD et déploiement (workflows, environnements de test)
- [ ] Epic: Accessibilité, performance et sécurité
- [ ] Epic: Gouvernance & documentation (constitution, décisions, tracker)

> Voir docs/CAHIER_DES_CHARGES.md pour le cahier des charges complet.

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

## Actions immédiates recommandées (Sprint 0)
- [ ] Constitution du comité de pilotage et attribution des rôles (chef de projet, responsable tech, responsable contenu).
- [ ] Analyse détaillée des besoins (interviews, recueils des attentes des acteurs, priorisation des services).
- [ ] Vérifier l’infrastructure CI et la connectivité de la base Supabase avant le développement fonctionnel.
- [x] Traduire les actions d’initialisation en issues GitHub : infra, CI, modèle de données, roadmap.

### Backlog initial créé
- [x] Milestone MVP v0.1
- [x] Issue #179 — infra & base de données
- [x] Issue #180 — architecture monorepo
- [x] Issue #181 — auth & RBAC
- [x] Issue #182 — API académique core
- [ ] Benchmark et inspirations graphiques (collecte d'exemples, design intentionnel).
- [ ] Choix du stack technique et définition de l'architecture initiale (frontend, backend, base de données, CMS si applicable).
- [ ] Création du milestone "MVP v0.1" et définition des epics prioritaires.
- [ ] Mise en place d'un environnement de staging et d'un workflow CI minimal (build + tests).
- [ ] Plan de migration et acquisition du nom de domaine (.cd) préparatoire.

> Ces tâches doivent être traduites en issues GitHub, assignées et estimées avant le démarrage effectif.

## Architecture & Arborescence (priorité)
- [ ] Définir l'architecture générale (couches présentation/fonctionnelle/données/sécurité) et documenter dans docs/ARCHITECTURE.md.
- [ ] Détailler l'arborescence du site (ACCUEIL, UNIVERSITÉ, FORMATIONS, ADMISSIONS, VIE, RECHERCHE, DOCUMENTATION, CONTACT) et préparer les templates de page.
- [ ] Décider du principe de modularité et définir modules prioritaires (actualités, pages facultés, CMS, authentication, inscriptions).

## UX / UI / Design
- [ ] Rédiger le cahier des charges UX/UI (principes esthétiques, typographie, palette de couleurs, responsive mobile-first).
- [ ] Lancer un benchmark visuel et proposer 3 directions graphiques (moodboards) pour validation.
- [ ] Choisir la typographie et livrer les recommandations (polices, tailles, interlignage).
- [ ] Planifier une vérification d'accessibilité (WCAG) et définir un audit initial.
- [ ] Établir un plan de performance (optimisation images, lazy loading, audits Lighthouse).

> Traduire ces items en issues GitHub (architecture, arborescence, UX/UI, accessibilité, performance) pour assignation et planification.

## Partie III — Architecture fonctionnelle (18 chapitres)
- [ ] Architecture fonctionnelle globale (modules: public, étudiant, enseignant, admin, docs, services académiques, communication).
- [ ] Page d'accueil dynamique (contenus administrables: actualités, événements, formations, messages officiels, contact).
- [ ] Présentation institutionnelle (pages administrables, documents officiels téléchargeables).
- [ ] Gestion des facultés (pages facultés, programmes, responsables, actualités, contacts).
- [ ] Gestion des programmes académiques (fiches formation: intitulé, niveau, durée, conditions, débouchés).
- [ ] Module admissions et inscriptions (formulaires en ligne, dépôt candidature, suivi, notifications).
- [ ] Actualités et événements (publication, calendrier, archives, partage social).
- [ ] Vie universitaire (activités, associations, galerie multimédia).
- [ ] Recherche scientifique (publications, chercheurs, projets, partenariats).
- [ ] Bibliothèque numérique (catalogue, documents pédagogiques, recherche documentaire).
- [ ] Gestion documentaire institutionnelle (classement, recherche, téléchargement sécurisé).
- [ ] Portail étudiant (profil, inscriptions, documents, horaires, résultats) — espace sécurisé.
- [ ] Portail enseignant (profil, publications, gestion de cours, communication académique).
- [ ] Espace administration (tableau de bord, gestion utilisateurs, statistiques, configuration).
- [ ] Vérification numérique des diplômes (recherche par numéro, QR, confirmation officielle) — futur.
- [ ] Gestion des demandes en ligne (formulaires, suivi, notifications, historique).
- [ ] Moteur de recherche interne (recherche sur pages, formations, documents, actualités).
- [ ] Évolution vers un système universitaire complet (ERP, LMS, mobile, paiements, IA, automatisation).

> Traduire ces items en issues GitHub pour assignation, estimation et planification.

## Partie IV — Architecture technique & développement (15 chapitres)
- [ ] Choix technologiques (principes, éviter obsolescence, préférer open source).
- [ ] Architecture frontend (responsive, composants réutilisables, performance).
- [ ] Architecture backend (gestion utilisateurs, contenus, formulaires, sécurité).
- [ ] Base de données (modèle: users, faculties, programs, articles, documents, applications).
- [ ] API & intégrations (REST/GraphQL, interconnexion mobile et services externes).
- [ ] Développement avec GitHub (branches, PR, tests, releases).
- [ ] Environnement de développement gratuit (GitHub, outils gratuits, environnements de test).
- [ ] Migration vers production (DNS, hébergement, HTTPS, migration données).
- [ ] Domaine officiel et hébergement (.CD acquisition, HA, backups, sécurité).
- [ ] Sécurité informatique (HTTPS, gestion permissions, journalisation, prevention attaques).
- [ ] Performance & optimisation (compression, cache, images optimisées, lazy loading).
- [ ] Sauvegarde & récupération (backups automatiques, procédures de restauration).
- [ ] Tests logiciels (unit, integration, e2e, sécurité, performance).
- [ ] Déploiement continu (GitHub Actions, staging/prod, rollbacks).
- [ ] Documentation technique (architecture, installation, maintenance).

> Traduire ces items en issues GitHub pour assignation, estimation et planification.

## Identité visuelle & Design System (Partie II)
- [ ] Rédiger la charte graphique (logo, couleurs, règles d'usage) et créer docs/IDENTITE_VISUELLE.md.
- [ ] Créer le Design System (components, tokens, UI kit) et ajouter docs/DESIGN_SYSTEM.md.
- [ ] Produire 3 directions graphiques (moodboards) et prototypes basiques (mobile-first).
- [ ] Définir la palette de couleurs et les couleurs fonctionnelles (success, alert, info).
- [ ] Finaliser la typographie et le scale typographique (h1..p) et livrer recommandations.
- [ ] Définir les composants réutilisables prioritaires (boutons, menus, cartes, formulaires) et créer un catalogue.
- [ ] Créer templates de pages principales (Accueil, Faculté, Formation, Actualité, Institutionnelle) et les pousser en tant que maquettes/squelettes.
- [ ] Mettre en place le processus de validation graphique et QA (checklist qualité graphique).

> Traduire ces items en issues GitHub pour assignation, estimation et planification.

## Contenu éditorial & SEO
- [ ] Définir la gouvernance des contenus et créer docs/CONTENT_GOVERNANCE.md (rôles: admin, communication, secrétariat, responsables facultés).
- [ ] Mettre en place les types de contenus (pages institutionnelles, pages académiques, actualités, documents, multimédia) et créer un guide de métadonnées.
- [ ] Choisir et configurer le CMS (headless ou intégré) et préparer la migration du contenu existant.
- [ ] Planifier le multilinguisme (Français initial, roadmap pour l'Anglais).
- [ ] Rédiger et implémenter la stratégie SEO initiale (docs/SEO_STRATEGY.md): sitemaps, meta, structured data.
- [ ] Prévoir l'intégration des réseaux sociaux et les mécanismes de relai de publications.

## Feuille de route & phases
- [ ] Formaliser la feuille de route (Phase 1 → Phase 4) et créer docs/ROADMAP.md.
- [ ] Définir jalons et dates cibles pour MVP, Beta et mise en production.
- [ ] Traduire ces jalons en milestones GitHub et assigner les epics correspondants.

> Traduire ces items en issues GitHub (contenu, SEO, CMS, roadmap) pour assignation et planification.

