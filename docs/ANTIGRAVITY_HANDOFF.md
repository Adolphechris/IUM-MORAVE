# Antigravity Handoff et état du chantier

## Résumé des actions effectuées
- Création et configuration d'un workflow GitHub pour exécuter les migrations SQL : `.github/workflows/run-migrations.yml`.
- Ajout d'un workflow plus tolérant : `.github/workflows/run-migrations-safe.yml`.
- Ajout d'un script local de migrations : `scripts/run_migrations.sh`.
- Ajout d'une documentation de déploiement Vercel : `docs/VERCEL_SETUP.md`.
- Ajout de secrets Supabase dans GitHub pour le projet :
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_PUBLISHABLE`
  - `DB_URL`
- Tentative d'exécution des migrations depuis l'environnement de l'assistant.
- Diagnostic réseau réalisé : la base Supabase résout uniquement en IPv6, et l'environnement n'a pas de connectivité IPv6 sortante.

## Ce qui bloque actuellement
1. La commande `psql` ne peut pas se connecter à `db.yznnnqofezjinjdfmemy.supabase.co` depuis cet environnement.
   - Erreur observée : `Network is unreachable` sur l'adresse IPv6 `2a05:d018:cb1:bb01:706:d8f1:b39b:1dd6`.
2. Le workflow GitHub `run-migrations-safe` a été exécuté, mais il n'a pas appliqué la migration car la connexion au serveur a échoué.
3. L'assistant ne peut pas lancer les commandes sur votre machine locale ou dans une session Antigravity qui ferme automatiquement le terminal.
4. L'environnement de l'assistant n'a pas accès au terminal interactif de votre ordinateur, donc je ne peux pas « faire » pour vous localement.

## Ce que je ne peux pas faire depuis ici
- Je ne peux pas forcer l'exécution des commandes sur ta machine locale.
- Je ne peux pas résoudre l'absence de connectivité IPv6 depuis le runner GitHub ou le terminal de l'assistant.
- Je ne peux pas copier/coller directement dans Antigravity si la session ou l'interface ne le permet pas.

## Ce qu'Antigravity doit faire
1. Ouvrir un terminal interactif sur son ordinateur (pas un script lancé par double-clic).
2. Copier/coller le bloc de commandes suivant dans ce terminal :

```bash
set -euo pipefail

DB_URL='postgres://postgres:sb_publishable_6VKPnqVeuV0uVOolMdHXWg_qZHxxjdfmemy.supabase.co:5432/postgres'
LOGFILE="$HOME/supabase_migration_$(date +%Y%m%d%H%M%S).log"

{
  echo "LOGFILE=$LOGFILE"
  if ! command -v psql >/dev/null 2>&1; then
    echo "Installation de psql et curl..."
    if command -v apt-get >/dev/null 2>&1; then
      sudo apt-get update
      sudo apt-get install -y postgresql-client curl
    elif command -v brew >/dev/null 2>&1; then
      brew install postgresql curl
    else
      echo "Impossible d'installer psql automatiquement. Installe psql et curl manuellement puis relance."
      exit 1
    fi
  fi

  TMPDIR="$(mktemp -d)"
  cd "$TMPDIR"

  echo "Téléchargement des fichiers SQL..."
  curl -fsSL https://raw.githubusercontent.com/Adolphechris/IUM-MORAVE/ci/run-migrations/db/migrations/001_create_schema.sql -o 001_create_schema.sql
  curl -fsSL https://raw.githubusercontent.com/Adolphechris/IUM-MORAVE/ci/run-migrations/db/seeds/sample_seed.sql -o sample_seed.sql

  echo "== Test de connexion =="
  psql "$DB_URL" -c "SELECT version();"
  psql "$DB_URL" -c "SELECT 1 as ok;"

  echo "== Appliquer migration =="
  psql "$DB_URL" -f 001_create_schema.sql

  echo "== Appliquer seed =="
  psql "$DB_URL" -f sample_seed.sql

  echo "== Vérifier les tables créées =="
  psql "$DB_URL" -c "SELECT schemaname, tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;"
} 2>&1 | tee "$LOGFILE"

echo "Fin. Le journal est dans : $LOGFILE"
read -p "Appuie sur ENTRÉE pour fermer ce terminal..."
```

3. Si le terminal se ferme automatiquement, il faut impérativement ouvrir une session terminal manuelle et coller le bloc dedans.
4. Après l'exécution, copier/coller ici le dernier message affiché ou le contenu du fichier `LOGFILE` si une erreur survient.

## Usage
- Ce fichier est laissé dans `docs/ANTIGRAVITY_HANDOFF.md` pour qu'Antigravity le trouve facilement dans le projet.
- Antigravity doit l'utiliser comme message de travail prioritaire et résoudre les difficultés de connexion/migration décrites.

## Notes importantes
- Si la connexion échoue encore, le principal problème est réseau : ton réseau local ou le runner doit pouvoir atteindre l'hôte Supabase. Dans ce cas, on pourra aussi utiliser l'éditeur SQL de Supabase comme solution alternative.
- Les secrets ont été ajoutés au dépôt, mais la migration ne sera appliquée que si `psql` arrive à se connecter vraiment à la base.
- Si tu veux, je peux aussi te fournir un bloc identique pour Supabase SQL Editor plutôt que pour `psql`.
