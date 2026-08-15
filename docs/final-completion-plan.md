# Plan de complétion — 15% restants
**Objectif :** passer de 85 % à 100 % en éliminant les risques critiques, les trous fonctionnels et les dettes techniques identifiées dans l’audit.  
**Contrainte :** plan uniquement, aucune commande d’exécution n’est fournie.

---

# P0 — Sécurisation critique
## P0.1. Stopper l’exposition des secrets
- **Fichiers à modifier / nettoyer :**
  - `.env.production`
  - `.env.local`
  - `services/core-api/.env`
  - `services/auth-service/.env`
- **Actions :**
  - Identifier tous les secrets réellement présents dans ces fichiers.
  - Les remplacer par des placeholders.
  - Vérifier que `.gitignore` couvre bien `**/.env*`.
  - Si ces fichiers ont déjà été commités, prévoir un nettoyage d’historique.

## P0.2. Changer le mot de passe admin par défaut
- **Fichier à modifier :** `services/auth-service/src/user-store.js`
- **Action :**
  - Supprimer le hash hardcodé `ChangeMe123!`.
  - Exiger un changement de mot de passe obligatoire au premier login admin.
  - Ajouter un mécanisme de secours safe en dev seulement.

## P0.3. Créer la table `transcripts` manquante
- **Fichier à modifier :** `db/migrations/001_create_schema.sql`
- **Action :**
  - Ajouter la table `transcripts` avec les colonnes utilisées par `transcript-repository.js` :
    - `verification_code`
    - `student_name`
    - `matricule`
    - `program_code`, `program_title`, `program_level`
    - `academic_year`
    - `grades`
    - `weighted_average`
    - `decision`
    - `issued_at`
    - `integrity_hash`
    - `qr_code_data_url`
    - `document_signature`
  - Ajouter RLS + policy backend-only.
  - Ajouter un index sur `verification_code`.

## P0.4. Activer SSL/TLS sur PostgreSQL
- **Fichiers à modifier :**
  - `docker-compose.yml`
  - `services/core-api/src/db.js`
- **Actions :**
  - Activer `sslmode=require` sur les connexions PostgreSQL en production.
  - Configurer PostgreSQL pour accepter les connexions SSL.
  - Retirer les scénarios où `rejectUnauthorized: false` est utilisé sans justification.

---

# P1 — Durcissement sécurité
## P1.1. Supprimer les secrets HMAC en dur
- **Fichiers à modifier :**
  - `services/core-api/src/lmd-engine.js`
  - `services/core-api/src/pdf-service.js`
  - `services/core-api/src/security-service.js`
  - `services/core-api/src/transcript-service.js`
- **Actions :**
  - Remplacer chaque constante secrète hardcodée par une variable d’environnement explicite.
  - Ajouter un refus de démarrage en production si les secrets documentaires manquent.
  - Retirer les fallbacks dev risqués dans les chemins de production.

## P1.2. Externaliser la blacklist tokens
- **Fichier à modifier :** `services/auth-service/src/user-store.js`
- **Action :**
  - Remplacer la blacklist en mémoire par un store partagé utilisable par plusieurs instances :
    - Option préférée : Redis.
    - Option alternative : table PostgreSQL `token_blacklist` avec TTL.

## P1.3. Ajouter le rate limiting manquant
- **Fichiers à modifier :**
  - `services/finance-service/src/index.js`
  - `services/notification-service/src/index.js`
- **Action :**
  - Ajouter un rate limiter middleware commun ou spécifique à chaque service.
  - Choisir une limite adaptée au traffic attendu.

## P1.4. Corriger TLS email
- **Fichiers à modifier :**
  - `services/core-api/src/email-sender.js`
  - `services/notification-service/src/document-email-service.js`
- **Action :**
  - Passer `rejectUnauthorized` à `true` par défaut.
  - Ne désactiver la vérification que si une raison opérationnelle est documentée.

---

# P2 — Fiabilisation fonctionnelle
## P2.1. Ajouter la table `transcripts`
- **Fichier à modifier :** `db/migrations/001_create_schema.sql`
- **Action :**
  - Ajouter la table `transcripts` avec schéma complet.
  - Ajouter la migration idempotente pour éviter les erreurs si elle existe déjà.

## P2.2. Corriger les repositories finance et notification
- **Fichiers à modifier :**
  - `services/finance-service/src/payment-plan-repository.js`
  - `services/notification-service/src/notification-repository.js`
- **Actions :**
  - Corriger les imports pour utiliser un module DB valide.
  - Vérifier la cohérence des noms de colonnes avec le schéma SQL.
  - Ajouter un fallback mémoire propre quand la base n’est pas joignable.

## P2.3. Ajouter les CHECK constraints
- **Fichier à modifier :** `db/migrations/001_create_schema.sql`
- **Actions :**
  - Ajouter `CHECK (score BETWEEN 0 AND 20)` sur `grades`.
  - Ajouter `CHECK (amount > 0)` sur `payments`.
  - Ajouter d’autres contraintes métier pertinentes.

## P2.4. Sécuriser les QR codes
- **Fichier à modifier :** `services/core-api/src/qr-service.js`
- **Action :**
  - Signer le contenu du QR code avec HMAC.
  - Inclure une expiration ou un nonce pour éviter la réutilisation infinie.

---

# P3 — Tests et qualité
## P3.1. Ajouter les tests frontend
- **Nouveaux fichiers :**
  - `apps/web/tests/e2e/landing.spec.ts`
  - `apps/web/tests/e2e/verify.spec.ts`
  - `apps/student-space/tests/e2e/login.spec.ts`
- **Actions :**
  - Choisir un outil : Playwright ou Cypress.
  - Couvrir : affichage landing, vérification publique, login student, téléchargement PDF.

## P3.2. Nettoyer les doublons de tests
- **Dossiers à nettoyer :**
  - `services/finance-service/tests/` → supprimer ou fusionner dans `test/`
  - `services/notification-service/tests/` → supprimer ou fusionner dans `test/`
- **Action :**
  - Conserver un seul répertoire de tests par service.
  - Mettre à jour les scripts `npm test` correspondants.

## P3.3. Ajouter tests d’intégration
- **Nouveaux fichiers suggérés :**
  - `services/core-api/test/integration-documents.test.js`
  - `services/core-api/test/integration-security.test.js`
- **Actions :**
  - Vérifier la chaîne complète : délibération → diplôme → PDF → QR → vérification publique.
  - Vérifier la sécurité des documents : signature, watermark, timestamp.

---

# P4 — Production readiness
## P4.1. Activer TypeScript strict
- **Fichiers à modifier :** `apps/*/tsconfig.json`
- **Action :**
  - Passer `strict: false` à `strict: true`.
  - Corriger les erreurs de type révélées.
  - Activer `noUncheckedIndexedAccess` si possible.

## P4.2. Ajouter Prettier
- **Nouveaux fichiers :**
  - `.prettierrc`
  - `.prettierignore`
- **Actions :**
  - Configurer Prettier pour tout le repo.
  - Ajouter un script `format` dans le `package.json` racine.
  - Formater l’ensemble du codebase.

## P4.3. Nettoyer les dossiers vides et inutiles
- **Dossiers concernés :**
  - `apps/web-portal/`
  - `apps/api/`
- **Actions :**
  - Supprimer ou documenter leur utilité future.
  - Supprimer les `node_modules` orphelins.

## P4.4. Durcir la configuration production
- **Fichier à modifier :** `ecosystem.config.js`
- **Actions :**
  - Activer les limites mémoire et restart automatique.
  - Configurer la rotation des logs.
  - Ajouter des hooks de démarrage/arrêt pour flush et backup.

---

# P5 — Finalisation et validation
## P5.1. Vérification structurelle
- Vérifier la cohérence des imports après toutes les modifications.
- Vérifier que les variables d’environnement sont cohérentes entre `.env.example`, `ecosystem.config.js` et `docker-compose.yml`.
- Vérifier que la table `transcripts` est bien créée et utilisée.

## P5.2. Vérification sécurité
- Confirmer qu’aucun secret réel n’est présent dans le dépôt.
- Confirmer que tous les secrets de production sont externalisés.
- Confirmer que le démarrage refuse les secrets manquants en production.

## P5.3. Vérification fonctionnelle
- Tester la génération de transcript PDF avec la nouvelle table `transcripts`.
- Tester la vérification publique après signature QR.
- Tester les nouveaux endpoints finance et notification avec la DB.
- Tester le rate limiting sur tous les services.

## P5.4. Vérification production
- Tester le build Docker.
- Tester le déploiement via PM2.
- Vérifier les scripts de backup/restore.
- Vérifier le monitoring et les health checks.

---

# ORDRE D’EXÉCUTION RECOMMANDÉ
1. **P0** — Sécurisation critique
2. **P1** — Durcissement sécurité
3. **P2** — Fiabilisation fonctionnelle
4. **P3** — Tests et qualité
5. **P4** — Production readiness
6. **P5** — Finalisation et validation

Chaque priorité peut être livrée indépendamment. P0 est bloquant pour toute mise en production sérieuse.
