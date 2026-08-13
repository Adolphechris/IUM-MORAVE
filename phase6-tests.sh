#!/usr/bin/env bash
set -uo pipefail

echo "=== Phase 6: Tests automatisés ==="
cd /home/adolphe/IUM-MORAVE

echo "--- Tests services ---"
npm run test:services 2>&1 | tail -30

echo ""
echo "--- Vérification endpoints core-api ---"
LOGIN=$(curl -s -X POST http://localhost:4001/auth/login -H 'Content-Type: application/json' -d '{"email":"admin@ium-morave.edu","password":"ChangeMe123!"}')
TOKEN=$(echo "$LOGIN" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Token admin: ${TOKEN:0:20}..."

echo ""
echo "--- Test transcript JSON ---"
TRANSCRIPT=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4002/transcripts/me)
echo "$TRANSCRIPT" | head -c 400
echo ""

echo ""
echo "--- Test transcript PDF ---"
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4002/transcripts/me/pdf -o /tmp/phase6-transcript.pdf
echo "Transcript PDF: $(wc -c < /tmp/phase6-transcript.pdf 2>/dev/null || echo 'N/A') bytes"

echo ""
echo "--- Test diploma emission ---"
curl -s -X POST http://localhost:4002/enrollments/1/deliberation -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{}' | head -c 200
echo ""
DIPLOMA=$(curl -s -X POST http://localhost:4002/enrollments/1/diploma -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{}')
echo "$DIPLOMA" | head -c 400
echo ""

echo ""
echo "--- Test diploma PDF ---"
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4002/enrollments/1/diploma/pdf -o /tmp/phase6-diploma.pdf
echo "Diploma PDF: $(wc -c < /tmp/phase6-diploma.pdf 2>/dev/null || echo 'N/A') bytes"

echo ""
echo "--- Test verification publique ---"
curl -s -X POST http://localhost:4002/verification/diploma -H 'Content-Type: application/json' -d '{"diploma_number":"DIP-2026-0001"}' | head -c 300
echo ""

echo ""
echo "=== Phase 6: Tests terminés ==="
