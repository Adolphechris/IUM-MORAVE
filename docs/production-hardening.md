# Durcissement Production — IUM-MORAVE

## 1. Secrets
- [ ] Générer tous les secrets avec `openssl rand -hex 32`
- [ ] Ne jamais commit de secrets dans Git
- [ ] Utiliser des variables d'environnement serveur
- [ ] Rotation des secrets tous les 90 jours
- [ ] **Secrets documentaires obligatoires en production :**
  - `WATERMARK_SECRET`
  - `TIMESTAMP_SECRET`
  - `ADVANCED_SIGN_SECRET`
  - `DOCUMENT_SECURITY_SECRET`
- [ ] `core-api` refuse de démarrer en production si ces secrets manquent

## 2. Base de données
- [ ] Configurer `pg_hba.conf` pour SSL uniquement
- [ ] Activer `ssl = on` dans `postgresql.conf`
- [ ] Créer un utilisateur dédié par service
- [ ] Appliquer les migrations SQL sur la base de production
- [ ] Configurer les backups automatiques

## 3. Services
- [ ] Désactiver les logs debug en production
- [ ] Configurer CORS pour n'accepter que le domaine Vercel
- [ ] Activer le rate limiting sur tous les endpoints
- [ ] Configurer HTTPS obligatoire
- [ ] Désactiver l'endpoint `/health` publiquement si nécessaire

## 4. PDF/QR
- [ ] Vérifier que Puppeteur tourne en mode headless sécurisé
- [ ] Configurer un timeout pour la génération PDF
- [ ] Limiter la taille des PDFs générés
- [ ] Archiver les PDFs émis avec hash de vérification

## 5. Monitoring
- [ ] Ajouter un health check externe (UptimeRobot, etc.)
- [ ] Configurer les alertes PM2
- [ ] Logger les erreurs dans un service externe
- [ ] Monitorer la génération PDF (temps, taille, erreurs)

## 6. CI/CD
- [ ] Configurer les secrets GitHub Actions
- [ ] Activer les vérifications de sécurité (npm audit)
- [ ] Déploiement automatique sur Vercel pour le frontend
- [ ] Déploiement automatique sur le serveur pour les backends
