# Monitoring — IUM-MORAVE

## 1. Health checks externes
- URL à surveiller : `https://ium-morave.vercel.app`
- Health API auth : `http://localhost:4001/health`
- Health API core : `http://localhost:4002/health`
- Health API finance : `http://localhost:4003/health`
- Health API notification : `http://localhost:4004/health`

## 2. Outils recommandés
- **UptimeRobot** / **Better Uptime** : monitoring HTTP(S) avec alertes
- **PM2 Plus** : monitoring processus Node.js (CPU, mémoire, restart)
- **Sentry** : tracking erreurs frontend/backend
- **PostgreSQL pg_stat_statements** : requêtes lentes

## 3. Métriques à suivre
- **Disponibilité** : uptime par service
- **Performance** :
  - Temps de génération PDF (cible < 5s)
  - Taille des PDF générés (cible < 5MB)
  - Latence des endpoints API (cible < 500ms)
- **Erreurs** :
  - Taux d’erreur 4xx/5xx
  - Échecs de génération PDF
  - Échecs d’envoi email
- **Sécurité** :
  - Tentatives de connexion échouées
  - Vérifications de documents frauduleux
  - Rotations de secrets

## 4. Alertes
- CPU > 80 % sur plus de 5 minutes
- Mémoire > 512 MB par processus
- Health check en échec pendant plus de 2 minutes
- Erreur 500 répétée sur un endpoint critique
- Échec d’envoi email pendant plus de 10 minutes

## 5. Logs
- Tous les logs sont dans `/home/adolphe/IUM-MORAVE/logs/`
- Rotation automatique via PM2 : 10 fichiers de 10 MB max
- Conserver les logs 30 jours
