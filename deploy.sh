#!/bin/bash
set -e

echo "=== IUM-MORAVE Deployment ==="

# Install root dependencies if needed
echo "Installing root dependencies..."
npm install --workspaces=false

# Start all services
echo "Starting services..."
npm run start:auth &
AUTH_PID=$!
sleep 2

npm run start:core-api &
CORE_PID=$!
sleep 2

npm run start:finance &
FINANCE_PID=$!
sleep 2

npm run start:notify &
NOTIFY_PID=$!
sleep 2

# Build and start web
echo "Building web..."
cd apps/web
npm install --silent
npm run build
cd ../..

echo "Starting web..."
npm run start:web &
WEB_PID=$!

echo ""
echo "=== All services started ==="
echo "Auth API:       http://localhost:4001"
echo "Core API:       http://localhost:4002"
echo "Finance API:    http://localhost:4003"
echo "Notifications:  http://localhost:4004"
echo "Web Portal:     http://localhost:3000"
echo ""
echo "PIDs: auth=$AUTH_PID, core=$CORE_PID, finance=$FINANCE_PID, notify=$NOTIFY_PID, web=$WEB_PID"
echo "To stop all: kill $AUTH_PID $CORE_PID $FINANCE_PID $NOTIFY_PID $WEB_PID"

wait
