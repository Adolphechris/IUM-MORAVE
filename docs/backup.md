# Backup & Restore — IUM-MORAVE

## Backup automatique
- Script : `scripts/backup-postgres.sh`
- Fréquence : quotidienne via cron
- Rétention : 30 jours
- Format : tar compressé avec gzip
- Stockage : `/home/adolphe/IUM-MORAVE/backups/`

## Configuration cron
```bash
# Backup quotidien à 2h00 du matin
0 2 * * * cd /home/adolphe/IUM-MORAVE && bash scripts/backup-postgres.sh >> /home/adolphe/IUM-MORAVE/logs/backup.log 2>&1
```

## Restauration
- Script : `scripts/restore-postgres.sh`
- Procédure :
  1. Arrêter les services
  2. Lancer le script de restauration
  3. Sélectionner le backup à restaurer
  4. Le script supprime et recrée la base
  5. Redémarrer les services

## Vérification
- Vérifier l’intégrité des backups : `gunzip -t backups/ium_morave_YYYYMMDD_HHMMSS.tar.gz`
- Tester la restauration sur un environnement de test au moins une fois par mois
- Conserver un backup hors site (S3, autre serveur)

## Variables d’environnement requises
- `DATABASE_URL` : chaîne de connexion PostgreSQL
- `DB_PASSWORD` : mot de passe de la base de données
