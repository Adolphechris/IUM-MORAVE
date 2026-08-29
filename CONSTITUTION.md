# 📜 CONSTITUTION DU CHANTIER IUM-MORAVE
### Loi Fondamentale de Développement & de Gouvernance Technique

> **Établissement d'Enseignement Supérieur - System Architecture**  
> *Cette Constitution définit les règles absolues, architecturales et opérationnelles qui régissent l'intégralité du projet IUM-MORAVE. Aucun code, module ou modification ne peut être intégré s'il enfreint les articles ci-dessous.*

---

## 🏛️ TITRE I : MISSION & INTÉGRITÉ DES DONNÉES
### Article 1 : Mission du Système
IUM-MORAVE est une plateforme critique de gestion universitaire et d'enseignement supérieur. Sa priorité absolue est la fiablité, la continuité de service et la transparence pour les étudiants, enseignants et administrateurs.

### Article 2 : Intégrité Académique & Zéro Perte
Toute opération touchant aux notes, crédits LMD (Licence, Master, Doctorat), réinscriptions, diplômes ou transactions financières doit être atomique, auditée et sécurisée. Aucune suppression destructive de données financières ou académiques n'est autorisée (principe d'immutabilité et d'archivage).

### Article 2.1 : Primauté des Maquettes Pédagogiques & Sécurité Académique Obligatoire
Toute évolution du système touchant aux cours, crédits ECTS, calculs de moyenne, relevés des côtes ou diplômes doit STRICTEMENT se conformer aux documents de référence fondamentaux du dépôt :
1. 🏛️ **[Témoin Officiel : Relevé des Cotes UNILU Page 4](file:///home/adolphe/IUM-MORAVE/docs/references/modele_releve_unilu_page4_temoin.md)** : Échantillon témoin national de référence pour la mise en page, les rubriques horaires, la délibération et les signatures.
2. 📘 **[Maquette Nationale ESU — Master ISI LMD](file:///home/adolphe/IUM-MORAVE/docs/curriculum-master-isi-lmd.md)**
3. 🔒 **[Sécurité & Validation des Relevés](file:///home/adolphe/IUM-MORAVE/docs/TRANSCRIPT_SECURITY.md)**
4. 🗃️ **[Modèle de Données LMD](file:///home/adolphe/IUM-MORAVE/docs/MODELE_DE_DONNEES_LMD.md)**

Aucune modification de la logique d'évaluation, du barème des mentions ou de la mise en page officielle des relevés ne peut être effectuée sans consulter et maintenir à jour ces documents de cadrage.

---

## 🏗️ TITRE II : ARCHITECTURE & STRUCTURE DU DÉPÔT
### Article 3 : Règle du Dépôt Unique (Monorepo)
Afin d'éviter tout éparpillement et perte de contexte, l'intégralité de la plateforme réside dans le dépôt unique `IUM-MORAVE`. La structure est strictly sectorisée comme suit :
```
IUM-MORAVE/
├── CONSTITUTION.md          # La présente loi fondamentale
├── TODO.md                  # Tracker master & feuille de route active
├── README.md                # Vue d'ensemble du système
├── .gemini/rules/           # Consignes permanentes IA & gouvernance
├── docs/                    # Spécifications, maquettes ESU, schémas DB
│   ├── references/          # Documents témoins & échantillons officiels (UNILU Page 4)
│   ├── curriculum-master-isi-lmd.md # Maquette pédagogique Master ISI LMD
│   ├── TRANSCRIPT_SECURITY.md       # Sécurité & validation des relevés
│   └── MODELE_DE_DONNEES_LMD.md     # Schéma relationnel LMD
├── apps/                    # Applications & Interfaces Utilisateur (Portail, Espaces)
│   ├── web/                 # Portail vitrine & public
│   ├── student-space/       # Espace Étudiants (Notes, Inscriptions, EDT)
│   ├── teacher-space/       # Espace Enseignants (Saisie des notes, Cours)
│   └── admin-dashboard/     # Espace Direction, Scolarité & RH
├── services/                # Microservices / Modules Métiers Backend
│   ├── core-api/            # API Centrale (Gestion académique & LMD)
│   ├── auth-service/        # Authentification & Gestion des Rôles (RBAC)
│   └── finance-service/     # Gestion des frais de scolarité & facturation
└── shared/                  # Composants, types TypeScript & utilitaires partagés
```

### Article 4 : Découpage & Indépendance des Modules
Chaque application et service dans `apps/` et `services/` doit posséder des responsabilités clairement délimitées (Single Responsibility Principle). Les dépendances croisées doivent obligatoirement passer par les modules partagés (`shared/`) ou les APIs contractuelles.

---

## 🔐 TITRE III : SÉCURITÉ, AUTHENTIFICATION & PERMISSIONS
### Article 5 : Contrôle d'Accès Basé sur les Rôles (RBAC)
L'accès à toutes les fonctionnalités est gouverné par une matrice de permissions stricte :
- **SuperAdmin / Direction** : Contrôle global et paramétrage du système.
- **Agent de Scolarité** : Gestion des dossiers étudiants, PV de délibération, réinscriptions.
- **Comptabilité / Finance** : Validation des paiements et génération des quittances.
- **Enseignant** : Saisie des notes, gestion de ses UE/ECUE et supports de cours.
- **Étudiant** : Consultation de ses propres données (Notes, Relevés, Emploi du temps, Statut financier).

### Article 6 : Confidentialité & Isolation des Données
Un étudiant ne peut **jamais** accéder aux données d'un autre étudiant. Les informations sensibles (mots de passe, jetons, secrets d'API) ne doivent **jamais** être stockées en clair ni poussées sur le dépôt Git.

---

## 🎨 TITRE IV : ESTHÉTIQUE & EXPÉRIENCE UTILISATEUR (UX/UI)
### Article 7 : Exigence d'Esthétique Supérieure & Documents Officiels
Conformément aux directives de design du projet :
- L'interface doit offrir un visuel **haut de gamme, moderne et dynamique** (thèmes adaptés, typographie soignée, micro-animations fluides, glassmorphism si pertinent).
- Les composants "basiques" ou les formulaires bruts non travaillés sont formellement **interdits**.
- L'expérience doit être ultra-réactive et 100% Responsive (Mobile, Tablette, Desktop).
- **Rendu des Documents Officiels** : Tout relevé de cotes doit intégrer le **blason officiel authentique de l'IUM Morave** en en-tête et en **filigrane centralisé au coeur de la page (`top: 50%; left: 50%`) avec 15% d'opacité**, conformément à l'échantillon témoin UNILU Page 4.

---

## 📝 TITRE V : RIGUEUR DE DÉVELOPPEMENT & SUIVI (TRACKER)
### Article 8 : Suivi Continu (Le Tracker Obligatoire)
Toute avancée, modification ou tâche planifiée doit impérativement être reflétée dans le fichier `TODO.md`. Il est interdit d'avancer "à l'aveugle" sans avoir coché et documenté l'étape en cours.

### Article 9 : Qualité du Code & Versionnement
- Le code doit être amplement documenté et typé.
- Tout commit doit présenter un message clair décrivant le module impacté (`feat(student-space): ...`, `fix(core-api): ...`).
- Aucun code cassé ou non fonctionnel ne doit être validé sur la branche principale `main`.

---

> *Proclamée et arrêtée pour servir de guide inaltérable au chantier IUM-MORAVE.*
