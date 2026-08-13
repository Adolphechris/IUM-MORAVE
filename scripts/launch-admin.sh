#!/usr/bin/env bash

PROJECT_DIR="/home/adolphe/IUM-MORAVE"
cd "$PROJECT_DIR"

echo "========================================================"
echo "  Démarrage d'IUM-MORAVE — Plateforme d'Administration  "
echo "========================================================"

# 1. Auth Service (Port 4001)
if curl -s http://127.0.0.1:4001/health >/dev/null 2>&1; then
  echo "[OK] auth-service est déjà actif sur http://localhost:4001"
else
  echo "[...] Démarrage d'auth-service (Port 4001)..."
  fuser -k 4001/tcp 2>/dev/null || true
  setsid node services/auth-service/src/index.js > /tmp/ium-auth-service.log 2>&1 &
  for i in {1..30}; do
    if curl -s http://127.0.0.1:4001/health >/dev/null 2>&1; then
      echo "[OK] auth-service démarré sur http://localhost:4001."
      break
    fi
    sleep 0.5
  done
fi

# 2. Core API (Port 4002)
if curl -s http://127.0.0.1:4002/health >/dev/null 2>&1; then
  echo "[OK] core-api est déjà actif sur http://localhost:4002"
else
  echo "[...] Démarrage de core-api (Port 4002)..."
  fuser -k 4002/tcp 2>/dev/null || true
  setsid node services/core-api/src/index.js > /tmp/ium-core-api.log 2>&1 &
  for i in {1..30}; do
    if curl -s http://127.0.0.1:4002/health >/dev/null 2>&1; then
      echo "[OK] core-api démarré sur http://localhost:4002."
      break
    fi
    sleep 0.5
  done
fi

# 3. Admin Dashboard (Port 3007)
if curl -s http://127.0.0.1:3007 >/dev/null 2>&1; then
  echo "[OK] admin-dashboard est déjà actif sur http://localhost:3007"
else
  if [ ! -d "$PROJECT_DIR/apps/admin-dashboard/.next" ]; then
    echo "[...] Compilation d'admin-dashboard..."
    npm run --workspace apps/admin-dashboard build
  fi
  echo "[...] Démarrage d'admin-dashboard (Port 3007)..."
  fuser -k 3007/tcp 2>/dev/null || true
  PORT=3007 setsid npx next start apps/admin-dashboard > /tmp/ium-admin-dashboard.log 2>&1 &
  for i in {1..40}; do
    if curl -s http://127.0.0.1:3007 >/dev/null 2>&1; then
      echo "[OK] admin-dashboard démarré sur http://localhost:3007."
      break
    fi
    sleep 0.5
  done
fi

echo "========================================================"
echo "  Accès prêt : http://localhost:3007"
echo "========================================================"

if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "http://localhost:3007" >/dev/null 2>&1 &
fi

exit 0
