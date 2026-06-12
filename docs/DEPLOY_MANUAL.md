# Legal Recovery OS - Guia de Despliegue Manual

## Paso 1: Copiar codigo al servidor

Desde tu maquina local (Windows/Git Bash):

```bash
# 1. Asegurate que todo esta commiteado
cd /c/Users/snova/Documents/GitHub/legal_recovery
git status

# 2. Crear tar.gz del proyecto (excluyendo node_modules y .next)
tar -czvf legal-recovery-deploy.tar.gz \
  --exclude='**/node_modules' \
  --exclude='**/.next' \
  --exclude='**/dist' \
  --exclude='**/.git' \
  .

# 3. Copiar al servidor (necesitas acceso SSH)
scp legal-recovery-deploy.tar.gz admin@10.166.166.60:/home/admin/
```

## Paso 2: En el servidor (10.166.166.60)

```bash
# 1. SSH al servidor (desde Proxmox host como jump)
ssh root@10.166.166.2
ssh admin@10.166.166.60

# O directamente si tienes acceso:
ssh -i "G:\My Drive\KP\keys\01-ssh-operator-ed25519" admin@10.166.166.60

# 2. Extraer el codigo
cd /home/admin
mkdir -p legal-recovery/source
tar -xzvf legal-recovery-deploy.tar.gz -C legal-recovery/source/

# 3. Correr el script de infraestructura
cd legal-recovery
bash scripts/deploy-infrastructure.sh

# 4. Correr el script de aplicacion
bash scripts/deploy-app.sh
```

## Paso 3: Verificar servicios

```bash
# Verificar que todo corre
docker ps

# Verificar PostgreSQL
docker exec lr_postgres pg_isready -U legal_recovery

# Verificar logs del API
docker logs lr_api 2>&1 | tail -50

# Verificar logs del Web
docker logs lr_web 2>&1 | tail -50
```

## Paso 4: Acceder a la aplicacion

- **Frontend**: http://10.166.166.60:3000
- **API**: http://10.166.166.60:3001
- **Swagger Docs**: http://10.166.166.60:3001/api/docs
- **Keycloak**: http://10.166.166.60:8080 (admin / admin123)
- **MinIO Console**: http://10.166.166.60:9001 (minioadmin / minioadmin123)

## Troubleshooting

### Puerto 3000/3001 no responde
```bash
# Verificar que los procesos escuchan
ss -tlnp | grep -E '3000|3001'

# Si no escuchan, reiniciar
pm2 restart legal-recovery-api
pm2 restart legal-recovery-web
```

### Error de conexion a PostgreSQL
```bash
# Verificar que PostgreSQL esta corriendo
docker exec lr_postgres pg_isready

# Verificar la DATABASE_URL en .env
cat .env | grep DATABASE_URL
```

### Error de Prisma
```bash
cd apps/api
npx prisma generate
npx prisma migrate deploy
```

## Actualizacion (futuro)

Para actualizar el codigo:

```bash
cd /home/admin/legal-recovery/source

# Backup
cp -r . ../backup-$(date +%Y%m%d)

# Actualizar codigo
git pull origin main

# Reinstalar dependencias
pnpm install

# Reconstruir
cd apps/api && npm run build
cd ../web && npm run build

# Reiniciar
pm2 restart legal-recovery-api
pm2 restart legal-recovery-web
```
