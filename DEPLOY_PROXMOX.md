# Registro de Deployment - Legal Recovery OS en Proxmox

## Fecha: 2025-06-09
## Objetivo: Crear VM en Proxmox y deployear stack completo
## Proxmox IP: 10.166.166.2 (vmbr1)
## VM IP asignada: 10.166.166.60/24, GW: 10.166.166.1

---

## 1. Recursos del Proxmox Host

| Recurso | Valor |
|---------|-------|
| Hostname | pve01 |
| OS | Debian GNU/Linux 13 (trixie) |
| Proxmox VE | 9.2.3 |
| RAM Total | 267 GB |
| RAM Usada | 67 GB |
| RAM Libre | 192 GB |
| Disco Root | 94 GB total, 76 GB libres (16% usado) |
| Red | vmbr0 (nic0, manual), vmbr1 (nic1, 10.166.166.2/24, GW 10.166.166.1) |

VMs existentes:
- 200: coolify (122GB RAM, 300GB disco, running)
- 201: licitpilot-prod (65GB RAM, 300GB disco, running)
- 202: deporte-rd (16GB RAM, 23GB disco, running)
- 9000: debian13-tpl (2GB RAM, 23GB disco, stopped - template)

## 2. Creacion de VM 203 - legal-recovery

### Template utilizado
- ID: 9000 (debian13-tpl)
- Imagen: debian-13-genericcloud-amd64.qcow2
- Cloud-init activado
- Usuario: admin
- SSH keys: root@pve01 + admin@kubernetes_proxmox

### Configuracion aplicada
| Parametro | Valor |
|-----------|-------|
| VMID | 203 |
| Nombre | legal-recovery |
| RAM | 16384 MB (16 GB) |
| CPU | 4 cores, host type |
| Disco | 23 GB (SSD, discard on) |
| Red | virtio, vmbr1 |
| IP | 10.166.166.60/24 |
| Gateway | 10.166.166.1 |
| DNS | 1.1.1.1, 8.8.8.8 |
| On Boot | Si (arranca automaticamente) |

### Comandos ejecutados en Proxmox
```bash
# Clonar template
qm clone 9000 203 --name legal-recovery --full --storage local-lvm

# Configurar recursos
qm set 203 --memory 16384 --cores 4 --cpu host --onboot 1
qm set 203 --ipconfig0 ip=10.166.166.60/24,gw=10.166.166.1
qm set 203 --nameserver '1.1.1.1,8.8.8.8'

# Arrancar VM
qm start 203
```

## 3. Estado de la VM tras arranque

- **Hostname**: legal-recovery
- **IP**: 10.166.166.60 (ens18)
- **MAC**: bc:24:11:4d:cb:67
- **Interface**: ens18 (Debian 13 renombra eth0 a ens18)
- **Usuario**: admin (con clave SSH ed25519)
- **SSH**: Activo en puerto 22, escuchando en 0.0.0.0 y ::
- **OS**: Debian 13 (trixie), kernel 6.12.90+deb13.1-cloud-amd64
- **RAM**: 16 GB asignados

## 4. Problemas encontrados y resolucion

### Problema 1: Cloud-init DNS malformado
**Sintoma**: Cloud-init reporto error: `malformed address '1.1.1.1,8.8.8.8'`
**Causa**: El formato de nameserver en Proxmox cloud-init no acepta lista separada por comas para Debian 13 netplan.
**Impacto**: DNS resolution fallo, `apt update` no funciono.
**Solucion**: 
- systemd-resolved se desactivo (estaba inactivo/dead)
- Se creo archivo `/etc/systemd/network/10-eth0.network` con gateway correcto
- Se elimino `/etc/netplan/50-cloud-init.yaml` (configuracion conflictiva)
- Se elimino `/run/systemd/network/10-netplan-eth0.network` (configuracion conflictiva sin gateway)
- Se reinicio systemd-networkd
- resolv.conf usa Proxmox gateway (10.166.166.2) + Cloudflare (1.1.1.1)
**Estado**: RESUELTO. DNS funciona, ping a google.com OK (26ms)

### Problema 2: Configuracion de red conflictiva (Doble network config)
**Sintoma**: VM tenia IP pero no gateway. `ip route` solo mostraba ruta local sin default gateway.
**Causa**: cloud-init genero `/run/systemd/network/10-netplan-eth0.network` con IP pero sin gateway, y tambien existia `/etc/systemd/network/10-eth0.network` con gateway. systemd-networkd aplicaba el primero.
**Solucion**: Eliminar configs conflictivas de cloud-init, crear `/etc/systemd/network/10-ens18.network` con:
```ini
[Match]
Name=ens18
[Network]
Address=10.166.166.60/24
Gateway=10.166.166.1
DNS=1.1.1.1
DNS=8.8.8.8
LinkLocalAddressing=ipv6
```
**Estado**: RESUELTO. Default gateway 10.166.166.1 activo. Interfaz ens18 UP.

### Problema 3: Conexion SSH desde Windows
**Sintoma**: `ssh admin@10.166.166.60` timeout desde Windows.
**Causa**: Posible firewall de Windows o ruteo. Conexion desde Proxmox host (10.166.166.2) a VM funciona perfecto.
**Solucion**: Usar Proxmox como jump host: `ssh root@10.166.166.2 -> ssh admin@10.166.166.60` o via `qm guest exec`
**Estado**: Resuelto (usando jump host / qm guest exec).

### Problema 4: IP duplicada (cambio de .50 a .60)
**Sintoma**: IP 10.166.166.50 estaba duplicada en la red. No respondia desde fuera del Proxmox.
**Causa**: Conflicto de IP con otro dispositivo en la red 10.166.166.0/24.
**Solucion**: 
- Detener VM: `qm stop 203`
- Cambiar IP en Proxmox: `qm set 203 --ipconfig0 ip=10.166.166.60/24,gw=10.166.166.1`
- Reiniciar VM: `qm start 203`
- Corregir systemd-networkd config: cambiar de `10-eth0.network` a `10-ens18.network` (interfaz renombrada por Debian 13)
**Estado**: RESUELTO. IP 10.166.166.60 activa, ping OK, DNS OK, gateway 10.166.166.1 verificado.

## 5. Gateway verificado

El gateway configurado es correcto: **10.166.166.1**
- Verificado en configuracion de Proxmox: `iface vmbr1 inet static, gateway 10.166.166.1`
- Verificado en VM: `ip route` muestra default via 10.166.166.1
- Ping a 10.166.166.1 desde VM: funciona (0.7ms)

## 6. Instalacion Docker

**Fecha completado**: 2025-06-09 18:58 UTC

### Versiones instaladas
- Docker CE: 29.5.3
- Docker Compose (plugin): v5.1.4
- Docker Buildx: 0.34.1

### Comandos ejecutados
```bash
# Instalar Docker
apt-get update -y
apt-get install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian trixie stable" > /etc/apt/sources.list.d/docker.list
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable docker
systemctl start docker
usermod -aG docker admin
```

## 7. Deploy Stack Base (Docker Compose)

**Ubicacion**: `/home/admin/legal-recovery/docker-compose.yml`

### Servicios desplegados
| Servicio | Puerto | Estado | Imagen |
|----------|--------|--------|--------|
| **PostgreSQL** | 5432 | **Healthy** | postgres:16-alpine |
| **Redis** | 6379 | **Healthy** | redis:7-alpine |
| **MinIO** | 9000, 9001 | **Up** | minio/minio:latest |

### Base de datos creadas
- `legal_recovery` (principal)
- `keycloak` (para Keycloak, pendiente)

### Credenciales (desarrollo)
- PostgreSQL: `legal_recovery` / `legal_recovery_dev_2024`
- Redis: Sin password (desarrollo)
- MinIO: `legalrecovery` / `legalrecovery_dev_2024`
- MinIO Console: http://10.166.166.60:9001

## 8. Proximos pasos

1. [x] Crear VM en Proxmox (10.166.166.60)
2. [x] Arreglar DNS y red en la VM
3. [x] Instalar Docker y Docker Compose
4. [x] Deployear stack base (PostgreSQL, Redis, MinIO)
5. [ ] Iniciar Keycloak y crear realm
6. [ ] Copiar codigo fuente del proyecto a la VM
7. [ ] Build y deploy del backend NestJS
8. [ ] Build y deploy del frontend Next.js
9. [ ] Configurar proxy reverso (Nginx o Traefik)
10. [ ] Configurar SSL/TLS
11. [ ] Pruebas end-to-end

## 9. Notas de seguridad

- Clave SSH privada: `G:\My Drive\KP\keys\01-ssh-operator-ed25519`
- Acceso Proxmox: root / Ultraprox-ng1@#!
- Acceso VM: admin (sin password, solo SSH key)
- La VM tiene `PermitRootLogin prohibit-password` por defecto (cloud-init)
- SSH keys de admin ya estan en authorized_keys
