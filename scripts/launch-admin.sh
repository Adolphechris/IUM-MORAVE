#!/usr/bin/env bash

PROJECT_DIR="/home/adolphe/IUM-MORAVE"
cd "$PROJECT_DIR"

echo "========================================================"
echo "  Démarrage d'IUM-MORAVE — Plateforme d'Administration  "
echo "========================================================"

# Démarrage du serveur Web / Admin unifié (Port 3000)
if curl -s http://127.0.0.1:3000/admin >/dev/null 2>&1; then
  echo "[OK] Le Portail Administrateur est déjà actif sur http://localhost:3000/admin"
else
  echo "[...] Démarrage du Portail Administrateur sur http://localhost:3000/admin..."
  fuser -k 3000/tcp 2>/dev/null || true
  PORT=3000 setsid npx next start apps/web > /tmp/ium-web-admin.log 2>&1 &
  for i in {1..30}; do
    if curl -s http://127.0.0.1:3000/admin >/dev/null 2>&1; then
      echo "[OK] Portail Administrateur prêt sur http://localhost:3000/admin."
      break
    fi
    sleep 0.5
  done
fi

echo "========================================================"
echo "  Accès prêt : http://localhost:3000/admin"
echo "========================================================"

if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "http://localhost:3000/admin" >/dev/null 2>&1 &
fi

exit 0
