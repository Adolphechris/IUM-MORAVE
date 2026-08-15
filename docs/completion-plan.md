# Plan de complétion — IUM-MORAVE
**Objectif :** passer de ~85 % à 100 % sans commandes à exécuter manuellement. Chaque section indique ce qui doit être modifié/créé, par quel fichier, et dans quel ordre.

---

## 0. Règles d’exécution
- Toutes les modifications doivent se faire par edition de fichiers uniquement.
- Aucune étape ne dépend d’une commande terminale de la part du demandeur.
- Les corrections sont classées par vague pour éviter les conflits.
- Chaque vague peut être validée par un redémarrage unique de `core-api`.

---

# VAGUE A — Sécurisation immédiate des secrets
**Priorité :** critique  
**Durée estimée :** 1 h

## A.1. Externaliser les secrets du générateur de documents
### Fichiers à modifier
- `services/core-api/src/security-service.js`
- `services/core-api/src/pdf-service.js`
- `services/core-api/src/lmd-engine.js`

### Modifications
- Supprimer les chaînes en dur :
  - `IUM-MORAVE-PDF-SIGN`
  - `IUM-MORAVE-WATERMARK`
  - `IUM-MORAVE-TIMESTAMP`
  - `IUM-MORAVE-ADVANCED-SIGN`
  - `IUM-MORAVE-DIPLOMA`
- Les remplacer par des variables d’environnement :
  - `TRANSCRIPT_SIGNING_SECRET`
  - `DOCUMENT_SECURITY_SECRET`
- Ajouter une validation au démarrage : si `NODE_ENV === 'production'` et qu’un secret manque, le service refuse de démarrer.

## A.2. Nettoyage environnement
### Fichiers à modifier
- `.env.production` : vérifier qu’il n’est plus commité ou qu’il ne contient plus de secrets réels exploitables.
- `services/core-api/.env` : ne conserver que des valeurs de développement non sensibles.
- Ajouter un script de rotation des secrets dans `docs/production-hardening.md`.

## A.3. CORS restrictif
### Fichiers à modifier
- `services/finance-service/src/index.js`
- `services/notification-service/src/index.js`

### Modifications
- Remplacer `cors({ origin: true })` par :
  - `cors({ origin: process.env.CORS_ORIGIN || 'https://ium-morave.vercel.app' })`
- Ajouter `CORS_ORIGIN` dans `.env.production.example`.

---

# VAGUE B — Persistance des services manquants
**Priorité :** critique  
**Durée estimée :** 2 h

## B.1. Repositories finance-service
### Nouveaux fichiers
- `services/finance-service/src/payment-plan-repository.js`
- `services/finance-service/src/payment-repository.js`

### Modifications
- Ajouter `initDatabase()` et `from()` depuis `shared/db` ou un module DB local.
- Implémenter :
  - `insertPaymentPlan(payload)`
  - `findPaymentPlanByStudentId(studentId)`
  - `listPaymentPlans()`
  - `insertPayment(payload)`
  - `findReceiptByNumber(receiptNumber)`
- Modifier `services/finance-service/src/index.js` pour :
  - remplacer les tableaux `paymentPlans` et `payments` par les repositories ;
  - conserver un fallback mémoire si `DATABASE_URL` est absent.

## B.2. Repositories notification-service
### Nouveaux fichiers
- `services/notification-service/src/notification-repository.js`
- `services/notification-service/src/template-repository.js`

### Modifications
- Implémenter :
  - `insertNotification(payload)`
  - `listNotifications()`
  - `listTemplates()`
  - `findTemplateById(id)`
- Modifier `services/notification-service/src/index.js` pour :
  - remplacer les tableaux `notifications` et `templates` par les repositories ;
  - conserver le fallback mémoire.

## B.3. Ajout des tables manquantes en base
### Fichier à modifier
- `db/migrations/001_create_schema.sql`

### Modifications
- Ajouter les tables :
  - `payment_plans`
  - `payments`
  - `receipts`
  - `notification_templates`
  - `notifications`
- Activer RLS et policies backend-only pour chaque table.
- Créer les indexes utiles.

---

# VAGUE C — Corrections fonctionnelles frontend
**Priorité :** élevée  
**Durée estimée :** 1 h

## C.1. Corriger le bug PDF admin
### Fichier à modifier
- `apps/admin-dashboard/pages/index.tsx`

### Modifications
- Remplacer le téléchargement hardcodé sur `deliberations[0]` par :
  - une sélection réelle dans le tableau ;
  - ou un menu par ligne avec un bouton par enrollment ;
  - passer l’`enrollmentId` choisi à `loadTranscriptPdf(enrollmentId)` et `loadDiplomaPdf(enrollmentId)`.

## C.2. Ajouter la rehydration de session dans `espace.tsx`
### Fichier à modifier
- `apps/web/pages/espace.tsx`

### Modifications
- Ajouter un `useEffect` au montage pour lire `localStorage` :
  - `token`
  - `refreshToken`
- Si les deux existent, restaurer la session sans appel API supplémentaire.
- Si le token est expiré, gérer le 401 et proposer une reconnexion propre.

## C.3. Corriger les imports et typos
### Fichiers à modifier
- `apps/student-space/pages/index.tsx`
- `apps/teacher-space/pages/index.tsx`

### Modifications
- Supprimer le double semicolon dans l’import React.
- Vérifier la cohérence des imports `Header`/`Footer`.

---

# VAGUE D — Tests manquants
**Priorité :** élevée  
**Durée estimée :** 2 h

## D.1. Tests finance-service
### Nouveaux fichiers
- `services/finance-service/test/finance-service.test.js`

### Couverture exigée
- Health
- CRUD payment plans
- Enregistrement paiement
- Réception par numéro
- Statut financier étudiant
- Rejet sans auth
- Rejet rôle invalide

## D.2. Tests notification-service
### Nouveaux fichiers
- `services/notification-service/test/notification-service.test.js`

### Couverture exigée
- Health
- Liste templates
- Envoi simple
- Envoi bulk
- Historique
- Rejet sans auth
- Rejet rôle invalide

## D.3. Tests frontend
### Nouveaux fichiers
- `apps/web/tests/e2e/landing.spec.ts`
- `apps/web/tests/e2e/verify.spec.ts`
- `apps/student-space/tests/e2e/login.spec.ts`

### Outil
- Playwright ou Cypress.
- Scénarios :
  - affichage landing ;
  - vérification publique ;
  - login student et téléchargement PDF.

---

# VAGUE E — Durcissement final production
**Priorité :** moyenne  
**Durée estimée :** 1 h

## E.1. Configuration PM2 déclarative
### Nouveaux fichiers
- `ecosystem.config.js`

### Contenu
- Déclarer les 8 processus :
  - auth-service
  - core-api
  - finance-service
  - notification-service
  - web
  - student-space
  - teacher-space
  - admin-dashboard
- Variables d’environnement par processus.
- Redémarrage automatique en cas de crash.

## E.2. Docker
### Nouveaux fichiers
- `Dockerfile`
- `docker-compose.yml`

### Contenu
- Image Node 22.
- Build du monorepo.
- Lancement via PM2.
- Volumes pour les logs et les PDF temporaires.
- Service PostgreSQL 14 en option.

## E.3. Monitoring
### Nouveaux fichiers
- `docs/monitoring.md`

### Contenu
- Health checks externes.
- Logs centralisés.
- Alertes PM2.
- Métriques PDF : temps de génération, taille, erreurs.

## E.4. Backups
### Nouveaux fichiers
- `scripts/backup-postgres.sh`
- `scripts/restore-postgres.sh`
- `docs/backup.md`

### Contenu
- Dump quotidien de `ium_morave`.
- Rotation 30 jours.
- Procédure de restauration.

---

# VAGUE F — Validation globale
**Priorité :** finale  
**Durée estimée :** 1 h

## F.1. Vérification structurelle
- Confirmer que tous les fichiers des vagues A à E existent.
- Vérifier la cohérence des imports.
- Vérifier que les variables d’environnement sont nommées de façon cohérente.

## F.2. Vérification sécurité
- Aucun secret en dur dans le code.
- CORS restrictif.
- RLS activé sur toutes les tables.
- JWT secret fort en production.
- Validation des signatures documentaires.

## F.3. Vérification fonctionnelle
- PDF/QR générés.
- Vérification publique opérationnelle.
- Persistance finance + notifications.
- UI Admin complète.
- Tests automatisés passants.

## F.4. Vérification production
- `.env.production` prêt.
- `ecosystem.config.js` prêt.
- `docker-compose.yml` prêt.
- Documentation à jour.

---

# RÉSUMÉ DES LIVRABLES

| Vague | Livrable | Fichiers concernés |
|-------|----------|-------------------|
| A | Sécurité renforcée | `security-service.js`, `pdf-service.js`, `lmd-engine.js`, `.env.*` |
| B | Persistance finance + notifications | `payment-plan-repository.js`, `payment-repository.js`, `notification-repository.js`, `template-repository.js`, `001_create_schema.sql` |
| C | Frontend corrigé | `admin-dashboard/pages/index.tsx`, `web/pages/espace.tsx`, `student-space/pages/index.tsx`, `teacher-space/pages/index.tsx` |
| D | Tests complétés | `finance-service.test.js`, `notification-service.test.js`, tests Playwright/Cypress |
| E | Production hardening | `ecosystem.config.js`, `Dockerfile`, `docker-compose.yml`, `docs/monitoring.md`, `scripts/backup-postgres.sh` |
| F | Validation finale | Aucun fichier, vérification globale |

---

# ORDRE D’EXÉCUTION RECOMMANDÉ
1. Vague A — Sécurisation immédiate des secrets
2. Vague B — Persistance des services manquants
3. Vague C — Corrections fonctionnelles frontend
4. Vague D — Ajout des tests manquants
5. Vague E — Durcissement final
6. Vague F — Validation globale

Chaque vague est indépendante et peut être validée séparément.
