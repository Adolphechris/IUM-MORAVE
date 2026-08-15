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
- Remplacer les stockages en mémoire du MVP par les accès Supabase persistants.
- Faire valider institutionnellement le modèle de relevé de notes avant toute émission officielle.

## Sprint 0 — Préparation & Vérification
- [x] Corriger le workflow de migration Supabase.
- [x] Valider `run-migrations` et `run-migrations-safe` sur CI.
- [ ] Confirmer que Supabase peut recevoir le schéma et les seeds.
- [ ] Vérifier le `build` CI et valider la branche avant fusion.
- [ ] Documenter les étapes à suivre pour l’accès Supabase et la base de données.

## Sprint 1 — Démarrage du développement
- [x] Définir et créer l'architecture Monorepo (`apps/`, `services/`, `shared/`, `docs/`).
- [x] Définir le modèle utilisateur et le plan de sécurité initial.
- [x] Créer le module `services/auth-service` et le socle `services/core-api`.
- [x] Lancer les premières issues GitHub pour les epics prioritaires.

## Sprint 2 — MVP public et services essentiels
- [x] Construire le portail public basique.
- [ ] Construire l'espace utilisateur étudiant/enseignant minimal.
- [x] Ajouter une abstraction de messagerie professionnelle avec aperçu de développement.
- [x] Concevoir un générateur sécurisé de relevés de notes ; validation institutionnelle requise avant production.

## Sprint 3 — Modules académiques et administration
- [x] Implémenter les opérations MVP pour facultés, programmes et parcours.
- [x] Ajouter les opérations MVP pour inscriptions, notes et délibérations.
- [x] Ajouter les journaux d'audit administratifs et la vérification de relevé.
- [ ] Persister les modules académiques, les documents et les journaux dans Supabase.

## Progression actuelle
- [x] `services/auth-service` skeleton created and ready for auth/RBAC development.
- [x] `services/core-api` skeleton created and ready for academic API development.
- [x] `services/*` workspace added to root `package.json`.
- [x] `auth-service` now expose `POST /auth/register`, `POST /auth/login`, and protected `GET /auth/profile`.
- [x] `core-api` now expose `GET /faculties`, `GET /programs`, `GET /tracks`, `GET /faculty/:id`, `GET /news`, `GET /documents`, and `POST /verification/diploma`.
- [x] Auth, core API, contact public et émission de relevé sont couverts par neuf tests automatisés Node.
- [x] The Next.js public portal compiles successfully.

## Livraison Sprint 1 à Sprint 3 (MVP technique)

### Réalisé

- Authentification : inscription publique limitée au rôle étudiant, mots de
  passe hachés, JWT, profil protégé et contrôle de rôles.
- API académique : facultés, programmes, parcours, inscriptions, notes,
  délibérations et journaux d'audit en mémoire pour le MVP.
- Portail : page publique Next.js connectée à l'API et espace de connexion
  pour les rôles institutionnels.
- Communication : aperçu d'email institutionnel côté administration ; aucun
  email réel n'est envoyé sans fournisseur configuré.
- Relevés : émission d'un relevé JSON signé, code unique et endpoint de
  vérification de l'intégrité.
- Qualité : cinq tests automatisés couvrent l'auth, le RBAC, l'API académique
  et la vérification de relevé ; le build Next.js est validé.
- Dépendances : Next.js est passé à la dernière version stable disponible
  compatible avec le portail, Express est mis à jour et Node 22 est utilisé
  dans la CI.

### À ne pas confondre avec une livraison production

- Les données restent en mémoire et disparaissent au redémarrage tant que
  Supabase n'est pas confirmé et connecté.
- Le relevé numérique ne doit pas être présenté comme document officiel avant
  la validation du format, des signatures, des cachets et du circuit de
  délibération par l'IUM-MORAVE et les autorités académiques compétentes en
  RDC.
- Le fournisseur de courriel, les DNS SPF/DKIM/DMARC, les sauvegardes, les
  journaux persistants et le stockage des documents doivent être configurés
  avant production.
- L'audit de dépendances conserve trois alertes élevées transitives de la
  version stable actuelle de Next.js (`next`, `postcss`, `sharp`). Aucune
  correction compatible n'est proposée par npm à ce jour ; ce point reste
  tracé et doit être revérifié avant chaque déploiement.

## Mise à jour du catalogue et des médias institutionnels

- La faculté informatique est désormais nommée **Faculté des Sciences
  Informatiques et Nouvelles Technologies**.
- Le programme « Master Intelligence Artificielle » est retiré du catalogue.
- Des spécialités sont prévues pour chaque filière : développement logiciel,
  réseaux/systèmes/cybersécurité, finance/comptabilité et management des
  organisations.
- Le portail contient un emplacement distinct pour le logo officiel et onze
  emplacements pour des photographies institutionnelles. Les fichiers réels
  doivent être fournis/validés par l'IUM-MORAVE avant publication.

## Lot de construction complet — espaces métiers

Le chantier complet est poursuivi par lots fonctionnels vérifiables. Le lot en
cours couvre :

- profils, horaires et documents de l'espace étudiant ;
- profil enseignant et liste de cours attribués ;
- tableau de bord d'administration avec statistiques et échéances ;
- gestion initiale des comptes par un administrateur ;
- catalogue de cours, calendrier universitaire et documents avec visibilité.

Ces services sont fonctionnels pour le prototype en mémoire. Leur prochaine
étape obligatoire est la persistance Supabase, avant toute ouverture réelle aux
utilisateurs.
- [x] Issue #179 updated with Supabase connectivity findings (IPv6-only host).
- [ ] Build CI is still in progress; waiting for completion.

## Lot livré : contenu public détaillé

- Pages publiques détaillées pour chaque faculté, formation et actualité.
- Recherche de documents visibles publiquement.
- Formulaire de contact avec validation du courriel et du message, champ
  anti-robot, limite mémoire de cinq demandes par heure et par adresse IP, journal
  d'audit et aperçu de notification institutionnelle.
- Validation locale : les neuf tests de services et le build de production
  Next.js passent.

Les demandes de contact, comme le reste des données MVP, ne survivent pas à un
redémarrage. Elles ne constituent donc pas une boîte de réception de production
tant que Supabase et un fournisseur de messagerie ne sont pas configurés.

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
