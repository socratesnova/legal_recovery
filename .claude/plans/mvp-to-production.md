# Plan de Trabajo: Legal Recovery OS — De POC a MVP Productivo

## Estado Actual del Proyecto

El proyecto está en estado **POC/Demo funcional avanzado**. El frontend tiene 3 portales visualmente completos con datos estáticos/demo. El backend tiene la estructura NestJS con 4 módulos activos (Auth, Users, Institutions, Portfolios-stub) y 10 módulos comentados. La integración FE-BE es inexistente. La seguridad tiene blockers críticos (auth sin bcrypt, JwtAuthGuard placeholder, sin campo password en Prisma).

---

## Objetivo del Plan

Transformar el proyecto de un demo estático a un **MVP mínimo viable productivo** donde:
1. El backend tenga autenticación segura y CRUD real de entidades principales
2. El frontend consuma datos reales del backend via API
3. La infraestructura Docker/CI-CD sea funcional y desplegable

---

## FASE 0: Fundamentos de Seguridad y Base (Blockers Críticos)

**Prioridad: CRÍTICA | Estimación: 2-3 días**

### 0.1 Schema Prisma — Password y Performance
- Agregar campo `passwordHash String? @map("password_hash")` al modelo `User`
- Agregar `@@index` en campos de búsqueda frecuente: `User.email`, `Case.caseNumber`, `Debtor.idNumber`, `Contact.value`, `Portfolio.institutionId`
- Crear y aplicar migración Prisma
- Regenerar Prisma Client

### 0.2 Autenticación Real con Bcrypt
- Implementar `bcrypt.compare` en `AuthService.validateUser` (eliminar TODO)
- Modificar `UsersService.create` para hashear password con `bcrypt.hash` antes de guardar
- Actualizar `LoginDto` para validar que email y password estén presentes
- El JWT payload sigue igual: `sub`, `email`, `role`, `institutionId`

### 0.3 JwtAuthGuard Real
- Reemplazar el placeholder `JwtAuthGuard` por implementación real usando `@nestjs/passport`
- Debe extraer Bearer token del header `Authorization`
- Verificar token con `JwtService` o `PassportStrategy`
- Inyectar `UsersService` para validar que el usuario existe y está activo
- Rechazar con `401 Unauthorized` si token inválido o usuario inactivo

### 0.4 DTOs de Validación
- Crear `CreateUserDto` con `@IsEmail`, `@MinLength(6)`, `@IsEnum(UserRole)`, campos opcionales
- Crear `UpdateUserDto` (partial de CreateUserDto)
- Crear `CreateInstitutionDto` con validaciones de campos obligatorios
- Crear `UpdateInstitutionDto` (partial)
- Reemplazar `data: any` en controllers por DTOs tipados

### 0.5 Seed Script Robusto
- Ampliar `apps/api/scripts/seed.ts` para crear:
  - 2 instituciones (Banco Popular, Banco BHD)
  - 4 usuarios con roles diferentes y passwords hasheados
  - 3 carteras con reglas
  - 5 casos con deudores, productos, documentos, scores
  - Contactos, consentimientos y data passports
- Hacer idempotente (usar `upsert` donde sea posible)

### 0.6 Tests Unitarios Base
- Crear `apps/api/src/auth/auth.service.spec.ts` — tests para login con bcrypt
- Crear `apps/api/src/users/users.service.spec.ts` — tests para CRUD y soft-delete
- Crear `apps/api/src/institutions/institutions.service.spec.ts`
- Configurar `jest` para usar una base de datos SQLite en memoria o mock de Prisma

---

## FASE 1: Backend Core — Entidades Principales

**Prioridad: ALTA | Estimación: 3-4 días**

### 1.1 CasesModule (El módulo más crítico del negocio)
- Crear `CasesController` con endpoints:
  - `GET /api/v1/cases` — listar con filtros (status, institutionId, portfolioId, search)
  - `GET /api/v1/cases/:id` — obtener caso con relaciones (debtor, products, documents, communications, agreements, payments, disputes, dataPassports)
  - `POST /api/v1/cases` — crear caso (con debtor, products, dataPassport)
  - `PATCH /api/v1/cases/:id` — actualizar caso
  - `DELETE /api/v1/cases/:id` — soft-delete
- Crear `CasesService` con lógica de negocio:
  - Crear debtor + caso + productos en transacción
  - Calcular scores automáticamente (stub inicial)
  - Aplicar reglas de portfolio al crear
- Crear DTOs: `CreateCaseDto`, `UpdateCaseDto`, `CaseFilterDto`
- Wirear en `AppModule`

### 1.2 PortfoliosModule Real
- Reemplazar stub actual por implementación real
- `GET /api/v1/portfolios` — listar con filtros por institutionId
- `GET /api/v1/portfolios/:id` — obtener con casos relacionados
- `POST /api/v1/portfolios` — crear portfolio + reglas
- `POST /api/v1/portfolios/:id/upload` — stub de upload CSV (guardar fileSource, no procesar aún)
- `PATCH /api/v1/portfolios/:id` — actualizar
- `DELETE /api/v1/portfolios/:id` — soft-delete
- DTOs: `CreatePortfolioDto`, `UpdatePortfolioDto`, `CreatePortfolioRuleDto`

### 1.3 DocumentsModule Básico
- `GET /api/v1/documents` — listar por caseId
- `POST /api/v1/documents` — crear registro de documento (metadata)
- `POST /api/v1/documents/upload` — stub de subida a MinIO/S3 (generar presigned URL o guardar local)
- `GET /api/v1/documents/:id/download` — stub de descarga
- DTOs: `CreateDocumentDto`, `UploadDocumentDto`

### 1.4 AgreementsModule Básico
- `GET /api/v1/agreements` — listar por caseId
- `POST /api/v1/agreements` — crear acuerdo (validar reglas de portfolio)
- `POST /api/v1/agreements/:id/approve` — aprobar acuerdo (requiere rol adecuado)
- DTOs: `CreateAgreementDto`, `ApproveAgreementDto`

### 1.5 PaymentsModule Básico
- `GET /api/v1/payments` — listar por caseId/institutionId
- `POST /api/v1/payments` — registrar pago
- `POST /api/v1/payments/:id/reconcile` — conciliar pago
- DTOs: `CreatePaymentDto`, `ReconcilePaymentDto`

### 1.6 Endpoint de KPIs para Dashboard
- Crear `ReportsModule` mínimo o agregar a `CasesModule`
- `GET /api/v1/reports/kpi` — retornar objeto con:
  - portfolioAssigned, recoveredThisMonth, netRecovery
  - activeCases, casesWithAgreement, disputesResolved
  - firewallBlocked (contar communications con status BLOCKED)
  - conversionRate, costPerContact
- `GET /api/v1/reports/performance` — datos para gráficos de recuperación mensual
- `GET /api/v1/reports/channels` — datos para gráficos de canales

---

## FASE 2: Integración Frontend-Backend (Admin Portal)

**Prioridad: ALTA | Estimación: 2-3 días**

### 2.1 Cliente HTTP
- Crear `apps/web/src/lib/api-client.ts`:
  - Wrapper de `fetch` con base URL desde `NEXT_PUBLIC_API_URL`
  - Interceptor para agregar header `Authorization: Bearer <token>`
  - Manejo de errores 401 (redirect a login), 403 (mostrar alerta)
  - Tipos TypeScript para respuestas del backend

### 2.2 Autenticación Real en Frontend
- Modificar `apps/web/src/app/login/page.tsx`:
  - Llamar a `POST http://localhost:3001/api/v1/auth/login` en vez de `/api/auth`
  - Guardar JWT token en `localStorage` (mantener approach actual por simplicidad MVP, migrar a httpOnly cookies en fase posterior)
  - Guardar objeto user
- Modificar layouts de portales para leer token real y validarlo

### 2.3 Dashboard Admin con Datos Reales
- Modificar `apps/web/src/app/portal/admin/dashboard/page.tsx`:
  - Usar `useEffect` + `api-client` para fetchear `/api/v1/reports/kpi`
  - Mostrar estado de carga (skeletons)
  - Manejar errores de API
  - Mantener gráficos con datos de performance endpoint

### 2.4 Cases List con Datos Reales
- Modificar `apps/web/src/app/portal/admin/cases/page.tsx`:
  - Fetchear `GET /api/v1/cases`
  - Mapear respuesta API al formato visual actual
  - Agregar estados de carga y empty state
  - Mantener filtros y search (enviar como query params al backend)

### 2.5 Case Detail con Datos Reales
- Modificar `apps/web/src/app/portal/admin/cases/[id]/page.tsx`:
  - Fetchear `GET /api/v1/cases/:id`
  - Mantener Legal Firewall UI (llama a `/api/firewall` que ya funciona)
  - Los tabs (overview, documents, timeline, passport, disputes) usan datos reales del caso

### 2.6 Users, Institutions, Portfolios Pages
- Conectar páginas respectivas a sus endpoints de API

---

## FASE 3: Portales Bank y Debtor

**Prioridad: MEDIA | Estimación: 1-2 días**

### 3.1 Portal Bank
- Modificar `apps/web/src/app/portal/bank/dashboard/page.tsx` para consumir KPIs filtrados por institutionId
- Conectar portlets de carteras a `/api/v1/portfolios?institutionId=...`

### 3.2 Portal Debtor
- Modificar `apps/web/src/app/portal/debtor/dashboard/page.tsx` para fetchear casos del deudor autenticado
- Conectar páginas de pagos y acuerdos a endpoints reales

---

## FASE 4: Infraestructura y DevOps

**Prioridad: MEDIA | Estimación: 1-2 días**

### 4.1 Unificar Package Manager
- Eliminar `package-lock.json` de la raíz y de `apps/web`
- Asegurar que `pnpm-lock.yaml` existe (o generarlo con `pnpm install`)
- Actualizar root `package.json` para que todos los scripts usen `pnpm`

### 4.2 Actualizar Dockerfiles
- `apps/api/Dockerfile`: reemplazar `npm ci` por `pnpm install --frozen-lockfile`
- `apps/web/Dockerfile`: mismo cambio, instalar pnpm globalmente
- `apps/api/Dockerfile.dev`: mismo

### 4.3 Corregir CI/CD
- `.github/workflows/ci-cd.yml`: asegurar que usa `pnpm/action-setup@v4` correctamente
- `.github/workflows/deploy.yml`: cambiar `context: ./poc` a `context: ./apps/web` y agregar build de API
- Crear manifests de Kubernetes básicos si no existen (referencia actual apunta a `kubernetes_proxmox/proyectos/legal-recovery` que no existe)

### 4.4 docker-compose.yml
- Verificar que los servicios arrancan correctamente con las nuevas imágenes
- Asegurar que variables de entorno apuntan correctamente

---

## Criterios de Aceptación por Fase

### FASE 0 Aceptada cuando:
- `pnpm test` ejecuta y pasa tests de auth y users
- Login con bcrypt funciona end-to-end (backend)
- JwtAuthGuard rechaza tokens inválidos
- Prisma schema tiene índices y campo passwordHash
- Seed script crea datos coherentes

### FASE 1 Aceptada cuando:
- Swagger muestra endpoints funcionales de Cases, Portfolios, Documents, Agreements, Payments
- POST/GET/PATCH/DELETE de cases funcionan via curl/Postman
- Endpoint de KPIs retorna datos consistentes

### FASE 2 Aceptada cuando:
- Frontend login autentica contra backend real
- Dashboard admin muestra datos reales de la base de datos
- Lista de casos y detalle funcionan con datos reales
- No hay páginas del admin portal que usen `demoCases` o `demoKPIs`

### FASE 3 Aceptada cuando:
- Portal bank muestra datos de su institución
- Portal debtor muestra sus casos reales

### FASE 4 Aceptada cuando:
- `docker-compose up` levanta todos los servicios sin errores
- CI/CD pipeline pasa lint, test, build y deploy

---

## Deuda Técnica Post-MVP (NO incluido en este plan)

- Implementar Keycloak real (actualmente solo importado en dependencias)
- Row Level Security (RLS) en PostgreSQL
- Upload real de archivos a MinIO/S3
- AI Scoring real (actualmente es stub)
- AuditInterceptor real que escriba a AuditLog
- Comunicaciones omnicanal reales (email, SMS, WhatsApp)
- Refresh tokens
- httpOnly cookies en vez de localStorage
- Pruebas e2e con Playwright
- Rate limiting real por endpoint
- Data Passport enforcement completo en backend

---

## Estimación Total

| Fase | Días Est. | Complejidad |
|------|-----------|-------------|
| 0 — Seguridad y Base | 2-3 | Alta |
| 1 — Backend Core | 3-4 | Alta |
| 2 — FE-BE Integration (Admin) | 2-3 | Media-Alta |
| 3 — Bank y Debtor | 1-2 | Media |
| 4 — Infra y DevOps | 1-2 | Media |
| **Total** | **9-14 días** | |

Esta estimación asume trabajo intenso de 1 desarrollador full-stack con dominio del stack.
