#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DB_URL-}" ]; then
  echo "DB_URL environment variable not set. Export DB_URL or set as secret and use CI workflow."
  exit 1
fi

echo "Running migrations from db/migrations"
for f in db/migrations/*.sql; do
  echo "-- running $f"
  psql "$DB_URL" -f "$f"
done

echo "Running seeds from db/seeds"
for f in db/seeds/*.sql; do
  echo "-- seeding $f"
  psql "$DB_URL" -f "$f"
done

echo "Migrations and seeds complete"
