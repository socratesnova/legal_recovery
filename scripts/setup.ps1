# Legal Recovery OS - Windows Setup Script
# Run: cd C:\Users\snova\Documents\GitHub\legal_recovery
#      powershell -ExecutionPolicy Bypass -File scripts\setup.ps1

Write-Host "Legal Recovery OS Setup" -ForegroundColor Cyan

# 1. Start Docker infrastructure
Write-Host "`n[1/4] Starting Docker..." -ForegroundColor Yellow
Set-Location $PSScriptRoot\..\infra\docker
docker compose up -d postgres redis minio

# 2. Wait for PostgreSQL
Write-Host "[2/4] Waiting for PostgreSQL..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 3. Run Prisma migrations
Write-Host "[3/4] Running Prisma migrations..." -ForegroundColor Yellow
Set-Location $PSScriptRoot\..\apps\api

# Set DATABASE_URL without special characters that bash escapes
$env:DATABASE_URL = "postgresql://lrdev:***@localhost:5432/legal_recovery"

# Create user first
docker exec lr_postgres psql -U legal_recovery -d legal_recovery -c "CREATE USER IF NOT EXISTS lrdev WITH PASSWORD 'lrdevpass'; GRANT ALL PRIVILEGES ON DATABASE legal_recovery TO lrdev;" 2>$null

# Run migrations
npx prisma migrate dev --name init --skip-generate

# 4. Start the application
Write-Host "[4/4] Starting backend..." -ForegroundColor Yellow
$env:PORT = "3001"
$env:JWT_SECRET = "local-...npm run start:dev
