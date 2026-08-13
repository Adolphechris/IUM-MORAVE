#!/usr/bin/env bash
set -uo pipefail

echo "=== Phase 2.1: Install PDF/QR dependencies ==="
cd /home/adolphe/IUM-MORAVE
npm install

echo ""
echo "=== Phase 2.1: Restart core-api ==="
cd /home/adolphe/IUM-MORAVE
npx pm2 restart core-api 2>&1 || npx pm2 start --name core-api "node services/core-api/src/index.js" 2>&1
sleep 5

echo ""
echo "=== Phase 2.1: Verify core-api ==="
echo "Core API health: $(curl -s http://localhost:4002/health)"

echo ""
echo "=== Phase 2.1: Test transcript endpoint ==="
LOGIN=$(curl -s -X POST http://localhost:4001/auth/login -H 'Content-Type: application/json' -d '{"email":"admin@ium-morave.edu","password":"ChangeMe123!"}')
echo "Login response: $LOGIN"
TOKEN=$(echo "$LOGIN" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
if [ -n "$TOKEN" ]; then
  echo "Token obtained: ${TOKEN:0:20}..."
  echo "Testing /transcripts/me..."
  curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4002/transcripts/me | head -c 500
  echo ""
  echo "Testing /transcripts/me/pdf..."
  curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4002/transcripts/me/pdf -o /tmp/transcript-test.pdf
  echo "PDF size: $(wc -c < /tmp/transcript-test.pdf 2>/dev/null || echo 'N/A') bytes"
else
  echo "WARNING: Could not obtain token, skipping PDF tests"
fi

echo ""
echo "=== Phase 2.1: Test diploma endpoint ==="
if [ -n "$TOKEN" ]; then
  echo "Creating deliberation..."
  curl -s -X POST http://localhost:4002/enrollments/1/deliberation -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{}' | head -c 300
  echo ""
  echo "Issuing diploma..."
  curl -s -X POST http://localhost:4002/enrollments/1/diploma -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{}' | head -c 500
  echo ""
  echo "Testing /enrollments/1/diploma/pdf..."
  curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4002/enrollments/1/diploma/pdf -o /tmp/diploma-test.pdf
  echo "PDF size: $(wc -c < /tmp/diploma-test.pdf 2>/dev/null || echo 'N/A') bytes"
fi

echo ""
echo "Phase 2.1 complete!"
