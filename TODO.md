# 📋 MASTER TODO & PROJECT TRACKER — IUM-MORAVE

> **STATUT GLOBAL DU CHANTIER** : 🚀 Phase 1 — Fondations & Structure Monorepo  
> **Dernière mise à jour** : 01 Août 2026 18:16
> **Prochaines actions** : corriger la connexion Supabase, valider le build, puis démarrer Phase 2.

---

## 📊 VUE D'ENSEMBLE DES PHASES

```mermaid
gantt
    title Feuille de Route IUM-MORAVE
    dateFormat  YYYY-MM-DD
    section Phase 1
    Fondations, Constitution & Monorepo     :active, 2026-08-01, 3d
    section Phase 2
    Securite, Auth & Matrice RBAC          : 2026-08-04, 4d
    section Phase 3
    Core API Academic & Systeme LMD         : 2026-08-08, 7d
    section Phase 4
    Portails Utilisateurs (Apps)            : 2026-08-15, 10d
    section Phase 5
    Finance, LMS & Finalisation             : 2026-08-25, 7d
```

---

## 🛠️ SUIVI DÉTAILLÉ DES PHASES

### PHASE 1 : FONDATIONS & STRUCTURATION MONOREPO
- [x] **Liaison GitHub** : Connecter le dossier local au dépôt GitHub `Adolphechris/IUM-MORAVE`.
- [x] **Gouvernance** : Rédiger et promulguer la [CONSTITUTION.md](file:///home/adolphe/IUM-MORAVE/CONSTITUTION.md).
- [x] **Master Tracker** : Mettre en place le fichier [TODO.md](file:///home/adolphe/IUM-MORAVE/TODO.md).
- [x] **Migration CI** : Réparer le workflow `run-migrations` et valider les checks `run-migrations` + `run-migrations-safe`.
- [ ] **Confirmation Supabase** : Vérifier que le schéma et les seeds sont bien appliqués sur Supabase.
- [ ] **Build CI** : Attendre le résultat du check `build` avant fusionner.
- [ ] **Architecture Dossier** : Créer l'arborescence physique Monorepo (`apps/`, `services/`, `shared/`, `docs/`).
- [ ] **Documentation globale** : Mettre à jour le [README.md](file:///home/adolphe/IUM-MORAVE/README.md) avec le plan complet.

---

### SPRINT 0 : PREPARATION ET VERIFICATION
- [x] Vérifier et corriger la liaison GitHub + PR.
- [x] Réparer le workflow de migration Supabase (`run-migrations`).
- [x] Valider `run-migrations` et `run-migrations-safe` sur CI.
- [ ] Confirmer l’application du schéma Supabase dans le dashboard ou via un runner IPv6.
- [ ] Finaliser l’état de la base de données avant le développement fonctionnel.
- [x] Créer les premières issues GitHub pour les epics prioritaires.

#### Backlog initial GitHub
- Issue #179 — Infra & base de données: valider l’accès Supabase et définir le schéma initial
- Issue #180 — Architecture monorepo: créer l’arborescence apps/services/shared/docs
- Issue #181 — Authentification & RBAC: définir le modèle utilisateur et le premier flux d’auth
- Issue #182 — API académique core: définir les entités de base facultés/programmes/parcours
- Issue #183 — Système mail professionnel: notifications et communication officielle
- Issue #184 — Générateur sécurisé de relevés de notes conforme aux normes congolaises

### SPRINT 1 : DEMARRAGE DU DEVELOPPEMENT
- [ ] Définir l’architecture Monorepo et créer l’arborescence `apps/`, `services/`, `shared/`, `docs/`.
- [ ] Spécifier le modèle utilisateur et la sécurité d’accès.
- [ ] Construire le module `services/auth-service` pour auth et RBAC.
- [ ] Préparer le socle API core pour les données académiques.

### SPRINT 2 : MVP PUBLIC ET ESPACE UTILISATEUR
- [ ] Développer le portail public basique (`apps/web-portal`) avec pages institutionnelles.
- [ ] Créer l’espace utilisateur étudiant/enseignant minimal.
- [ ] Mettre en place les premières pages de consultation de programmes, facultés et actualités.
- [ ] Connecter les premiers flux frontaux au backend API core.
- [ ] Ajouter un système de courriel professionnel pour les notifications et communications officielles.
- [ ] Concevoir le générateur sécurisé de relevés de notes conforme aux normes congolaises.

### SPRINT 3 : MODULES ACADÉMIQUES & ADMINISTRATION
- [ ] Implémenter la gestion des facultés, des programmes et des parcours.
- [ ] Ajouter le module de gestion des inscriptions et des délibérations.
- [ ] Construire les premières fonctions d’administration et de reporting.
- [ ] Préparer l’intégration du workflow de notes et des documents académiques.
- [ ] Garantir la sécurisation des relevés de notes et des diplômes numériques.

---

### PHASE 2 : AUTHENTIFICATION, SÉCURITÉ & ROLES (RBAC)
- [ ] **Spécification du Modèle Utilisateur** : Définir le schéma complet (Étudiants, Enseignants, Admin, Finance).
- [ ] **Module `services/auth-service`** :
  - [ ] Gestion des identifiants & réinitialisation sécurisée.
  - [ ] Génération & validation de tokens JWT sécurisés avec rôles.
  - [ ] Middleware de contrôle d'accès (RBAC).

---

### PHASE 3 : CORE ACADÉMIQUE & SYSTÈME LMD (LICENCE - MASTER - DOCTORAT)
- [ ] **Modélisation de la Scolarité** :
  - [ ] Universités / Facultés / Départements.
  - [ ] Offres de formation, Unités d'Enseignement (UE) et ECUE.
  - [ ] Attribution des crédits ECTS / LMD.
- [ ] **Module `services/core-api`** :
  - [ ] CRUD Filières & Unités d'Enseignement.
  - [ ] Gestion des dossiers étudiants & matricules.
  - [ ] Moteur de saisie des notes et calcul des moyennes ponderées (GPA).
  - [ ] Générateur de procès-verbaux de délibération & relevés de notes.

---

### PHASE 4 : PORTAILS & ESPACES UTILISATEURS (FRONTEND INTERFACES)
- [ ] **Module `shared/`** : Design System, thèmes CSS, composants communs UI (Tableaux, Modales, Badges, Header).
- [ ] **App `apps/web-portal`** : Portail public d'information, admissions et présentation de l'IUM-MORAVE.
- [ ] **App `apps/student-space`** :
  - [ ] Dashboard personnalisé de l'étudiant.
  - [ ] Consultation des notes, moyenne générale et validation des UE.
  - [ ] Telechargement des relevés de notes & certificats de scolarité.
  - [ ] Consultation de l'emploi du temps et calendrier académique.
- [ ] **App `apps/teacher-space`** :
  - [ ] Dashboard Enseignant.
  - [ ] Interface de saisie rapide et sécurisée des notes.
  - [ ] Dépôt des supports de cours & gestion des absences.
- [ ] **App `apps/admin-dashboard`** :
  - [ ] Vue 360° Scolarité (Inscriptions, Statistiques, Effectifs).
  - [ ] Validation des délibérations et clôture des semestres.
  - [ ] Audit & Journal des actions système.

---

### PHASE 5 : COMPTABILITÉ, LMS & DÉPLOIEMENT
- [ ] **Module `services/finance-service`** :
  - [ ] Suivi du plan de règlement des frais de scolarité.
  - [ ] Génération automatique de reçus & quittances de paiement.
  - [ ] Blocage/Déblocage automatique des accès aux relevés selon le statut financier.
- [ ] **Système de Notification** : Alerte email/SMS pour les absences, notes publiées, et relances financières.
- [ ] **Intégration & Tests Globaux** : Validation de bout en bout et déploiement.

---

## 📌 NORMES TECHNIQUE ET JOURNAL DES COMMITS
| Date | Action | Auteur | Statut |
| :--- | :--- | :--- | :--- |
| 2026-08-01 | Initialisation du projet et liaison GitHub | Antigravity | ✅ Terminé |
| 2026-08-01 | Rédaction de la Constitution (`CONSTITUTION.md`) | Antigravity | ✅ Terminé |
| 2026-08-01 | Création du Tracker Master (`TODO.md`) | Antigravity | ✅ Terminé |
| 2026-08-01 | Correction du workflow de migration et validation des checks `run-migrations` + `run-migrations-safe` | Copilot | ✅ Terminé |
