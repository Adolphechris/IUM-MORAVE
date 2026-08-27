#!/usr/bin/env bash
# ============================================================
#  IUM-MORAVE — Lanceur Admin Dashboard (Port 3003)
#  Séparé du site web public (Port 3000)
# ============================================================

PROJECT_DIR="/home/adolphe/IUM-MORAVE"
ADMIN_APP_DIR="${PROJECT_DIR}/apps/admin-dashboard"
LOG="/tmp/ium-admin-dashboard.log"
PORT=3003
ADMIN_URL="http://localhost:${PORT}"

echo "========================================================"
echo "  IUM-MORAVE — Tableau de Bord Administrateur"
echo "  Port dédié : ${PORT} (séparé du site public :3000)"
echo "========================================================"

# 1. Vérifier si le serveur admin tourne déjà sur :3003
if curl -s --max-time 2 "http://127.0.0.1:${PORT}" > /dev/null 2>&1; then
  echo "[OK] Admin Dashboard déjà actif sur ${ADMIN_URL}"
else
  echo "[...] Démarrage du Admin Dashboard sur le port ${PORT}..."

  # S'assurer que :3003 est libre
  fuser -k ${PORT}/tcp 2>/dev/null || true
  sleep 1

  cd "$ADMIN_APP_DIR"

  # Build si nécessaire
  if [ ! -d ".next" ]; then
    echo "[...] Premier lancement : build en cours (patientez ~60s)..."
    npm run build >> "$LOG" 2>&1
  fi

  # Lancement en arrière-plan sur le port 3003
  PORT=${PORT} setsid npm run start >> "$LOG" 2>&1 &

  echo "[...] Attente du démarrage (max 90 secondes)..."
  for i in {1..90}; do
    if curl -s --max-time 1 "http://127.0.0.1:${PORT}" > /dev/null 2>&1; then
      echo "[OK] Admin Dashboard prêt sur ${ADMIN_URL}"
      break
    fi
    sleep 1
    if [ $((i % 10)) -eq 0 ]; then
      echo "    Toujours en démarrage... ($i/90s)"
    fi
  done
fi

echo "========================================================"
echo "  Ouverture → ${ADMIN_URL}"
echo "========================================================"

sleep 1
xdg-open "${ADMIN_URL}" 2>/dev/null \
  || sensible-browser "${ADMIN_URL}" 2>/dev/null \
  || google-chrome "${ADMIN_URL}" 2>/dev/null \
  || chromium-browser "${ADMIN_URL}" 2>/dev/null \
  || firefox "${ADMIN_URL}" 2>/dev/null \
  || echo "[!] Ouvrez manuellement votre navigateur sur : ${ADMIN_URL}"

echo "[OK] Logs disponibles : ${LOG}"
sleep 3
exit 0
