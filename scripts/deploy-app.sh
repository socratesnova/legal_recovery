#!/bin/bash
# Legal Recovery OS - Full Application Deploy
# Run AFTER deploy-infrastructure.sh

set -e

PROJECT_NAME="legal-recovery"
DEPLOY_DIR="/home/admin/$PROJECT_NAME"
SOURCE_DIR="$DEPLOY_DIR/source"
BACKEND_DIR="$SOURCE_DIR/apps/api"
FRONTEND_DIR="$SOURCE_DIR/apps/web"

echo "===================================="
echo "Legal Recovery OS - App Deploy"
echo "===================================="

# 1. Check if source code exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "ERROR: Source code not found at $SOURCE_DIR"
    echo "Please copy the project files first:"
    echo "  scp -r legal_recovery/ admin@10.166.166.60:/home/admin/legal-recovery/source/"
    exit 1
fi

# 2. Install dependencies
echo "[1/5] Installing dependencies..."
cd $SOURCE_DIR
npm install -g pnpm
pnpm install

# 3. Generate Prisma client and run migrations
echo "[2/5] Running Prisma migrations..."
cd $BACKEND_DIR
npx prisma generate
npx prisma migrate deploy

# 4. Build backend
echo "[3/5] Building backend..."
cd $BACKEND_DIR
npm run build

# 5. Start backend with PM2 or systemd
echo "[4/5] Starting backend..."
# Option A: PM2
if command -v pm2 &> /dev/null; then
    cd $BACKEND_DIR
    pm2 start dist/main.js --name legal-recovery-api -- --port 3001
    pm2 save
# Option B: Docker
else
    echo "Starting backend in Docker container..."
    cd $BACKEND_DIR
    docker build -t legal-recovery-api .
    docker run -d --name lr_api \
      --network host \
      -v $DEPLOY_DIR/.env:/app/.env \
      -p 3001:3001 \
      --restart unless-stopped \
      legal-recovery-api
fi

# 6. Build frontend
echo "[5/5] Building frontend..."
cd $FRONTEND_DIR
npm run build

# 7. Start frontend
echo "Starting frontend..."
if command -v pm2 &> /dev/null; then
    cd $FRONTEND_DIR
    pm2 start npm --name legal-recovery-web -- start
    pm2 save
else
    cd $FRONTEND_DIR
    docker build -t legal-recovery-web .
    docker run -d --name lr_web \
      --network host \
      -p 3000:3000 \
      --restart unless-stopped \
      legal-recovery-web
fi

echo ""
echo "===================================="
echo "Deploy complete!"
echo "===================================="
echo ""
echo "API:      http://10.166.166.60:3001"
echo "Web:      http://10.166.166.60:3000"
echo "Swagger:  http://10.166.166.60:3001/api/docs"
echo "Keycloak: http://10.166.166.60:8080"
echo "MinIO:    http://10.166.166.60:9001"
echo ""
