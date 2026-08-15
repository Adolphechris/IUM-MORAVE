#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/home/adolphe/IUM-MORAVE/backups"

echo "=== Restore PostgreSQL ==="
echo "WARNING: This will overwrite the current database!"
read -p "Are you sure? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Restore cancelled"
  exit 0
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL is not set"
  exit 1
fi

# List available backups
echo "Available backups:"
ls -lh "$BACKUP_DIR"/ium_morave_*.tar.gz 2>/dev/null || {
  echo "No backups found"
  exit 1
}

read -p "Enter backup filename to restore: " BACKUP_FILE
if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
  echo "ERROR: Backup file not found: $BACKUP_DIR/$BACKUP_FILE"
  exit 1
fi

# Extract connection details
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*$/\1/p')
DB_USER=$(echo "$DATABASE_URL" | sed -n 's/.*\/\/\([^:]*\):.*/\1/p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "Restoring to $DB_NAME on $DB_HOST:$DB_PORT..."

# Decompress backup
gunzip -k "$BACKUP_DIR/$BACKUP_FILE"
TAR_FILE="${BACKUPUP_FILE%.gz}"

# Drop and recreate database
PGPASSWORD=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/.*:\(.*\)@.*/\1/p') \
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "DROP DATABASE IF EXISTS $DB_NAME;"
  
PGPASSWORD=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/.*:\(.*\)@.*/\1/p') \
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

# Restore backup
PGPASSWORD=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/.*:\(.*\)@.*/\1/p') \
  pg_restore -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  --no-owner \
  --no-acl \
  --verbose \
  "$TAR_FILE" 2>&1

if [ $? -eq 0 ]; then
  echo "Restore successful!"
  rm -f "$TAR_FILE"
else
  echo "Restore failed!"
  exit 1
fi

echo "=== Restore complete ==="
