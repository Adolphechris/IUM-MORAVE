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
├── docs/                    # Spécifications & Schémas d'architecture
├── apps/                    # Applications Frontend
│   ├── web-portal/          # Portail d'information public
│   ├── student-space/       # Espace Étudiants (Notes, Relevés, EDT)
│   ├── teacher-space/       # Espace Enseignants (Saisie des notes, Cours)
│   └── admin-dashboard/     # Espace Direction & Scolarité
├── services/                # Backend API Services
│   ├── core-api/            # API Académique & Gestion LMD
│   ├── auth-service/        # Authentification & Rôles (RBAC)
│   └── finance-service/     # Gestion Financière & Frais
└── shared/                  # UI Design System & Typages partagés
```

---

## 🚀 DÉMARRAGE RAPIDE
*Instructions d'installation et de lancement à mesure du déploiement des modules.*

## 🔧 ÉTAT ACTUEL DU CHANTIER
- Phase en cours : **Sprint 0 — Préparation et validation**
- Workflow migration Supabase réparé et check `run-migrations` validé
- Backlog initial créé avec les issues GitHub #179 à #184
- Prochaine étape : validation du build CI et confirmation du schéma Supabase

## 📌 DOCUMENTS CLÉS
- **[Tracker master & TODO](TODO.md)**
- **[Plan de sprint](docs/SPRINT_PLAN.md)**
- **[Rapport de développement](docs/DEVELOPMENT_REPORT.md)**
