# Journal des décisions (DECISIONS)

Date: 2026-08-01

Utiliser ce fichier pour consigner les décisions d'architecture, gouvernance et autres choix majeurs.

Format recommandé:
- Date: YYYY-MM-DD
- Décision: titre court
- Contexte: pourquoi
- Options considérées: liste
- Décision finale: ce qui est retenu
- Auteurs / approbateurs: liste

Exemple:
- Date: 2026-08-01
- Décision: Centraliser le projet dans un monorepo unique
- Contexte: éviter la dispersion des dépôts et faciliter la gouvernance
- Options considérées: monorepo, multi-repo
- Décision finale: monorepo
- Auteurs / approbateurs: comité de pilotage

- Date: 2026-08-01
- Décision: Verrouillage stack pour V1 et création du scaffold
- Contexte: Préparer un scaffold minimal pour permettre le démarrage simultané du frontend et backend et établir CI basique
- Options considérées: Next.js (React) + Node/Express API vs Next.js + NestJS vs Django
- Décision finale: Next.js (frontend) + Node/Express API minimal pour MVP, monorepo workspaces, shared UI package. Outils: npm workspaces, GitHub Actions CI baseline.
- Auteurs / approbateurs: Antigravity 2.0 (documented)
