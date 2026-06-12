#!/bin/bash
# Legal Recovery OS - Deploy Script for Proxmox VM
# Run this script on the server: 10.166.166.60

set -e

PROJECT_NAME="legal-recovery"
DEPLOY_DIR="/home/admin/$PROJECT_NAME"
BACKEND_DIR="$DEPLOY_DIR/apps/api"
FRONTEND_DIR="$DEPLOY_DIR/apps/web"

echo "===================================="
echo "Legal Recovery OS - Deploy Script"
echo "Server: $(hostname) ($(hostname -I))"
echo "===================================="

# 1. Create deploy directory
mkdir -p $DEPLOY_DIR

# 2. Copy docker-compose.yml
cat > $DEPLOY_DIR/docker-compose.yml << 'EOF'
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    container_name: lr_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: legal_recovery
      POSTGRES_PASSWORD: legal_recovery_dev_2024
      POSTGRES_DB: legal_recovery
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U legal_recovery -d legal_recovery"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: lr_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    container_name: lr_minio
    restart: unless-stopped
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  keycloak:
    image: quay.io/keycloak/keycloak:26.0
    container_name: lr_keycloak
    restart: unless-stopped
    command: start-dev
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:***@postgres:5432/legal_recovery
      KC_DB_USERNAME: legal_recovery
      KC_DB_PASSWORD: legal_recovery_dev_2024
      KC_HOSTNAME: localhost
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin123
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
  redis_data:
  minio_data:
EOF

# 3. Start infrastructure
echo "[1/5] Starting infrastructure (PostgreSQL, Redis, MinIO, Keycloak)..."
cd $DEPLOY_DIR
docker compose up -d postgres redis minio keycloak

# 4. Wait for PostgreSQL
echo "[2/5] Waiting for PostgreSQL to be ready..."
until docker exec lr_postgres pg_isready -U legal_recovery -d legal_recovery > /dev/null 2>&1; do
  echo "  Waiting..."
  sleep 2
done
echo "  PostgreSQL is ready!"

# 5. Run Prisma migrations
echo "[3/5] Running Prisma migrations..."
# This will be done after the backend code is copied

# 6. Create .env file
cat > $DEPLOY_DIR/.env << 'EOF'
# Database
DATABASE_URL=postgresql://legal_recovery:***@localhost:5432/legal_recovery?schema=public

# Redis
REDIS_URL=redis://localhost:6379

# Keycloak
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=legal-recovery
KEYCLOAK_CLIENT_ID=legal-recovery-api
KEYCLOAK_CLIENT_SECRET=change-me-in-production

# JWT
JWT_SECRET=legal-recovery-jwt-secret-2026-change-in-production

# MinIO
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=legal-recovery

# Application
NODE_ENV=production
PORT=3001
API_URL=http://localhost:3001
WEB_URL=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=legal-recovery
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=legal-recovery-web

# Security
ENCRYPTION_KEY=change-me-32-char-key-for-production
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
EOF

echo "[4/5] Infrastructure is running!"
echo ""
echo "Services:"
echo "  PostgreSQL: 10.166.166.60:5432"
echo "  Redis:      10.166.166.60:6379"
echo "  MinIO API:  10.166.166.60:9000"
echo "  MinIO UI:   http://10.166.166.60:9001"
echo "  Keycloak:   http://10.166.166.60:8080"
echo ""
echo "Next steps:"
echo "  1. Copy backend code to $BACKEND_DIR"
echo "  2. Copy frontend code to $FRONTEND_DIR"
echo "  3. Run: cd $BACKEND_DIR && npx prisma migrate deploy"
echo "  4. Run: cd $BACKEND_DIR && npm run build && npm run start:prod"
echo "  5. Run: cd $FRONTEND_DIR && npm run build && npm start"
echo ""
echo "[5/5] Deploy infrastructure complete!"
