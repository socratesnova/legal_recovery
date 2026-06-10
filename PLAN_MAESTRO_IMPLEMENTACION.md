# Plan Maestro de Implementacion - Legal Recovery OS
## De MVP a Produccion Cloud

> **Fecha:** Junio 2026  
> **Estado:** Plan maestro basado en investigacion de sistemas similares y mejores practicas cloud  
> **Ambito:** Republica Dominicana / Latinoamerica (multi-pais futuro)

---

## 1. Resumen Ejecutivo de Recomendaciones

### 1.1 Decisiones Clave del Stack (Investigacion Comparativa)

Tras analizar alternativas y sistemas similares en produccion, se recomienda el siguiente stack optimizado para velocidad de desarrollo + escalabilidad futura:

| Capa | Tecnologia Recomendada | Justificacion |
|------|------------------------|---------------|
| **Frontend** | Next.js 15 + React 19 + TailwindCSS + shadcn/ui | SSR/SSG para SEO y performance. App Router nativo. shadcn/ui acelera UI ejecutiva sin lock-in. |
| **Backend** | **NestJS** (TypeScript) | Arquitectura modular similar a Angular. Decoradores, DI, pipes, guards nativos. Mejor para equipos medianos y codebase a largo plazo. |
| **API Docs** | OpenAPI/Swagger automatico | NestJS genera Swagger automaticamente. Cumple requisito "API versionada" del scope. |
| **Base de Datos** | PostgreSQL 16 + **Prisma ORM** | Prisma ofrece type-safety completo, migraciones automaticas, y schema como single source of truth. Ideal para multi-tenant. |
| **Auth** | **Keycloak** (self-hosted) o Supabase Auth | Keycloak: SSO, MFA, LDAP, ABAC avanzado, cumplimiento financiero. Supabase Auth: mas rapido para MVP. |
| **Colas** | Redis + **BullMQ** (NestJS nativo) | BullMQ es nativo de TypeScript/Node.js. Mejor integracion que Celery con NestJS. |
| **Archivos** | MinIO (self-hosted S3-compatible) | Sin costos de AWS S3 en etapa inicial. API compatible 100%. Migra a S3/GCS despues. |
| **AI/RAG** | Python microservicio con FastAPI + LangChain + ChromaDB | Servicio separado para IA. FastAPI es ideal para modelos ML. No expone datos sensibles. |
| **PDF/Doc Gen** | Puppeteer + Handlebars templates | Genera PDFs desde HTML con datos dinamicos. Mas flexible que librerias nativas. |
| **BI Dashboards** | Metabase (self-hosted) | Open source. Conecta directo a PostgreSQL. Rapido de desplegar. |
| **Infra Dev** | Docker + Docker Compose | Desarrollo local identico a produccion. 12-Factor App compliant. |
| **Infra Prod** | Kubernetes (K3s/EKS/GKE) o Docker Swarm | K8s para escalar a multiples instanciones. Docker Swarm para MVP rapido. |
| **CI/CD** | GitHub Actions + ArgoCD (prod) | GitHub Actions para build/test. ArgoCD para GitOps en produccion. |
| **Observabilidad** | Grafana + Prometheus + Loki | Open source. Metricas, logs, alerting. Alternativa: Datadog/New Relic si hay presupuesto. |
| **Cloud Provider** | **DigitalOcean** (MVP) -> AWS/GCP (Produccion) | DO: mas simple y barato para RD/Latam. AWS/GCP para compliance y servicios avanzados. |

### 1.2 Por que NestJS sobre FastAPI para el Backend Principal

Aunque FastAPI es excellente para APIs rapidas y ML, **NestJS es superior para este proyecto** por:

1. **Arquitectura empresarial nativa**: Modulos, controladores, servicios, repositorios, guards, pipes, interceptors, filters — todo el patron que el proyecto necesita esta incluido.
2. **TypeScript end-to-end**: Frontend (Next.js) y backend comparten tipos, DTOs, interfaces.
3. **BullMQ nativo**: Colas de trabajo, cron jobs, eventos con Redis sin configuracion extra.
4. **Documentacion Swagger automatica**: Cumple "API versionada" sin trabajo manual.
5. **Testing integrado**: Jest incluido. Unit, integration, e2e testing out-of-the-box.
6. **Comunidad fintech**: Mas proyectos bancarios y financieros usan NestJS que FastAPI a nivel mundial.
7. **Prisma ORM**: Integracion perfecta con NestJS para type-safe database access.

**FastAPI se reserva para el microservicio de IA/RAG** donde Python es indispensable.

---

## 2. Sistemas Similares Analizados (Benchmark)

### 2.1 Plataformas de Debt Collection / Legal Recovery

| Sistema | Modelo | Fortalezas | Debilidades | Leccion para LR OS |
|---------|--------|------------|-------------|-------------------|
| **Experian Collections** | SaaS Enterprise | Omnicanal, scoring predictivo, compliance global | Caro, inflexible para oficinas legales locales | Necesitamos scoring propio adaptado a RD |
| **FICO Debt Manager** | On-prem/SaaS | Workflow legal robusto, reglas de negocio avanzadas | Complejo, larga implementacion, alto costo | Workflow configurable por institucion |
| **CollectAI (In-debt)** | AI-first SaaS | Voicebot avanzado, automatizacion alta | Pierde trazabilidad legal, poco control humano | AI recomienda, humano decide |
| **CrediTudo / Latam local** | Local software | Barato, adaptado a buro local | Sin cloud, sin multi-tenant, sin gobierno de datos | Cloud-native + multi-institucion es diferenciador |
| **TrueAccord (US)** | Digital-first | Portal deudor excelente, self-service, pagos digitales | No cubre requisitos judiciales latinoamericanos | Portal deudor como prioridad alta |

### 2.2 Arquitecturas Multi-Tenant en Fintech

| Patron | Descripcion | Cuando usarlo |
|--------|-------------|---------------|
| **Shared DB, Shared Schema** (recomendado MVP) | Todas las instituciones en mismas tablas con `institution_id` | Rapido de implementar, 90% de casos fintech usan esto |
| **Shared DB, Schema per Tenant** | Schema separado por institucion | Para instituciones que exigen aislamiento logico |
| **DB per Tenant** | Base de datos completamente separada | Para bancos grandes con requisitos regulatorios extremos |

**Decision para LR OS**: Iniciar con **Shared DB, Shared Schema** con `institution_id` + Row Level Security (RLS) de PostgreSQL. Escalar a schema separado si un banco grande lo exige.

---

## 3. Arquitectura de Produccion

### 3.1 Diagrama de Arquitectura (Descripcion Textual)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLOUD PROVIDER                               │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    LOAD BALANCER (Nginx/Traefik)              │   │
│  │                    SSL/TLS + WAF + Rate Limiting              │   │
│  └────────────┬─────────────────────────────────┬──────────────┘   │
│               │                                 │                   │
│  ┌────────────▼──────────┐         ┌───────────▼────────────┐     │
│  │   Next.js Frontend    │         │   NestJS API Gateway   │     │
│  │   (3 replicas)        │         │   (3 replicas)         │     │
│  │   SSR/SSG + Auth      │         │   JWT Validation       │     │
│  └───────────────────────┘         │   Rate Limit           │     │
│                                    └───────────┬────────────┘     │
│                                                │                  │
│  ┌──────────────┬──────────────┬───────────────▼────────┐        │
│  │  Auth        │  Core        │  AI       │  Workers   │        │
│  │  Service     │  Services    │  Service  │  (BullMQ)  │        │
│  │  (Keycloak)  │  (NestJS)    │  (FastAPI)│  (NestJS)  │        │
│  └──────┬───────┴──────┬───────┴─────┬─────┴─────┬──────┘        │
│         │              │             │           │                 │
│  ┌──────▼──────┐ ┌───▼────┐ ┌────▼─────┐ ┌───▼────┐             │
│  │ PostgreSQL  │ │ Redis  │ │  MinIO   │ │ChromaDB│             │
│  │ (Primary+   │ │(Cache+  │ │ (Files+  │ │(Vector  │             │
│  │  Replica)   │ │ Queues) │ │  Docs)   │ │ Store)  │             │
│  └─────────────┘ └────────┘ └──────────┘ └────────┘             │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Observabilidad: Prometheus + Grafana + Loki + Alertmanager   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Componentes Detallados

#### 3.2.1 Frontend (Next.js)
- **3 portales separados** con code splitting:
  - `/portal/admin` — Oficina legal (usuarios internos)
  - `/portal/bank` — Bancos y fondos
  - `/portal/debtor` — Deudor self-service
- **SSR** para dashboards y reportes (SEO + performance)
- **Server Actions** para formularios y mutaciones
- **React Query / TanStack Query** para cacheo de datos
- **shadcn/ui + Tailwind** para UI ejecutiva sin lock-in de libreria

#### 3.2.2 Backend Principal (NestJS)
- **API Gateway pattern**: Unico punto de entrada. Rate limiting, JWT validation, request logging.
- **Modulos separados** que mapean a los prompts:
  ```
  src/
  ├── auth/              -> JWT + MFA + Keycloak integration
  ├── users/             -> RBAC/ABAC management
  ├── institutions/      -> CRUD instituciones, contratos, reglas
  ├── portfolios/        -> Carga CSV/Excel, validacion, deduplicacion
  ├── cases/             -> Expedientes, deudores, productos
  ├── documents/         -> Documentos, hashes, storage
  ├── data-passports/    -> Legal Firewall, canUseData()
  ├── contacts/          -> Contactos, consentimientos, opt-in
  ├── scores/            -> Scoring documental, recuperabilidad, riesgo
  ├── agreements/        -> Acuerdos, promesas, aprobacion por regla
  ├── payments/          -> Pagos, conciliacion, recibos
  ├── disputes/          -> Flujo de disputa, pausa automatica
  ├── communications/    -> Email, SMS, voicebot, WhatsApp (restringido)
  ├── reports/           -> PDF/Excel generation
  ├── audit/             -> Immutable audit logs
  └── ai/                -> Integration con AI microservice
  ```

#### 3.2.3 Microservicio de IA (FastAPI + Python)
- **RAG privado** con ChromaDB (vector store local)
- **LangChain** para pipelines de IA
- **Modelos locales** (no API externa) para proteger datos:
  - Llama 3 / Mistral para resumenes y recomendaciones
  - Whisper local para voicebot transcripcion
  - EasyOCR / Tesseract para OCR de comprobantes
- **Anonimizacion obligatoria** antes de enviar a cualquier modelo
- **Endpoints expuestos** solo al backend NestJS (red interna)

#### 3.2.4 Workers (BullMQ + Redis)
- Procesamiento asincrono de:
  - Carga masiva de carteras (CSV/Excel)
  - Generacion de reportes PDF/Excel
  - Scoring batch de expedientes
  - Envio de comunicaciones (email, SMS)
  - Conciliacion de pagos
  - OCR de documentos

### 3.3 Base de Datos (PostgreSQL)

#### 3.3.1 Modelo Multi-Tenant con RLS
```sql
-- Row Level Security activado por institution_id
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY institution_isolation ON cases
  FOR ALL TO app_user
  USING (institution_id = current_setting('app.current_institution_id')::UUID);
```

#### 3.3.2 Esquema Minimo MVP
```
institutions
  id UUID PK
  name, type, country, tax_id, status
  created_at, updated_at, deleted_at

institution_contracts
  id UUID PK, institution_id FK
  contract_type, discount_rules, commission_rules, sla, required_documents, start_date, end_date

users
  id UUID PK, institution_id FK
  email, name, role, mfa_enabled, mfa_secret, status
  created_at, updated_at, deleted_at

roles & permissions (RBAC/ABAC)

portfolios
  id UUID PK, institution_id FK
  name, type, total_amount, currency, file_source, upload_date, status

portfolio_rules (reglas por institucion)
  institution_id FK
  discount_max, min_installments, max_installments, auto_approval_limit, channels_allowed

debtors
  id UUID PK, institution_id FK, portfolio_id FK
  first_name, last_name, id_number, id_type

cases (expedientes)
  id UUID PK, institution_id FK, portfolio_id FK, debtor_id FK
  status (active, restricted, blocked, disputed, closed)
  total_balance, assigned_date, next_action, score_documental, score_recoverability

case_products
  id UUID PK, case_id FK
  product_type, original_amount, current_balance, interest_rate

documents
  id UUID PK, case_id FK, uploaded_by FK
  filename, file_path, file_hash (SHA-256), mime_type, size_bytes

data_passports (Legal Firewall)
  id UUID PK
  entity_type, entity_id, field_name, field_value_hash
  source_type, source_reference, legal_basis
  allowed_uses[], prohibited_uses[], confidence_score
  visibility_roles[], status (approved, restricted, blocked, expired, pending)
  captured_at, last_validated_at, expiration_date

contacts (contactos del deudor)
  id UUID PK, debtor_id FK
  channel (phone, email, address), value, is_primary, opt_in, opt_in_date
  data_passport_id FK

communications (log de comunicaciones)
  id UUID PK, case_id FK, contact_id FK, user_id FK
  channel, direction, content_summary, status
  created_at, ip_address

agreements
  id UUID PK, case_id FK, institution_id FK
  type, amount, discount_percentage, installments, status
  approved_by, approved_at, created_by

payments
  id UUID PK, case_id FK, agreement_id FK
  amount, method, reference, receipt_path, status
  reconciled_at, reconciled_by

audit_logs (inmutable)
  id UUID PK, user_id FK, institution_id FK
  action, entity_type, entity_id, changes_json, ip_address, user_agent
  created_at (no updated_at, no deleted)
```

---

## 4. Roadmap de Implementacion: MVP → Produccion

### 4.1 Fase 0: Setup y Arquitectura (Sprint 0) — Semanas 1-2

**Objetivo**: Infraestructura lista para desarrollo local y primer deploy.

| Tarea | Detalle | Entregable |
|-------|---------|------------|
| Repo setup | Monorepo con Turborepo o Nx. Backend + Frontend + Shared types | `package.json`, `turbo.json` |
| Docker Compose | PostgreSQL 16, Redis, MinIO, Keycloak, App dev server | `docker-compose.yml` |
| CI/CD basico | GitHub Actions: lint, typecheck, test, build | `.github/workflows/ci.yml` |
| NestJS scaffold | Modulos base, Prisma setup, Swagger, config service | `src/app.module.ts`, `prisma/schema.prisma` |
| Next.js scaffold | App Router, auth context, layout portal, Tailwind + shadcn | `app/portal/(admin)/`, `app/portal/(bank)/`, `app/portal/(debtor)/` |
| Database schema v1 | Prisma schema con entidades MVP + migracion inicial | `prisma/migrations/0001_initial/` |
| Keycloak config | Realm, clientes (web, api), roles iniciales, MFA TOTP | Documento de config Keycloak |

**Definition of Done**: `docker-compose up` levanta todo el stack. Healthcheck endpoint responde.

### 4.2 Fase 1: Autenticacion y Administracion (Sprint 1) — Semanas 3-4

**Objetivo**: Login MFA, gestion de usuarios, roles, permisos.

| Tarea | Detalle |
|-------|---------|
| Auth completo | JWT + Refresh tokens + MFA TOTP/SMS + Keycloak integration |
| RBAC/ABAC | Decoradores `@Roles()`, `@Permissions()`, `@Institution()` en NestJS |
| CRUD usuarios | Invitar, activar, desactivar, asignar institucion |
| CRUD roles | Super Admin, Admin, Supervisor, Gestor, Abogado, Compliance, Banco, Deudor |
| ABAC inicial | Permisos por institucion + cartera + sensibilidad del dato |
| Portal Admin UI | Pantallas de usuarios, roles, instituciones, parametros |

**Definition of Done**: Usuario puede loguearse con MFA. Admin puede crear usuarios con roles. Tests de RBAC pasan.

### 4.3 Fase 2: Instituciones y Carteras (Sprint 2) — Semanas 5-6

**Objetivo**: Registrar bancos, cargar carteras, crear expedientes.

| Tarea | Detalle |
|-------|---------|
| CRUD instituciones | Datos legales, contratos, comisiones, SLA, reglas de descuento |
| Upload cartera | CSV/Excel con validacion de estructura, tipos de datos, duplicados |
| Parser flexible | Mapeo de columnas (cada banco envia formato diferente) |
| Deduplicacion | Por cedula + producto + institucion. Merge o crear nuevo. |
| Creacion expedientes | Automatizada desde cartera: deudor -> caso -> productos |
| Resumen cartera | Dashboard: monto total, casos, productos, calidad documental |
| Reglas por institucion | Descuento max, cuotas, aprobacion automatica vs manual |

**Definition of Done**: Se carga un Excel de 1000 filas en < 2 min. Expedientes creados con trazabilidad de fuente.

### 4.4 Fase 3: Expedientes y Documentos (Sprint 3) — Semanas 7-8

**Objetivo**: Ficha de deudor, productos, documentos, historial.

| Tarea | Detalle |
|-------|---------|
| Ficha expediente | Datos del deudor, productos, saldos, estado, timeline |
| Timeline | Historial cronologico: cargas, contactos, pagos, cambios |
| Upload documentos | Contratos, pagares, estados de cuenta, fotos cedula |
| Hash SHA-256 | Cada archivo con hash, usuario, fecha, relacion a caso |
| Storage MinIO | Buckets: `institution-{id}/cases/{case-id}/documents/` |
| Vista previa | Thumbnails, preview seguro, control de descargas |

**Definition of Done**: Documento subido tiene hash verificable. Timeline muestra todas las acciones del caso.

### 4.5 Fase 4: Data Passport y Legal Firewall (Sprint 4) — Semanas 9-10

**Objetivo**: Gobierno de datos, permisos, restricciones, auditoria.

| Tarea | Detalle |
|-------|---------|
| Data Passport UI | Ver/crear/editar pasaportes por campo de datos |
| Legal Firewall | `canUseData(user, data, purpose, channel)` funcion central |
| Bloqueos automaticos | Sin fuente -> bloquear. Sin permiso -> bloquear. Vencido -> bloquear. |
| Estados de datos | `active`, `restricted`, `blocked`, `disputed`, `expired`, `pending` |
| Auditoria actions | Log de creacion, modificacion, visualizacion, descarga, contacto |
| Compliance review | Pantalla para Compliance revisar y clasificar datos pendientes |

**Definition of Done**: Dato sin fuente no se muestra al gestor. Dato restringido solo visible para abogado/compliance. Audit log inmutable.

### 4.6 Fase 5: Scores y Portal Deudor (Sprint 5) — Semanas 11-12

**Objetivo**: Scores basicos, portal deudor funcional.

| Tarea | Detalle |
|-------|---------|
| Score documental | Completo? (contrato, cesion, pagare, estado cuenta) -> verde/amarillo/rojo |
| Score recuperabilidad | Monto, antiguedad, historial, producto -> prioridad 1-5 |
| Score contactabilidad | Telefonos validos, emails, opt-in, respuestas previas |
| Score riesgo | Disputas, terceros, frecuencia, quejas -> normal/supervisor/compliance |
| Portal deudor auth | Validacion progresiva: cedula -> pregunta seguridad -> OTP SMS/Email |
| Portal deudor UI | Resumen caso, saldo, documentos disponibles, acuerdo, pago, disputa |
| Propuesta acuerdo | Formulario con monto, cuotas. Validacion contra reglas del banco. |

**Definition of Done**: Portal deudor permite validar identidad, ver resumen, proponer acuerdo. Scores visibles en ficha de caso.

### 4.7 Fase 6: Acuerdos, Pagos y Reportes (Sprint 6) — Semanas 13-14

**Objetivo**: Flujo de acuerdos, registro de pagos, reportes.

| Tarea | Detalle |
|-------|---------|
| Generacion acuerdo | PDF con terminos, montos, cuotas. Firma digital o aceptacion click. |
| Aprobacion por regla | Si entra en reglas banco -> aprobacion automatica. Si no -> supervisor. |
| Promesas de pago | Fecha, monto, recordatorio automatico. Vencimiento -> reactivar. |
| Registro pagos | Tarjeta, transferencia, deposito, comprobante manual |
| Conciliacion manual | Match pago vs caso por referencia, monto, fecha |
| Recibo / Paz y salvo | Generacion automatica segun reglas institucion |
| Reportes PDF/Excel | Por banco, cartera, periodo, recuperacion, disputas |
| Dashboard web | KPIs: monto asignado, recuperado, neto, costo, conversion |

**Definition of Done**: Acuerdo generado y aprobado. Pago registrado y conciliado. Reporte generado en < 10 segundos.

### 4.8 Fase 7: QA, Seguridad y Deploy Staging (Sprint 7) — Semanas 15-16

**Objetivo**: Sistema vendible y operable. Deploy en staging.

| Tarea | Detalle |
|-------|---------|
| Tests unitarios | > 70% cobertura backend. Jest + Supertest. |
| Tests integracion | API endpoints con base de datos real (testcontainers). |
| Tests E2E | Playwright. Flujos criticos: login, carga cartera, acuerdo, pago. |
| Tests seguridad | Legal Firewall, RBAC, bloqueo de datos sin fuente, WhatsApp sin opt-in. |
| Pentest basico | OWASP ZAP o Burp Suite en endpoints criticos. |
| Performance | k6 o Artillery. Carga cartera 10,000 filas. API 100 req/s. |
| Deploy staging | Docker Compose en servidor cloud. SSL, dominio, backup automatico. |
| Documentacion | API docs (Swagger), deployment guide, admin guide. |

**Definition of Done**: MVP completo en staging. 10 criterios de aceptacion pasan. Listo para demo a bancos.

---

## 5. Fases Post-MVP (Produccion Cloud)

### 5.1 Fase 8: Cloud Migration y Kubernetes (Fase 2A)

**Duracion**: 3-4 semanas  
**Objetivo**: Infraestructura de produccion en Kubernetes.

- **Containerizacion**: Docker multi-stage para frontend, backend, workers, AI service.
- **Kubernetes**: K3s (on-prem) o EKS/GKE (cloud). Namespaces: `prod`, `staging`, `dev`.
- **Helm charts**: Definicion de deployments, services, ingress, secrets.
- **GitOps**: ArgoCD o FluxCD. Deploy automatico por merge a `main`.
- **Secret management**: HashiCorp Vault o Sealed Secrets. Nunca secrets en repos.
- **Database**: PostgreSQL managed (RDS, Cloud SQL, DigitalOcean Managed DB) con backups automaticos.
- **Redis**: Managed (Elasticache, Memorystore) o Redis Cluster.
- **Storage**: Migracion de MinIO a S3/GCS con CDN para archivos publicos.

### 5.2 Fase 9: Omnichannel y Comunicaciones (Fase 2B)

**Duracion**: 4-5 semanas  
**Objetivo**: Motor de comunicaciones inteligente.

- **Email**: SendGrid/AWS SES. Templates HTML, tracking de apertura/clicks.
- **SMS**: Twilio o proveedor local (Altice, Claro RD). Presupuesto por caso.
- **Carta QR**: Generacion de carta fisica con QR unico. Tracking de inbound.
- **Voicebot**: Integracion con plataforma de voz (Voximplant, Twilio). Transcripcion con Whisper.
- **WhatsApp**: Solo neutral/atencion. Opt-in obligatorio. Plantillas pre-aprobadas por Meta.
- **Motor de canales**: Reglas de costo/riesgo. Canal mas barato primero. Fallback progresivo.

### 5.3 Fase 10: AI Recovery Brain y Copilotos (Fase 2C)

**Duracion**: 5-6 semanas  
**Objetivo**: IA para scoring avanzado, next best action, copilotos.

- **Microservicio AI**: FastAPI + LangChain + ChromaDB.
- **RAG privado**: Documentos legales, contratos, jurisprudencia en vector store local.
- **Next Best Action**: Algoritmo que combina todos los scores + reglas banco -> recomienda accion.
- **Copiloto gestor**: Resumen caso, riesgo, guion permitido, oferta sugerida, proxima accion.
- **Copiloto juridico**: Matriz probatoria, cronologia, documentos faltantes, riesgo prescripcion.
- **Quality AI**: Revision de llamadas/chats para detectar lenguaje riesgoso o incumplimiento.
- **IMPORTANTE**: IA recomienda. Humano decide. Logs de todas las recomendaciones.

### 5.4 Fase 11: Data Brain Avanzado y Validaciones (Fase 3)

**Duracion**: 6-8 semanas  
**Objetivo**: Full Data Passport, validaciones externas, clean room.

- **Clean Room**: Entorno aislado donde se combinan datos anonimizados para entrenar modelos.
- **Validaciones JCE/TSS**: Integracion via API autorizada (con convenio). Validacion de identidad.
- **Buro de credito**: Consulta via SIC (Sociedad de Informacion Crediticia RD) con base legal.
- **Data Passport completo**: Todos los datos tienen pasaporte. 0 datos sin clasificar.
- **Modelos predictivos**: ML para prediccion de recuperabilidad, churn, optimal discount.
- **Anonimizacion**: K-anonimity, differential privacy para datasets de entrenamiento.

### 5.5 Fase 12: Autopilot Estrategico (Fase 4)

**Duracion**: 8-10 semanas  
**Objetivo**: Portfolio valuation, judicializacion selectiva, marketplace.

- **Valuador de carteras**: Modelo que estima valor presente de cartera segun scores, historicos, mercado.
- **Judicializacion selectiva**: Algoritmo que recomienda casos para accion legal (fortaleza, monto, costo).
- **Marketplace de carteras**: Bancos publican carteras. Fondos compran. Plataforma cobra comision.
- **Voicebot avanzado**: Negociacion por voz, captura de intencion, acuerdo verbal, derivacion humana.
- **Simulador de recuperacion**: "Si aplicamos esta estrategia, recuperamos X% en Y meses."

---

## 6. Infraestructura y DevOps Detallado

### 6.1 Ambientes

| Ambiente | Infraestructura | Datos | Uso |
|----------|----------------|-------|-----|
| **Local** | Docker Compose en laptop | Seed data | Desarrollo diario |
| **Dev** | Docker Compose en servidor dev | Datos anonimizados | Integracion continua |
| **Staging** | Kubernetes staging | Replica de produccion anonimizada | QA, demos, UAT |
| **Production** | Kubernetes production | Datos reales encriptados | Operacion bancaria real |

### 6.2 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/main.yml (simplificado)
name: CI/CD
on: [push, pull_request]
jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lint (ESLint + Prettier + Flake8)
        run: npm run lint
      - name: TypeCheck (TypeScript + Prisma)
        run: npm run typecheck
      
  test:
    needs: lint-and-typecheck
    runs-on: ubuntu-latest
    services:
      postgres: { image: postgres:16 }
      redis: { image: redis:7 }
      minio: { image: minio/minio }
    steps:
      - name: Unit Tests (Jest)
        run: npm run test:unit
      - name: Integration Tests (Supertest + Testcontainers)
        run: npm run test:integration
      - name: E2E Tests (Playwright)
        run: npm run test:e2e
  
  build-and-deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker images
        run: docker build -t legal-recovery .
      - name: Push to Registry
        run: docker push registry.example.com/legal-recovery
      - name: Deploy to Staging (ArgoCD/GitOps)
        run: kubectl apply -f k8s/staging/
```

### 6.3 Monitoreo y Alerting

| Componente | Herramienta | Que monitorea |
|------------|-------------|---------------|
| Metricas | Prometheus + Grafana | CPU, memoria, requests/s, latencia, errores 5xx |
| Logs | Loki + Grafana | Logs estructurados (JSON) de todos los servicios |
| Traces | Jaeger o Tempo | Distributed tracing request->API->DB->Queue |
| Alertas | Alertmanager + Slack/PagerDuty | CPU > 80%, errores > 1%, DB conexion fail, queue size > 1000 |
| Uptime | UptimeRobot o Pingdom | Healthcheck endpoints cada 60 segundos |
| DB | pgAdmin / Percona | Queries lentas, locks, conexiones, replication lag |

### 6.4 Backup y Disaster Recovery

- **PostgreSQL**: Backups diarios automaticos (pg_dump) + Point-in-time recovery (WAL archiving).
- **Archivos (MinIO/S3)**: Versioning activado. Replicacion cross-region.
- **Configuracion**: Infra como codigo (Terraform + Helm). Recrear ambiente en < 30 min.
- **RPO**: 1 hora (maximo datos perdidos). **RTO**: 2 horas (tiempo de recuperacion).

---

## 7. Seguridad y Compliance

### 7.1 Medidas Obligatorias (por Ley 172-13 RD y estandares financieros)

| Requisito | Implementacion | Prioridad |
|-----------|---------------|-----------|
| **Cifrado en transito** | TLS 1.3 en todas las comunicaciones | Critico |
| **Cifrado en reposo** | PostgreSQL TDE + S3/MinIO SSE-S3 + backups encriptados | Critico |
| **Autenticacion MFA** | TOTP (Google Authenticator) + SMS fallback | Critico |
| **RBAC/ABAC** | Roles + permisos + atributos (institucion, cartera, sensibilidad) | Critico |
| **Audit logs inmutables** | Tabla `audit_logs` append-only. Hash chain para integridad. | Critico |
| **Control de acceso a datos** | Data Passport + Legal Firewall en cada endpoint | Critico |
| **Anonimizacion** | K-anonimity antes de exportar o usar en ML | Alto |
| **Retencion y eliminacion** | Politicas por tipo de dato. Borrado logico (soft delete) + fisico post-retencion | Alto |
| **Pentesting** | Trimestral: OWASP ZAP, Burp Suite, auditoria externa anual | Alto |
| **ISO 27001 / SOC 2** | Preparacion para certificacion en Fase 3 | Medio |

### 7.2 Configuracion de Seguridad (NestJS)

```typescript
// main.ts - Configuracion de seguridad
app.use(helmet());                    // Headers de seguridad
app.use(rateLimit({                 // Rate limiting por IP
  windowMs: 15 * 60 * 1000,
  max: 100,
}));
app.use(csrf());                     // CSRF protection
app.use(compression());              // Compresion de respuestas
app.enableCors({                     // CORS restrictivo
  origin: process.env.ALLOWED_ORIGINS?.split(',') || false,
  credentials: true,
});

// Guard global de auditoria
app.useGlobalGuards(new AuditLogGuard());
```

---

## 8. Estimacion de Recursos y Costos

### 8.1 Equipo de Desarrollo (MVP: 4 meses)

| Rol | Cantidad | Duracion | Notas |
|-----|----------|----------|-------|
| Tech Lead / Arquitecto | 1 | Full project | NestJS, PostgreSQL, cloud, toma decisiones tecnicas |
| Fullstack Senior (Next.js + NestJS) | 2 | Full project | Frontend + Backend modules |
| DevOps / Cloud Engineer | 0.5 (shared) | Desde Sprint 5 | Docker, CI/CD, deploy staging |
| QA / Testing | 0.5 (shared) | Sprint 7 en adelante | Tests, E2E, seguridad |
| UX/UI Designer | 0.25 (shared) | Sprint 1-6 | Wireframes, mockups, design system |
| **Total** | **~4.25 FTE** | | |

### 8.2 Infraestructura Mensual (Estimado)

| Servicio | MVP (Staging) | Produccion (Fase 3+) |
|----------|---------------|----------------------|
| VPS/Cloud (4-8 vCPU, 16GB RAM) | $50-100 (DigitalOcean) | $300-500 (EKS/GKE) |
| PostgreSQL Managed | $15-30 (DO Managed DB) | $200-400 (RDS/Cloud SQL) |
| Redis | $15 (DO Managed Redis) | $50-100 (Elasticache) |
| Storage (MinIO/S3) | $10-20 | $50-200 |
| CI/CD (GitHub Actions) | $0 (publico) | $20-50 (minutos extra) |
| Email (SendGrid) | $0 (100/dia gratis) | $50-100 |
| SMS (Twilio) | $0 (test) | $200-500 (depende volumen) |
| Monitoring (Grafana Cloud) | $0 (basico) | $50-100 |
| Dominio + SSL | $20/año | $20/año |
| **Total mensual** | **~$150-250** | **~$1,000-2,000** |

---

## 9. Estructura de Repositorios (Monorepo)

```
legal_recovery/
├── .github/
│   └── workflows/
│       ├── ci.yml              -> Lint, typecheck, test, build
│       ├── deploy-staging.yml  -> Deploy automatico a staging
│       └── deploy-prod.yml     -> Deploy manual a produccion
├── apps/
│   ├── web/                    -> Next.js frontend (3 portales)
│   │   ├── app/
│   │   │   ├── portal/
│   │   │   │   ├── (admin)/    -> Portal oficina legal
│   │   │   │   ├── (bank)/     -> Portal banco/fondo
│   │   │   │   └── (debtor)/   -> Portal deudor
│   │   │   └── api/            -> API routes (webhooks, etc)
│   │   ├── components/
│   │   ├── lib/
│   │   └── package.json
│   └── api/                    -> NestJS backend principal
│       ├── src/
│       │   ├── modules/        -> auth, users, institutions, portfolios...
│       │   ├── common/         -> guards, pipes, interceptors, filters
│       │   ├── config/         -> env validation, app config
│       │   └── main.ts         -> Bootstrap app
│       ├── prisma/
│       │   ├── schema.prisma   -> Single source of truth DB
│       │   └── migrations/
│       ├── test/
│       └── package.json
├── services/
│   └── ai/                     -> FastAPI microservicio IA
│       ├── src/
│       ├── models/             -> Modelos locales (Llama, Mistral)
│       └── requirements.txt
├── packages/
│   └── shared-types/           -> Typescript types compartidos
│       └── src/
│           ├── dto/            -> DTOs compartidos frontend/backend
│           └── enums/          -> Enums compartidos
├── infra/
│   ├── docker/
│   │   ├── docker-compose.yml  -> Dev local completo
│   │   └── docker-compose.prod.yml -> Produccion (Docker Swarm)
│   ├── k8s/                    -> Kubernetes manifests
│   │   ├── base/               -> Deployments, services, configmaps
│   │   ├── staging/            -> Overrides staging
│   │   └── production/         -> Overrides produccion
│   └── helm/                   -> Helm charts (futuro)
├── docs/
│   ├── AGENTS.md               -> Guia para desarrolladores
│   ├── API.md                  -> Documentacion de API
│   ├── DEPLOY.md               -> Guia de deployment
│   └── COMPLIANCE.md           -> Requisitos legales y compliance
├── scripts/
│   ├── seed.ts                 -> Datos iniciales (roles, usuarios demo)
│   └── backup.sh               -> Script de backup manual
├── Makefile                    -> Comandos comunes (make dev, make test, make deploy)
├── turbo.json                  -> Turborepo pipeline
└── package.json                -> Root package.json (workspaces)
```

---

## 10. Comandos de Desarrollo (Makefile)

```makefile
# Comandos principales para el equipo

.PHONY: dev test build deploy seed lint typecheck

dev:
	docker-compose -f infra/docker/docker-compose.yml up -d
	npm run dev:web
	npm run dev:api

test:
	npm run test:unit
	npm run test:integration
	npm run test:e2e

lint:
	npm run lint
	npm run format:check

typecheck:
	npm run typecheck:web
	npm run typecheck:api

build:
	npm run build

seed:
	npx ts-node scripts/seed.ts

deploy-staging:
	git push origin main
	# ArgoCD automatico

deploy-prod:
	# Manual approval required
	kubectl apply -f infra/k8s/production/

backup:
	bash scripts/backup.sh
```

---

## 11. Proximos Pasos Inmediatos

1. **Decidir cloud provider**: DigitalOcean (rapido, barato) o AWS (compliance, servicios).
2. **Setup repositorio**: Crear monorepo con Turborepo + apps/web + apps/api.
3. **Docker Compose**: Configurar PostgreSQL 16 + Redis + MinIO + Keycloak.
4. **Primer commit**: NestJS scaffold + Next.js scaffold + Prisma schema inicial.
5. **Reunion con legal**: Validar flujo de Data Passport y consentimientos segun Ley 172-13.
6. **Banco piloto**: Identificar 1 banco o fondo dispuesto a ser beta tester.

---

## Referencias y Recursos

- [12-Factor App](https://12factor.net/) - Metodologia cloud-native
- [NestJS Docs](https://docs.nestjs.com/) - Framework backend
- [Next.js Architecture](https://nextjs.org/docs/architecture) - Frontend
- [Prisma ORM](https://www.prisma.io/) - Type-safe database
- [Supabase](https://supabase.com/) - Firebase alternative (alternativa a considerar)
- [Keycloak](https://www.keycloak.org/) - Auth y autorizacion
- [Metabase](https://www.metabase.com/) - BI open source
- [Ley 172-13 RD](https://www.sb.gob.do/regulacion/leyes/ley-no-172-13-proteccion-de-los-datos/) - Proteccion de datos
- [WhatsApp Business Policy](https://whatsappbusiness.com/policy/) - Restricciones de WhatsApp
- [DORA Research - Google Cloud](https://cloud.google.com/architecture/devops) - DevOps capabilities

---

> **Nota final**: Este plan maestro es un documento vivo. Debe actualizarse con cada sprint retrospective, incorporando lecciones aprendidas y ajustando estimaciones. La prioridad siempre es: **legal compliance > seguridad > funcionalidad > performance > features nice-to-have**.
