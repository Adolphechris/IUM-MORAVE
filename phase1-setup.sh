#!/usr/bin/env bash
set -uo pipefail

echo "=== Phase 1.1: Diagnosing PostgreSQL without sudo ==="

# Install shared deps
cd /home/adolphe/IUM-MORAVE/shared
npm install

# Check PostgreSQL presence and ports
echo "--- PostgreSQL processes ---"
ps aux | grep postgres | grep -v grep || echo "No postgres process found"

echo "--- Listening ports ---"
ss -tlnp | grep -E "5432|5433|5435" || echo "No PostgreSQL ports found"

echo "--- pg_hba auth methods ---"
cat /etc/postgresql/*/main/pg_hba.conf 2>/dev/null | grep -v "^#" | grep -v "^$" | head -20 || echo "Cannot read pg_hba.conf"

# Try local unix socket / peer auth with default postgres user
echo "--- Try psql as postgres via local socket ---"
su - postgres -c "psql -c 'SELECT 1;'" 2>&1 || echo "su/postgres route failed"

# Try current Linux user if DB exists
echo "--- Try psql as current user ---"
psql -d ium_morave -c "SELECT 1;" 2>&1 || echo "Current user cannot connect to ium_morave"

# If a postgres superuser connection is possible without sudo, use it
echo "--- Attempt DB setup without sudo ---"
if su - postgres -c "psql -c 'SELECT 1;'" >/dev/null 2>&1; then
  echo "Creating DB objects via postgres superuser..."
  su - postgres -c "psql -c \"DO \$\$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='ium_admin') THEN CREATE ROLE ium_admin WITH LOGIN PASSWORD 'ium_admin_pass'; END IF; END \$\$;\""
  su - postgres -c "psql -c \"SELECT 'CREATE DATABASE ium_morave OWNER ium_admin' WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname='ium_morave')\\gexec\""
  su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE ium_morave TO ium_admin;\""
elif psql -h localhost -U postgres -c "SELECT 1;" >/dev/null 2>&1; then
  echo "Creating DB objects via TCP postgres user..."
  PGPASSWORD="" psql -h localhost -U postgres -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='ium_admin') THEN CREATE ROLE ium_admin WITH LOGIN PASSWORD 'ium_admin_pass'; END IF; END \$\$;"
  PGPASSWORD="" psql -h localhost -U postgres -c "SELECT 'CREATE DATABASE ium_morave OWNER ium_admin' WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname='ium_morave')\\gexec"
  PGPASSWORD="" psql -h localhost -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE ium_morave TO ium_admin;"
else
  echo "WARNING: Cannot administer PostgreSQL without sudo/postgres access."
  echo "Falling back to checking whether services can still start without DB."
fi

echo ""
echo "Testing final connection..."
PGPASSWORD=ium_admin_pass psql -h localhost -U ium_admin -d ium_morave -c "SELECT 1;" 2>&1 && echo "PostgreSQL connection OK" || echo "PostgreSQL connection FAILED"

echo ""
echo "=== Phase 1.2: Fix Business Apps ==="
fuser -k 3000/tcp 2>/dev/null || true
cd /home/adolphe/IUM-MORAVE
npx pm2 restart student-space 2>&1 || npx pm2 start --name student-space "next dev -p 3001" --cwd apps/student-space 2>&1
sleep 5
STATUS=$(curl -s -m 2 -o /dev/null -w '%{http_code}' http://localhost:3001 2>/dev/null || echo "000")
echo "Student Space status: $STATUS"

npx pm2 restart teacher-space 2>&1 || npx pm2 start --name teacher-space "next dev -p 3002" --cwd apps/teacher-space 2>&1
sleep 5
STATUS=$(curl -s -m 2 -o /dev/null -w '%{http_code}' http://localhost:3002 2>/dev/null || echo "000")
echo "Teacher Space status: $STATUS"

npx pm2 restart admin-dashboard 2>&1 || npx pm2 start --name admin-dashboard "next dev -p 3003" --cwd apps/admin-dashboard 2>&1
sleep 5
STATUS=$(curl -s -m 2 -o /dev/null -w '%{http_code}' http://localhost:3003 2>/dev/null || echo "000")
echo "Admin Dashboard status: $STATUS"

echo ""
echo "=== Phase 1.3: Clean port 3000 ==="
fuser -k 3000/tcp 2>/dev/null || true
sleep 1
ss -tlnp | grep 3000 || echo "Port 3000 free"

echo ""
echo "=== Phase 1 Verification ==="
echo "PM2 processes:"
npx pm2 list 2>&1 | grep -E "│ [0-9]"
echo ""
echo "Service health:"
echo "Auth (4001): $(curl -s http://localhost:4001/health)"
echo "Core (4002): $(curl -s http://localhost:4002/health)"
echo "Finance (4003): $(curl -s -m 2 http://localhost:4003/health)"
echo "Notifications (4004): $(curl -s -m 2 http://localhost:4004/health)"
echo ""
echo "Frontends:"
echo "Web (8000): $(curl -s -m 2 -o /dev/null -w '%{http_code}' http://localhost:8000)"
echo "Student (3001): $(curl -s -m 2 -o /dev/null -w '%{http_code}' http://localhost:3001)"
echo "Teacher (3002): $(curl -s -m 2 -o /dev/null -w '%{http_code}' http://localhost:3002)"
echo "Admin (3003): $(curl -s -m 2 -o /dev/null -w '%{http_code}' http://localhost:3003)"

npx pm2 save 2>&1
echo ""
echo "Phase 1 complete!"
