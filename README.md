# 🏫 IUM-MORAVE — Système Intégré de Gestion Universitaire

> **Établissement d'Enseignement Supérieur**  
> Plateforme globale de gestion académique, administrative, financière et pédagogique.

---

## 📚 DOCUMENTS DE GOUVERNANCE & SUIVI
- 📜 **[Constitution du Projet (`CONSTITUTION.md`)](file:///home/adolphe/IUM-MORAVE/CONSTITUTION.md)** : Loi fondamentale régissant l'architecture, la sécurité, l'UI/UX et la qualité du code.
- 🏛️ **[Témoin Officiel : Relevé des Cotes UNILU Page 4 (`docs/references/modele_releve_unilu_page4_temoin.md`)](file:///home/adolphe/IUM-MORAVE/docs/references/modele_releve_unilu_page4_temoin.md)** : **[OBLIGATOIRE]** Échantillon national de référence (rubriques horaires Cours/TD+TP+TPE, crédits, délibération et signatures).
- 🛡️ **[Blason Officiel IUM-MORAVE (`docs/references/blason-ium-morave-original.jpg`)](file:///home/adolphe/IUM-MORAVE/docs/references/blason-ium-morave-original.jpg)** : Armoiries officielles et filigrane central à 15% d'opacité.
- 🎓 **[Maquette Nationale ESU — Master ISI LMD (`docs/curriculum-master-isi-lmd.md`)](file:///home/adolphe/IUM-MORAVE/docs/curriculum-master-isi-lmd.md)** : **[OBLIGATOIRE]** Référentiel des 120 ECTS, volumes horaires, découpage S1-S4 et barème des mentions LMD.
- 🔒 **[Sécurité & Validation des Relevés (`docs/TRANSCRIPT_SECURITY.md`)](file:///home/adolphe/IUM-MORAVE/docs/TRANSCRIPT_SECURITY.md)** : **[OBLIGATOIRE]** Exigences de signature cryptographique HMAC-SHA-256, traçabilité et conformité avec le modèle visuel UNILU Page 4.
- 🗃️ **[Modèle de Données LMD (`docs/MODELE_DE_DONNEES_LMD.md`)](file:///home/adolphe/IUM-MORAVE/docs/MODELE_DE_DONNEES_LMD.md)** : Architecture relationnelle des facultés, cours et attestations.
- 📋 **[Tracker Master & TODO (`TODO.md`)](file:///home/adolphe/IUM-MORAVE/TODO.md)** : Tableau de bord complet et feuille de route dynamique du chantier.

---

## 🏛️ ARCHITECTURE MONOREPO

```
IUM-MORAVE/
├── CONSTITUTION.md          # Charte fondamentale du projet
├── TODO.md                  # Tracker master des tâches
├── README.md                # Documentation principale
├── package.json             # Workspaces npm (apps, services, shared)
├── deploy.sh                # Script de déploiement complet
├── docs/                    # Spécifications & Schémas d'architecture
├── apps/                    # Applications Frontend
│   ├── web/                 # Portail public MVP (Next.js)
│   ├── student-space/       # Espace Étudiants (Notes, Relevés, EDT)
│   ├── teacher-space/       # Espace Enseignants (Saisie des notes, Cours)
│   └── admin-dashboard/     # Espace Direction & Scolarité
├── services/                # Backend API Services
│   ├── auth-service/        # Authentification & Rôles (RBAC) — port 4001
│   ├── core-api/            # API Académique & Gestion LMD — port 4002
│   ├── finance-service/     # Gestion financière & paiements — port 4003
│   └── notification-service # Notifications email/SMS — port 4004
└── shared/                  # UI Design System & Typages partagés
```

---

## 🚀 DÉMARRAGE RAPIDE

```bash
# Installation des dépendances du monorepo
npm install

# Services backend
npm run start:auth      # http://localhost:4001
npm run start:core-api  # http://localhost:4002

# Frontend portail
cd apps/web && npm run dev   # http://localhost:3000

# Espaces métiers
cd apps/student-space && npm run dev   # http://localhost:3001
cd apps/teacher-space && npm run dev   # http://localhost:3002
cd apps/admin-dashboard && npm run dev # http://localhost:3003
```

## 🔧 ÉTAT ACTUEL DU CHANTIER
- ✅ **Toutes les phases terminées** (100% développement)
- Services backend opérationnels : `auth-service` (4001), `core-api` (4002), `finance-service` (4003), `notification-service` (4004)
- Portail public MVP développé (`apps/web`)
- Espaces métiers complets (`apps/student-space`, `apps/teacher-space`, `apps/admin-dashboard`)
- CI verte : 32 tests automatisés passent
- Prochaine étape : review PR #186 + configuration déploiement

## 🚀 DÉPLOIEMENT

### Local
```bash
# Installation
npm install

# Services backend
npm run start:auth      # http://localhost:4001
npm run start:core-api  # http://localhost:4002
npm run start:finance   # http://localhost:4003
npm run start:notify    # http://localhost:4004

# Frontend
cd apps/web && npm run dev        # http://localhost:3000
cd ../student-space && npm run dev # http://localhost:3001
cd ../teacher-space && npm run dev  # http://localhost:3002
cd ../admin-dashboard && npm run dev # http://localhost:3003
```

### Production (un seul script)
```bash
chmod +x deploy.sh
./deploy.sh
```

### Configuration
Copiez les fichiers `.env.production.example` dans chaque service et remplacez les valeurs par vos clés Supabase et votre secret JWT.

## 📌 DOCUMENTS CLÉS
- **[Tracker master & TODO](TODO.md)**
- **[Plan de sprint](docs/SPRINT_PLAN.md)**
- **[Rapport de développement](docs/DEVELOPMENT_REPORT.md)**
