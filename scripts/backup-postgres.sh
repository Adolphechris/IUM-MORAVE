#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/home/adolphe/IUM-MORAVE/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"

echo "=== Backup PostgreSQL ==="
echo "Date: $(date)"
echo "Backup directory: $BACKUP_DIR"

# Check if DATABASE_URL is set
if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL is not set"
  exit 1
fi

# Extract connection details
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*$/\1/p')
DB_USER=$(echo "$DATABASE_URL" | sed -n 's/.*\/\/\([^:]*\):.*/\1/p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "Backing up $DB_NAME from $DB_HOST:$DB_PORT..."

# Perform backup
PGPASSWORD=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/.*:\(.*\)@.*/\1/p') \
  pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  --format=tar \
  --no-owner \
  --no-acl \
  --verbose \
  > "$BACKUP_DIR/ium_morave_$DATE.tar" 2>&1

if [ $? -eq 0 ]; then
  echo "Backup successful: $BACKUP_DIR/ium_morave_$DATE.tar"
  ls -lh "$BACKUP_DIR/ium_morave_$DATE.tar"
else
  echo "Backup failed!"
  exit 1
fi

# Compress backup
gzip "$BACKUP_DIR/ium_morave_$DATE.tar"
echo "Compressed: $BACKUP_DIR/ium_morave_$DATE.tar.gz"

# Remove old backups
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "ium_morave_*.tar.gz" -mtime +$RETENTION_DAYS -delete
echo "Cleanup complete"

# List current backups
echo "Current backups:"
ls -lh "$BACKUP_DIR"/ium_morave_*.tar.gz 2>/dev/null || echo "No backups found"

echo "=== Backup complete ==="
