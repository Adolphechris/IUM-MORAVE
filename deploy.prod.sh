#!/bin/bash
set -e

echo "=== IUM-MORAVE Production Deployment ==="
echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"

# Verify environment
echo "Checking environment variables..."
: "${SUPABASE_URL:?SUPABASE_URL is required}"
: "${SUPABASE_ANON_KEY:?SUPABASE_ANON_KEY is required}"
: "${SUPABASE_SERVICE_ROLE:?SUPABASE_SERVICE_ROLE is required}"

echo "Environment configured:"
echo "  SUPABASE_URL: $SUPABASE_URL"
echo "  SUPABASE_ANON_KEY: [REDACTED]"
echo "  SUPABASE_SERVICE_ROLE: [REDACTED]"

# Install root dependencies
echo "Installing dependencies..."
npm install --workspaces=false

# Start services in order
echo "Starting auth-service..."
cd services/auth-service
JWT_SECRET="${JWT_SECRET:-$SUPABASE_ANON_KEY}" DATABASE_URL="${DATABASE_URL:-}" npm start &
AUTH_PID=$!
sleep 2

echo "Starting core-api..."
cd ../core-api
JWT_SECRET="${JWT_SECRET:-$SUPABASE_ANON_KEY}" TRANSCRIPT_SIGNING_SECRET="${TRANSCRIPT_SIGNING_SECRET:-transcript-signing-secret}" DATABASE_URL="${DATABASE_URL:-}" npm start &
CORE_PID=$!
sleep 2

echo "Starting finance-service..."
cd ../finance-service
JWT_SECRET="${JWT_SECRET:-$SUPABASE_ANON_KEY}" DATABASE_URL="${DATABASE_URL:-}" npm start &
FINANCE_PID=$!
sleep 2

echo "Starting notification-service..."
cd ../notification-service
JWT_SECRET="${JWT_SECRET:-$SUPABASE_ANON_KEY}" DATABASE_URL="${DATABASE_URL:-}" npm start &
NOTIFY_PID=$!

echo ""
echo "=== All services started ==="
echo "Auth API:        http://localhost:4001 (PID: $AUTH_PID)"
echo "Core API:        http://localhost:4002 (PID: $CORE_PID)"
echo "Finance API:     http://localhost:4003 (PID: $FINANCE_PID)"
echo "Notifications:   http://localhost:4004 (PID: $NOTIFY_PID)"
echo ""
echo "To stop all: kill $AUTH_PID $CORE_PID $FINANCE_PID $NOTIFY_PID"

wait
