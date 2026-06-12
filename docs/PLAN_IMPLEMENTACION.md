# Legal Recovery OS - Plan Maestro de Implementacion

## Fase 0: Setup Arquitectura (COMPLETADA)

- [x] Monorepo Turborepo + pnpm workspaces
- [x] Docker Compose (PostgreSQL, Redis, MinIO, Keycloak)
- [x] NestJS scaffold con 18 modulos
- [x] Prisma schema con 30+ entidades
- [x] Auth module (JWT + guards + roles)
- [x] CI/CD GitHub Actions
- [x] Dockerfiles para API y Web

## Fase 1: Auth + Administracion (EN PROGRESO)

- [ ] Keycloak realm configuration
- [ ] JWT + Refresh tokens
- [ ] MFA TOTP/SMS
- [ ] RBAC/ABAC decorators
- [ ] Users CRUD completo
- [ ] Portal Admin UI conectado a API real

## Fase 2: Instituciones + Carteras

- [ ] CRUD instituciones con reglas
- [ ] Upload CSV/Excel con validacion
- [ ] Parser flexible (mapeo de columnas)
- [ ] Deduplicacion por cedula + producto
- [ ] Creacion automatica de expedientes

## Fase 3: Expedientes + Documentos

- [ ] Ficha completa deudor + productos
- [ ] Timeline cronologico
- [ ] Upload documentos a MinIO
- [ ] SHA-256 hashes
- [ ] Vista previa segura

## Fase 4: Data Passport + Legal Firewall

- [ ] DataPassport CRUD
- [ ] canUseData() funcion central
- [ ] Bloqueos automaticos
- [ ] Estados: active, restricted, blocked, disputed, expired
- [ ] Audit log append-only

## Fase 5: Scores + Portal Deudor

- [ ] Score documental, recuperabilidad, contactabilidad, riesgo
- [ ] Next Best Action
- [ ] Portal deudor validacion progresiva
- [ ] Propuesta de acuerdo

## Fase 6: Acuerdos + Pagos + Reportes

- [ ] Generacion PDF acuerdos
- [ ] Aprobacion automatica vs manual
- [ ] Registro pagos + conciliacion
- [ ] Paz y Salvo automatico
- [ ] Reportes PDF/Excel

## Fase 7: QA + Seguridad + Deploy Staging

- [ ] Tests unitarios > 70%
- [ ] Tests integracion
- [ ] E2E Playwright
- [ ] Pentest basico
- [ ] Deploy staging

## Estimacion Total: 16 semanas (4 meses)
