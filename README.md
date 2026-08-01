# 🏫 IUM-MORAVE — Système Intégré de Gestion Universitaire

> **Établissement d'Enseignement Supérieur**  
> Plateforme globale de gestion académique, administrative, financière et pédagogique.

---

## 📚 DOCUMENTS DE GOUVERNANCE & SUIVI
- 📜 **[Constitution du Projet (`CONSTITUTION.md`)](file:///home/adolphe/IUM-MORAVE/CONSTITUTION.md)** : Loi fondamentale régissant l'architecture, la sécurité, l'UI/UX et la qualité du code.
- 📋 **[Tracker Master & TODO (`TODO.md`)](file:///home/adolphe/IUM-MORAVE/TODO.md)** : Tableau de bord complet et feuille de route dynamique du chantier.

---

## 🏛️ ARCHITECTURE MONOREPO

```
IUM-MORAVE/
├── CONSTITUTION.md          # Charte fondamentale du projet
├── TODO.md                  # Tracker master des tâches
├── README.md                # Documentation principale
├── package.json             # Workspaces npm (apps, packages, services)
├── docs/                    # Spécifications & Schémas d'architecture
├── apps/                    # Applications Frontend
│   ├── web/                 # Portail public MVP (Next.js)
│   ├── student-space/       # Espace Étudiants (Notes, Relevés, EDT)
│   ├── teacher-space/       # Espace Enseignants (Saisie des notes, Cours)
│   └── admin-dashboard/     # Espace Direction & Scolarité
├── services/                # Backend API Services
│   ├── auth-service/        # Authentification & Rôles (RBAC)
│   └── core-api/            # API Académique & Gestion LMD
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
- Phase en cours : **Développement des espaces métiers et intégration frontend**
- Services backend opérationnels : `auth-service` (4001) et `core-api` (4002)
- Portail public MVP développé (`apps/web`)
- Tests unitaires des services en place
- Prochaine étape : développement des espaces dédiés et intégration Supabase (déploiement)

## 📌 DOCUMENTS CLÉS
- **[Tracker master & TODO](TODO.md)**
- **[Plan de sprint](docs/SPRINT_PLAN.md)**
- **[Rapport de développement](docs/DEVELOPMENT_REPORT.md)**
