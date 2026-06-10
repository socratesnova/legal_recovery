# Recomendaciones de Herramientas, Librerías y Servicios — Legal Recovery OS

> **Fecha:** Junio 2026  
> **Alcance:** Frontend, Backend (NestJS), AI Microservice (Python), Validación de Datos (RD/Latam), Comunicaciones, Testing, Seguridad, Observabilidad, Documentos, BI  
> **Audiencia:** Equipo de desarrollo y arquitectura  
> **Estado:** Investigación completa, listo para Sprint 0

---

## Resumen Ejecutivo por Capa

| Capa | Elección principal | Alternativa | Costo MVP |
|------|-------------------|-------------|-----------|
| **Frontend UI** | shadcn/ui + Tailwind | — | Free |
| **Tablas de datos** | TanStack Table v8 | React Data Grid | Free |
| **Formularios** | React Hook Form + Zod | TanStack Form v1 | Free |
| **Charts/Dashboards** | Recharts (shadcn-chart) + Tremor | Apache ECharts | Free |
| **Gestión de estado** | TanStack Query v5 + Zustand | Jotai | Free |
| **Backend framework** | NestJS + Prisma | — | Free |
| **RBAC/ABAC** | nest-casl + `canUseData()` custom | @casl/nestjs | Free |
| **Multi-tenancy** | Prisma `$extends` + PostgreSQL RLS | — | Free |
| **Audit logs** | Prisma `$extends` + triggers PostgreSQL + hash chain | — | Free |
| **Soft delete** | `prisma-extension-soft-delete` | Custom middleware | Free |
| **Rate limiting** | `@nestjs/throttler` + Redis | Custom Redis guard | Free |
| **Validación input** | Zod + `prisma-zod-generator` | class-validator | Free |
| **Colas/Workers** | `@nestjs/bullmq` | — | Free |
| **Email** | AWS SES | Postmark (deliverability) | ~$1/10k emails |
| **SMS** | Twilio | Local carrier (post-MVP) | ~$0.13/SMS |
| **WhatsApp** | Twilio WhatsApp API | 360dialog (escala) | ~$0.008/msg |
| **Voice/Voicebot** | Twilio Voice + faster-whisper | Voximplant | ~$0.12/min |
| **PDF generation** | Puppeteer + Handlebars (NestJS) | Playwright | Free |
| **PDF legal (Python)** | WeasyPrint | ReportLab | Free |
| **Excel/CSV** | ExcelJS (streaming) | SheetJS | Free |
| **OCR** | PaddleOCR + Tesseract | EasyOCR | Free |
| **Document parsing** | marker + PyMuPDF | pdfplumber | Free |
| **RAG/Vector DB** | ChromaDB | pgvector (alternativa) | Free |
| **Embeddings** | BGE-M3 (sentence-transformers) | multilingual-e5 | Free |
| **LLM local** | Ollama (Llama 3.1 8B Q4) | llama.cpp | Free |
| **Speech-to-text** | faster-whisper (small/medium) | WhisperX | Free |
| **Text-to-speech** | Piper | Coqui TTS | Free |
| **Anonimización PII** | Microsoft Presidio + spaCy | Custom regex | Free |
| **ML Scoring** | XGBoost + SHAP | LightGBM | Free |
| **BI/Dashboards** | Metabase self-hosted | Apache Superset | Free |
| **Testing** | Jest + Playwright + pytest | — | Free |
| **Seguridad (SAST)** | Semgrep | SonarQube CE | Free |
| **Pentesting** | OWASP ZAP + Nuclei | Burp Suite Pro (auditor) | Free |
| **Secret detection** | GitLeaks + TruffleHog | GitGuardian (escala) | Free |
| **Dependencias** | Snyk + Dependabot | — | Free-$25/dev/mo |
| **Logs** | Grafana Loki + Grafana | ELK | Free |
| **Métricas** | Prometheus + Grafana | Datadog (escala) | Free |
| **Tracing** | OpenTelemetry + Jaeger/Tempo | Datadog APM | Free |
| **Alerting** | Alertmanager + Slack | PagerDuty | Free-$21/user/mo |
| **Backups** | pgBackRest → MinIO | wal-g | Free |
| **Validación cédula RD** | Algoritmo local (offline) | — | Free |
| **Validación RNC DGII** | `dgii-utils` + circuit breaker | — | Free |
| **Validación teléfono** | `google-libphonenumber` | — | Free |
| **Validación email** | AbstractAPI / ZeroBounce | Mailgun | Free-$17/mo |
| **Geocoding** | Google Address Validation | Nominatim | $5/1K |
| **QR codes** | `qrcode` + `sharp` | `react-qr-code` | Free |
| **Firma digital MVP** | Click-accept + audit trail | DocuSign (producción) | Free |

**Costo total estimado de infraestructura externa en MVP:** **$200-500/mes** (principalmente Twilio + AWS SES + Google Maps + Snyk si se usa tier pago).

---

## 1. FRONTEND — Next.js 15 + React 19 + Tailwind

### 1.1 Componentes UI: shadcn/ui

**Elección:** `shadcn/ui` (vía CLI `npx shadcn@latest`)

- No es un npm package tradicional — es una plataforma de distribución de código con CLI, registry schema, y filosofía "open code"
- 116k estrellas GitHub, mantenido por Vercel, activo a junio 2026
- Cada componente se copia al repo — se audita línea por línea, ideal para compliance
- Soporta blocks (autenticación, dashboards) y charts

**Comandos clave:**
```bash
npx shadcn@latest init
npx shadcn add button table form dialog badge calendar chart toast sonner
```

**Importante para compliance:** Los componentes son client components (`"use client"`). En App Router, marcar deliberadamente server/client boundaries. Los componentes chart requieren `min-h-[VALUE]` para evitar hydration mismatches en SSR.

---

### 1.2 Tablas de Datos

**Elección primaria:** `@tanstack/react-table` v8

- **Canónica para shadcn/ui** — la guía oficial de shadcn "Data Table" usa TanStack Table
- Headless: tú traes el markup (shadcn `<Table>`), la engine maneja sorting, filtering, pagination, grouping, selection, column sizing, visibility, pinning
- Server-side: `manualPagination`, `manualSorting`, `manualFiltering` para controlar estado y enviar a NestJS API
- 10k+ filas: parear con `@tanstack/react-virtual` para virtualización
- Expandable rows: `getExpandedRowModel()` para timeline dentro de filas
- Column pinning: `columnPinning` state — case ID y nombre deudor permanecen visibles al scrollear
- TypeScript: `ColumnDef<Case>[]` con inferencia completa desde tipos Prisma

**Instalación:**
```bash
npm install @tanstack/react-table
# Virtualización opcional
npm install @tanstack/react-virtual
```

**Alternativa ligera:** `react-data-grid` (Comcast, 7.6k estrellas) — built-in virtualization, frozen columns, tree data. Menos flexible para shadcn pero más rápido de configurar.

**No usar:** AG Grid Community (enterprise license $999 para features avanzados, bundle pesado, estilo separado de Tailwind).

---

### 1.3 Formularios

**Elección primaria:** `react-hook-form` + `zod` + `@hookform/resolvers`

- shadcn/ui documenta oficialmente RHF + Zod en su guía de Forms
- Componentes `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormMessage>` integrados con shadcn
- `useFieldArray` para arrays dinámicos (cuotas de pago, cláusulas de acuerdo)
- Zod schemas compartibles entre frontend (Next.js) y backend (NestJS) vía paquete compartido en monorepo

**Instalación:**
```bash
npx shadcn add form  # Instala RHF + Zod + shadcn form primitives
```

**Alternativa futura:** `@tanstack/react-form` v1 — mejor TypeScript, server actions nativas, granular subscriptions. shadcn no la documenta aún, requiere adaptar `<Form>` primitives manualmente.

**Para portal deudor (accesibilidad):** `conform` (`@conform-to/react`, `@conform-to/zod`) — progressive enhancement, funciona sin JavaScript. Bueno para formularios legales donde resiliencia importa.

---

### 1.4 Charts y Dashboards

**Elección primaria:** `recharts` v3 (vía shadcn-chart)

- shadcn/ui chart es wrapper fino alrededor de Recharts v3
- Theming por CSS variables (`--chart-1`, `--chart-2`)
- `ChartContainer`, `ChartTooltipContent`, `ChartLegendContent`
- Bar charts (pagos por mes), line trends (tasas recuperación), pie/donut (composición cartera)
- Accessibility: `accessibilityLayer` prop
- SSR: marcar componentes `"use client"`, usar `min-h` en contenedor

**Instalación:**
```bash
npx shadcn add chart
```

**Para visualizaciones complejas:** `echarts` + `echarts-for-react` — heatmaps (actividad por día), gauge/KPI (score de riesgo), 10M+ puntos de datos, mejor SSR support que Recharts.

**Para dashboards rápidos MVP:** `@tremor/react` — 35+ componentes, copy-paste blocks, basado en Recharts + Radix + Tailwind. Tremor se une a Vercel, mantenimiento asegurado.

---

### 1.5 PDF Viewer

**Elección:** `react-pdf` (by wojtekmaj)

- 11.1k estrellas, v10.x activa (2026)
- `<Document file="...">` + `<Page pageNumber={n} />`, zoom via `scale`, navegación por `numPages`
- Text layer opcional para selección y accesibilidad
- Audit trail: `onLoadSuccess`, `onRenderSuccess`, navegación de página logeable
- Worker en thread separado, archivo no expuesto al DOM principal

**Instalación:**
```bash
npm install react-pdf
```

**Configuración Next.js:** Usar `next/dynamic` con `ssr: false` o asegurar que sea client component. Configurar `pdfjs.GlobalWorkerOptions.workerSrc` apuntando a `pdfjs-dist/build/pdf.worker.min.mjs`.

**Alternativa fallback:** `<iframe src="/api/documents/123/view" />` — sandbox nativo del browser, cero superficie de ataque JS, tracking por server logs.

---

### 1.6 File Upload

**Elección primaria:** Uppy (`@uppy/core`, `@uppy/react`, `@uppy/tus`, `@uppy/aws-s3`)

- v5 con headless components y hooks
- Chunked uploads vía protocolo TUS (resumible, tolerante a fallos de red)
- Direct-to-MinIO/S3 vía presigned URLs (`@uppy/aws-s3`)
- Dashboard UI con drag-drop, editor de imagen, webcam, fuentes remotas
- React: `UppyContextProvider`, `Dropzone`, `FilesList`, `UploadButton`
- i18n multi-language (español para RD)
- Plugin "Golden Retriever" para recuperación de archivo tras crash de browser

**Instalación:**
```bash
npm install @uppy/core @uppy/react @uppy/tus @uppy/aws-s3
```

**Alternativa ligera:** `react-dropzone` + `@mux/upchunk` — menor bundle size, drag-drop + chunked upload, UI con shadcn components.

**Nota:** Uppy requiere backend endpoint para presigned URLs. El bundle es grande — tree-shake cuidadosamente.

---

### 1.7 Fechas / Calendario

**Elección:** `react-day-picker` v9 + `date-fns` + `date-fns-tz`

- shadcn `<Calendar>` está construido directamente sobre `react-day-picker`
- Modos: single date, range selection (`mode="range"`), dropdown mes/año (`captionLayout="dropdown"`), presets, date+time picker
- Timezone: prop `timeZone` + `date-fns-tz` para RD (America/Santo_Domingo)
- Business days: `modifiers` para deshabilitar fines de semana y restringir horarios (8am-8pm)

**Instalación:**
```bash
npx shadcn add calendar  # Instala react-day-picker y date-fns
```

**Para cálculos complejos:** `luxon` — timezone nativo, intervalos, duraciones. Usar al lado de date-fns para backend ("¿cuándo podemos contactar legalmente al deudor siguiente?").

---

### 1.8 Gestión de Estado

**Estado servidor:** `@tanstack/react-query` v5

- Cacheo stale-while-revalidate, background refetching, garbage collection
- `useInfiniteQuery` para patrones load-more
- `optimisticUpdate` + rollback
- SSR/hydration dedicado para Next.js 15
- Query keys naturalmente codifican multi-tenant: `['cases', institutionId, portfolioId, filters]`

**Instalación:**
```bash
npm install @tanstack/react-query
```

**Estado cliente:** `zustand`

- 58.3k estrellas, "bear necessities"
- Sin providers, hook-based, no context wrapper
- Slices pattern: `useAuthStore`, `useUISore`
- Middleware: `persist` (localStorage para filtros de tabla), `devtools` (Redux DevTools), `immer`

**Instalación:**
```bash
npm install zustand
```

**Nota:** En RSC (React Server Components), evitar crear stores a nivel de módulo.

---

### 1.9 Notificaciones / Toasts

**Elección:** `sonner`

- 12.7k estrellas, shadcn native (`npx shadcn add sonner`)
- `toast.success()`, `toast.error()`, `toast.info()`, `toast.warning()`, `toast.promise()`, `toast.custom()`
- Rich actions: "Acuerdo generado — [Ver] [Deshacer]"
- Undo vía action callback — crítico para human-in-the-loop
- Swipe to dismiss, expand/collapse, 9 posiciones

**Instalación:**
```bash
npx shadcn add sonner
```

**Complemento accesibilidad:** shadcn Toast (Radix UI `npx shadcn add toast`) para persistent notification centers con máxima accesibilidad (ARIA live regions, focus management).

---

### 1.10 Search / Command Palette

**Elección:** shadcn Command (`cmdk` via shadcn)

- `npx shadcn add command` instala wrapper estilizado de `cmdk` (12.7k estrellas, v1.1.1)
- Fuzzy filtering built-in, `shouldFilter={false}` para búsqueda server-side
- Async: `<Command.Loading>` mientras fetch
- Nested pages: "Pages" pattern para drilling down
- Global search: ⌘K vía `useEffect` keydown listener

**Instalación:**
```bash
npx shadcn add command
```

**Limitación:** No es RSC-safe — debe ser client component. Virtualization no built-in; degradación de performance a 2,000-3,000+ items.

---

## 2. BACKEND — NestJS + Prisma + PostgreSQL

### 2.1 RBAC / ABAC

**Elección:** `nest-casl` + servicio custom `canUseData()`

- `nest-casl`: Built específicamente para NestJS con CASL v6. Soporta condiciones ABAC dinámicas via `can(action, subject, conditions)`. `ConditionsProxy` extrae SQL/Mongo conditions para queries Prisma.
- Para permisos granulares por campo (sensibilidad del dato): servicio custom `canUseData(user, data, purpose, channel)` que evalúa `source_type`, `legal_basis`, `allowed_uses[]`, `prohibited_uses[]`, `expiration_date`, `visibility_roles[]`, `confidence_score`
- Implementar como NestJS interceptor o service-layer guard que corre después de RBAC pero antes de que Prisma retorne datos

**Instalación:**
```bash
npm install nest-casl
```

**Alternativa más control:** `@casl/nestjs` — bridge oficial CASL, más boilerplate pero control total sobre ability definition.

---

### 2.2 Multi-tenancy

**Elección:** Shared DB, Shared Schema + `institution_id` + PostgreSQL RLS + Prisma `$extends`

- Prisma Client Extension vía `Prisma.defineExtension` que envuelve cada query en transacción y setea variable de contexto RLS: `SET LOCAL app.institution_id = ${institutionId}`
- Políticas RLS en PostgreSQL: `USING (institution_id = current_setting('app.institution_id')::UUID)`
- Crear cliente extendido por-request en NestJS interceptor

**Caveat Prisma:** Documentación advierte que wrapping cada query en transacción vía extension puede romper explícitas `prisma.$transaction()` calls (nested transactions pueden no funcionar). Aplicar RLS extension a nivel de request y usar cliente extendido para todas las queries.

**NO usar:** Connection string per tenant (overhead operativo alto), schema per tenant (Prisma no soporta dynamic schema switching sin regenerar cliente).

---

### 2.3 Audit Logging (Inmutable)

**Arquitectura híbrida recomendada:**

**Capa 1 (Aplicación):** Prisma `$extends` query extension
- Intercepta `$allModels.$allOperations`
- Para `create`, `update`, `delete`, `upsert`, `updateMany`: extrae `args`, `model`, `operation`, más contexto HTTP (`user_id`, `IP`, `user_agent`, `institution_id`)
- Inserta en tabla append-only `audit_logs` dentro de la misma transacción
- Contexto HTTP via `AsyncLocalStorage` o pasado al crear cliente extendido

**Capa 2 (Base de datos):** PostgreSQL triggers
- Tabla `audit_logs` sin `UPDATE` ni `DELETE` — revocar permisos incluso a superuser vía event triggers o extensiones
- Capturar `OLD.*` en triggers `UPDATE` para `changes_json` diff
- WAL archiving como respaldo físico

**Capa 3 (Hash chain + checkpoint WORM):**
- Cada fila `audit_log` incluye `previous_hash` y `current_hash` (SHA-256)
- `current_hash = SHA(previous_hash + action + entity_type + entity_id + changes_json + user_id + created_at)`
- Job cron cada hora escribe checkpoint hash a MinIO bucket con Object Lock (WORM)
- Job de verificación cada hora valida últimos N entries contra cadena

**Schema mínimo:**
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL,
  ip_address INET,
  user_agent TEXT,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  changes_json JSONB,
  institution_id UUID NOT NULL,
  channel VARCHAR(50),
  previous_hash VARCHAR(64),
  current_hash VARCHAR(64),
  metadata JSONB
);
-- Revocar UPDATE/DELETE
REVOKE UPDATE, DELETE, TRUNCATE ON audit_logs FROM PUBLIC;
```

---

### 2.4 Soft Delete

**Elección:** `prisma-extension-soft-delete`

- v2.0.1, 11k descargas semanales
- Reescribe `delete` → `update { deletedAt: new Date() }`
- Agrega `deletedAt: null` automáticamente a `findMany`, `findFirst`, `findUnique`, relation `where`
- Soporta nested relation soft deletes
- `findUnique` con compound unique indexes: override con `allowCompoundUniqueIndexWhere: true`

**Instalación:**
```bash
npm install prisma-extension-soft-delete
```

**Extensión para admin override:**
```typescript
const adminSoftDeleteExtension = Prisma.defineExtension({
  query: {
    $allModels: {
      async findMany({ args, query, operation }) {
        const ctx = als.getStore();
        if (ctx?.includeDeleted) return query(args);
        return query({ ...args, where: { ...args.where, deletedAt: null } });
      }
    }
  }
});
```

---

### 2.5 Rate Limiting

**Elección:** `@nestjs/throttler` + `nestjs-throttler-storage-redis`

- Oficial NestJS, 2.4M descargas semanales, v6.5.0
- Múltiples named throttler definitions (short/medium/long)
- Custom `getTracker` para usar user ID en lugar de IP
- Custom `generateKey` para per-role keys: `${role}:${tracker}:${throttlerName}`
- Debe usar Redis storage para producción (in-memory no funciona cross-instance)

**Configuración por portal:**
```typescript
@Throttle({ default: { limit: 5, ttl: 60000 } }) // Deudor: 5 req/min
@Throttle({ default: { limit: 60, ttl: 60000 } })  // Admin: 60 req/min
```

**Rate limiting adicional en BullMQ:** `limiter: { max: 10, duration: 1000 }` en workers de email/SMS para respetar límites de proveedores.

**Instalación:**
```bash
npm install @nestjs/throttler nestjs-throttler-storage-redis
```

---

### 2.6 Input Validation

**Elección:** Zod + `prisma-zod-generator` / `zod-prisma` + custom `ZodValidationPipe`

- Zod: 157M descargas semanales, v4.4.3, TypeScript-first
- Schemas puras TypeScript compartibles entre frontend y backend vía paquete compartido en monorepo
- Generar Zod schemas desde Prisma schema para single source of truth
- `@anatine/zod-nestjs` proporciona `ZodValidationPipe` y `createZodDto` — nota: poco mantenido (3 años), puede requerir fork o pipe custom

**Si Swagger auto-generation es crítico:** Usar `class-validator` para DTOs de controller (docs automáticas) pero validar en service boundary con Zod schemas.

**Instalación:**
```bash
npm install zod
npm install -D prisma-zod-generator
```

---

### 2.7 API Documentation

**Elección:** `@nestjs/swagger` con split public/internal

- Auto-genera OpenAPI desde TypeScript types, decorators, `class-validator` metadata
- Split: documento público (`/api/docs`) para módulos externos + documento interno (`/api/internal/docs`) para AI, admin
- `@ApiExcludeController()` en endpoints internos
- Custom `@RequiresPermission('case:read', { scope: 'institution' })` decorator + plugin que enriquece descripciones Swagger

**Configuración split:**
```typescript
const publicDocument = SwaggerModule.createDocument(app, publicConfig, {
  include: [PublicModule, CasesModule, DocumentsModule],
});
SwaggerModule.setup('api/docs', app, publicDocument);

const internalDocument = SwaggerModule.createDocument(app, internalConfig, {
  include: [AiModule, AdminModule],
});
SwaggerModule.setup('api/internal/docs', app, internalDocument, { swaggerOptions: { docExpansion: 'none' } });
```

---

### 2.8 File Upload

**Elección:** `@nestjs/platform-express` multer + `@aws-sdk/client-s3` (MinIO-compatible)

- `FileInterceptor`, `FilesInterceptor`, `AnyFilesInterceptor` built-in NestJS
- `@aws-sdk/client-s3` v3 compatible 100% con MinIO
- Pipeline: Multer → temp disk → stream SHA-256 → ClamAV scan → stream-upload MinIO multipart
- Metadata Prisma: `file_hash`, `user_id`, `case_id`, `institution_id`, `minio_object_key`, `virus_scanned`, `virus_clean`

**Virus scanning:** ClamAV en Docker container, `clamscan` npm package o `node-clam`.

**Hash:** Node.js `crypto.createHash('sha256')`, stream simultáneo a MinIO.

**Instalación:**
```bash
npm install @aws-sdk/client-s3
npm install -D @types/multer
```

---

### 2.9 Queue / BullMQ

**Elección:** `@nestjs/bullmq` + `bullmq`

- 1.6M descargas semanales wrapper, 5M bullmq (v5.78.0, publicado hace 8 días)
- Job progress tracking: `job.updateProgress(percent)`
- Retry: `attempts: 3`, `backoff: { type: 'exponential', delay: 5000 }`
- Dead letter: `@OnQueueEvent('failed')` listener persiste a tabla `failed_jobs` en Postgres
- Rate limiting por worker: `limiter: { max: 100, duration: 60000 }`

**Tipos de job:**
- `portfolio-import`: parse CSV/Excel, validación, deduplicación, `createMany`
- `report-generation`: query data, PDF/Excel, upload MinIO
- `scoring-batch`: fetch cases, call AI microservice, update scores
- `email-sender`: 100/min limit
- `sms-sender`: 10/min limit
- `ocr-processing`: documentos subidos

**Configuración queue:**
```typescript
BullModule.registerQueue({
  name: 'email-sender',
  limiter: { max: 100, duration: 60000 },
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});
```

**Instalación:**
```bash
npm install @nestjs/bullmq bullmq
```

**Evaluar post-MVP:** BullMQ Pro ($95/mes) para group-level rate limiting (per-debtor/per-institution).

---

### 2.10 Email / SMS / WhatsApp

#### Email
**Elección primaria:** `nodemailer` + AWS SES

- nodemailer: 13.4M descargas, v8.0.11, publicado hace horas — extremadamente activo
- Cualquier transporte SMTP, failover entre múltiples transports
- Handlebars templates para cuerpo de email
- AWS SES: $0.10/1,000 emails = $1/10k. Free tier: 3,000/mes x 12 meses.

**Alternativa deliverability:** Postmark — mejor deliverability transactional, 45-day content retention, Message Streams separadas, pero más caro ($16-18/mo base).

**Instalación:**
```bash
npm install nodemailer
npm install -D @types/nodemailer
```

#### SMS
**Elección primaria:** `twilio`

- 3.9M descargas, v6.0.2, activamente mantenido
- RD: $0.1308/SMS outbound. Inbound soportado.
- Alphanumeric sender ID gratis para RD ("BANCOXYZ")
- Delivery status webhooks: `queued`, `sent`, `delivered`, `failed`, `undelivered`
- Opt-out automático (`STOP`)

**Post-MVP escala:** Negociar con carriers locales (Claro, Altice, Viva) vía SMPP para $0.03-0.08/SMS. No viable para MVP.

**Instalación:**
```bash
npm install twilio
```

#### WhatsApp Business API
**Elección primaria:** Twilio WhatsApp API

- Unified con SMS/Voice. No platform fee separada.
- Costo DR: ~$0.0084/msg ($0.005 Twilio + ~$0.0034 Meta utility)
- Template approval vía Twilio console
- Webhooks: delivery, read, failed

**⚠️ CRÍTICO:** WhatsApp Business Policy prohíbe explícitamente:
- Debt collection messages directos
- Harassment o high-frequency messaging
- Sharing financial debt information sin consent
- Marketing sin opt-in

**Para este proyecto, WhatsApp es canal RESTRINGIDO y NEUTRAL:**
- Solo utility/authentication templates: "Hola. Recibimos su solicitud. Para acceder a su cuenta, haga clic aquí: [link]"
- Solo cuando deudor optó-in e inició contacto, o para links al portal
- Nunca iniciar conversación sobre deuda

**Alternativa post-MVP (volumen >15k/mo):** 360dialog (€49/mo per number) — markup cero en Meta fees.

#### Voice / Voicebot
**Elección primaria:** Twilio Voice + faster-whisper (local)

- Twilio Voice: local landline $0.1155/min, mobile $0.1925/min, browser/app $0.004/min
- Call recording: $0.0025/min + storage
- Media Streams: $0.004/min para stream audio a backend NestJS
- Conversation Relay (AI voicebot managed): $0.07/min

**Transcripción local:** faster-whisper (Python) en lugar de API OpenAI — datos de deudor no salen del servidor.

**Post-MVP reducción costo:** Local DR SIP trunk vía BYOC para $0.03-0.08/min.

---

### 2.11 PDF / Excel Generation

#### PDF en Node.js
**Elección primaria:** `puppeteer` + `handlebars`

- 9.5M descargas, v25.1.0
- Full CSS `@page` rules: headers/footers, page numbers, margins, watermarks
- Firmas, sellos, overlays vía absolute positioning
- Warm render (reuse browser instance): 800ms-2s para 100 páginas
- Spanish: `<meta charset="UTF-8">` + fonts con Latin Extended-A

**Docker:** `browserless/chrome` como servicio separado. NestJS envía HTML via HTTP POST, recibe PDF.

**Instalación:**
```bash
npm install puppeteer handlebars
# O conectar a browserless/chrome externo
npm install puppeteer-core
```

**Alternativa:** `playwright` — misma engine, mejor API ergonomics, auto-waiting, error handling.

**Post-processing:** `pdf-lib` (1.4k dependents) para merge, stamp, watermark, form filling.

#### PDF en Python (FastAPI)
**Elección:** `weasyprint`

- Pure Python, sin browser dependency
- Mejor CSS Paged Media que Puppeteer: footnotes, cross-references, PDF/A compliance
- 2-4s / 100 páginas, ~100-200MB RAM
- Docker requiere `libpango`, `libcairo`, `libgdk-pixbuf`, `libffi`

**Alternativa:** `reportlab` — standard enterprise para PDF programáticos, tables, fillable forms.

**Manipulación:** `PyMuPDF` (fitz) — merge, split, redact, extract text.

#### Excel
**Elección primaria:** `exceljs`

- 2.5k dependents, v4.4.0
- Streaming API para archivos grandes sin cargar todo en memoria
- Formulas, estilos, múltiples sheets, auto-filters, sheet protection
- 10k rows: ~2-5s, ~50-100MB RAM con streaming

**Instalación:**
```bash
npm install exceljs
```

**Alternativas:**
- `csv-writer`: zero dependencies, streaming, ~20MB para 100k rows
- `xlsx` (SheetJS): más ligero pero no streaming en community edition
- Python `openpyxl`: para reports generados desde microservicio AI

**Masivo >100k rows:** PostgreSQL `COPY` directo a CSV, stream vía `pg-copy-streams`, upload MinIO.

---

## 3. AI MICROSERVICE — FastAPI + Python

### 3.1 LLM Local Deployment

**Elección primaria:** Ollama

- Un solo comando Docker: `docker run -d -v ollama:/root/.ollama -p 11434:11434 ollama/ollama`
- REST API nativo, maneja model downloads, quantization, memory automáticamente
- 7B Q4: ~4.5GB RAM, CPU-only viable
- 8B Q4: ~5GB RAM
- 13B Q4: ~8GB RAM

**Modelo recomendado para 16GB VM:** `llama3.1:8b` o `mistral:7b` para RAG y summarization. Para español dominicano: `qwen2.5:7b` (excelente multilingual).

**Alternativa:** `llama-cpp-python` — más eficiente CPU inference, GGUF standard, pero requiere descarga manual de modelos.

**No usar:** `vllm` — requiere GPU, inútil en CPU-only VM.

---

### 3.2 RAG Framework

**Elección primaria:** LangChain (`langchain`, `langchain-chroma`)

- FastAPI integration directa (`from langchain.chains import RetrievalQA`)
- Largest ecosystem, pre-built RAG templates, ChromaDB integration
- Spanish support delegada al modelo/embedding, no al framework

**Alternativa document-heavy:** LlamaIndex (`llama-index`) — superior document parsing pipeline, mejor citation generation via `CitationQueryEngine`.

**MVP recomendación:** LangChain para velocidad. Migrar a LlamaIndex o custom pipeline post-MVP si citation accuracy es prioridad.

---

### 3.3 Vector Database

**Elección primaria MVP:** ChromaDB

- Zero external dependencies, native LangChain/LlamaIndex integration
- JSON metadata per document (`law_name`, `article`, `year`)
- In-memory o persistent server mode
- 10K documentos legales con 768-dim vectors: ~500MB-1GB RAM
- Docker: `chromadb/chroma:latest`

**Alternativa escalable:** Qdrant (`qdrant-client`) — Rust, hybrid search, snapshots, más eficiente.

**Alternativa simplificadora:** `pgvector` (PostgreSQL extension) — elimina DB separada. HNSW index, ACID, backup es PostgreSQL backup. Para corpus legal dominicano (<50K chunks), pgvector es adecuado.

**Decisión:** ChromaDB para MVP y desacoplamiento. Evaluar migración a pgvector si simplificación operativa es prioridad.

---

### 3.4 Embeddings

**Elección primaria:** BGE-M3 vía `sentence-transformers`

- State-of-the-art multilingual, dense + sparse + multi-vector (ColBERT-style)
- 8192 token context — crítico para artículos legales largos
- ~2.3GB RAM al cargar
- Mejor para texto legal español

**Alternativa balance:** `multilingual-e5-large-instruct` — ~1.5GB RAM, 512 token limit.

**Fallback resource-constrained:** `paraphrase-multilingual-MiniLM-L12-v2` — ~400MB RAM, 384 dims, suficiente para MVP.

---

### 3.5 OCR

**Elección primaria:** PaddleOCR + Tesseract fallback

- **PaddleOCR:** Best-in-class para documentos en español incluyendo recibos, cédulas, formularios. Layout analysis (PP-Structure), angle detection. ~2-3GB RAM, 1-3s/página CPU.
- **Tesseract:** ~100MB RAM, good para PDFs limpios y contratos escaneados. Spanish pack `spa.traineddata`.
- Estrategia: Tesseract primero para speed, fallback a PaddleOCR en baja confianza.

**Alternativa:** EasyOCR (`easyocr`) — más simple, pure Python/PyTorch, ~1GB RAM, pero sin layout analysis.

**Docker:** `paddlepaddle/paddle:latest` para PaddleOCR.

---

### 3.6 Document Parsing

**Elección primaria:** `marker-pdf` + `PyMuPDF`

- **marker:** Convierte PDFs a Markdown con estructura preservada (headers, tables, lists, footnotes). Usa `surya` (layout detection) + `texify` (OCR). ~3-4GB RAM, lento en CPU (10-30s/página). Ideal para contratos escaneados.
- **PyMuPDF:** Más rápido para text extraction de PDFs nativos. ~200MB RAM.
- Estrategia: Detectar si PDF tiene imágenes → marker, sino PyMuPDF. Output limpio alimenta RAG chunker.

**Alternativa tablas:** `pdfplumber` — excelente table extraction, built on `pdfminer.six`.

---

### 3.7 Anonimización PII

**Elección primaria:** Microsoft Presidio (`presidio-analyzer`, `presidio-anonymizer`)

- Mature, production-tested. Built-in recognizers para names, emails, phones, addresses, IDs.
- Spanish via `spaCy` (`es_core_news_md`).
- Custom recognizers para cédulas dominicanas (`\d{3}-\d{7}-\d{1}`) y patrones locales.
- ~500MB-1GB RAM (analyzer + spaCy model).

**Alternativa ligera:** spaCy + custom `EntityRuler` — ~200MB RAM, pero sin built-in anonymization operators.

**Instalación:**
```bash
pip install presidio-analyzer presidio-anonymizer
python -m spacy download es_core_news_md
```

---

### 3.8 Speech-to-Text

**Elección:** `faster-whisper`

- 4x más rápido que Whisper original, misma accuracy
- CPU eficiente, local, offline
- Model sizes: `tiny` (~400MB), `base` (~600MB), `small` (~1GB), `medium` (~3GB), `large-v3` (~6GB)
- Para dominicano con ruido: `small` o `medium` recomendados
- Whisper maneja bien acento caribeño (entrenado en español diverso)

**Alternativa diarization:** WhisperX — word-level timestamps + speaker diarization, pero requiere `pyannote.audio` y setup más complejo.

---

### 3.9 Text-to-Speech

**Elección:** Piper

- Fast, lightweight neural TTS. ONNX Runtime.
- Spanish voices disponibles (`es_ES-davefx`, `es_MX-claude`)
- CPU real-time factor >10x. ~100-300MB RAM per voice model.
- Diseñado para voice assistants/IoT = perfecto para voicebot.

**Alternativa calidad:** Coqui TTS (`TTS`) — higher quality, puede fine-tune, pero más pesado (~1-2GB) y mantenimiento inestable.

**No usar:** Mozilla TTS — unmaintained.

---

### 3.10 ML Scoring (Tabular)

**Elección:** XGBoost + SHAP

- Industry standard tabular ML. Missing values nativos.
- Feature importance para explainability — crítico para defensa legal.
- Inferencia <100ms por caso.
- Entrenamiento batch offline, modelo guardado con `joblib`.

**Alternativa:** LightGBM — training más rápido, categorical features nativos, memoria menor.

**Explainability:** `shap` — global y local SHAP values muestran exactamente por qué un caso scored "baja recuperabilidad".

---

### 3.11 Resource Budget para FastAPI en 16GB VM

| Componente | RAM Budget | Notas |
|-----------|-----------|-------|
| FastAPI + Uvicorn | 200MB | Base |
| Ollama (Llama 3.1 8B Q4) | 5,500MB | Mayor consumidor |
| ChromaDB | 1,000MB | Corpus legal |
| BGE-M3 embeddings | 2,300MB | O usar multilingual-e5 para 1.5GB |
| PaddleOCR | 2,500MB | Cargar on-demand o常驻 |
| faster-whisper (small) | 1,000MB | Cargar on-demand |
| Presidio + spaCy | 800MB | Analyzer常驻 |
| XGBoost model | 200MB | Mínimo |
| Piper TTS | 300MB | Cargar on-demand |
| OS + Docker overhead | 2,000MB | Reserva |
| **Total** | **~15.8GB** | Ajustado pero factible |

**Optimizaciones:**
- Cargar/descargar modelos on-demand (OCR, TTS)
- Usar `medium` Whisper en lugar de `large`
- Considerar `multilingual-e5-large` en lugar de BGE-M3 (ahorro ~800MB)
- ChromaDB persistent mode con lower cache settings

---

## 4. VALIDACIÓN DE DATOS — República Dominicana / Latinoamérica

### 4.1 Cédula Dominicana (JCE)

**NO hay API pública de JCE.** Su website tiene consultas para ciudadanos, no endpoints bulk para terceros.

**Solución:** Implementar algoritmo de validación localmente.

- **Formato:** `000-0000000-0` (11 dígitos)
- **Algoritmo:** Weighted-sum checksum usando constantes `[1,2,1,2,1,2,1,2,1,2]` en primeros 10 dígitos. Para cada multiplicación, si producto >= 10, sumar dígitos. Agregar todos resultados. Dígito verificador es cantidad necesaria para llegar al siguiente múltiplo de 10.

**Librerías npm:**
- `validacion-cedula-dominicana` (61 weekly downloads, 6 años, ISC license)
- `dgii-utils` (65 weekly downloads, MIT, actualizado hace 14 días — también valida RNC y cédula)
- `@ldss95/helpers` — cédula + teléfono + moneda

**Implementación recomendada:** Crear servicio `CedulaService` en NestJS con algoritmo puro, sin dependencia externa. 100% offline, zero costo, instant.

---

### 4.2 RNC (DGII)

**NO hay API oficial documentada, pero existen servicios web de-facto y librerías.**

**Librería recomendada:** `dgii-utils`

- `consultRNC()` — lookup en tiempo real de nombre, estado, actividad económica
- `RNC.valid()`, `RNC.format()`, `RNC.clear()`
- MIT license, 65 weekly downloads, actualizado hace 14 días
- **Nota:** v2.0.0 deshabilitó SSL validation porque servidores DGII tienen problemas de certificado

**Estrategia:** Usar `dgii-utils` con caching (Redis) y circuit breaker. Fallback a validación de formato local cuando DGII está caído.

**Formato:** 11 dígitos (mismo que cédula para individuos, empresas empiezan con 1, 4, etc.)

---

### 4.3 Teléfono

**Elección:** `google-libphonenumber`

- 1.4M weekly downloads, activamente mantenido
- Full support RD: +1-809, +1-829, +1-849
- `isValidNumber()`, `isPossibleNumber()`, `getNumberType()` (FIXED_LINE, MOBILE)

**Limitación JS:** `PhoneNumberToCarrierMapper` no disponible en versión Node.js. No se puede detectar carrier actual ni portabilidad sin partnership telco.

**Estrategia:** Usar para validación de formato y tipo (mobile vs landline). Almacenar tipo para decidir canal (SMS/WhatsApp solo para mobile validado). Aceptar que carrier/portabilidad no son trackeables vía APIs públicas.

---

### 4.4 Email

**Elección:** AbstractAPI Email Validation

- Free: 100 requests/mes. Starter: $17/mes (5,000 requests).
- Features: syntax, MX, SMTP, disposable detection, typo suggestions, domain age, catch-all, role email detection
- REST JSON, <300ms response
- SOC 2 Type II, GDPR

**Alternativas:**
- **ZeroBounce:** 100 free/mes. 99.6% accuracy, SOC 2 Type 2, GDPR, HIPAA, CCPA.
- **Mailgun:** Incluido con plan de envío. Foundation $35/mo.

**Implementación:** Cachear resultados en Redis para evitar re-validación.

---

### 4.5 Dirección / Geocoding

**Elección primaria:** Google Address Validation API

- ~$5/1,000 requests. $200 crédito mensual free.
- Confirmation levels (confirmed, unconfirmed), component validation, geocoding en una llamada
- Mejor cobertura para RD incluyendo áreas rurales

**Alternativa gratuita:** OpenStreetMap Nominatim — free, 1 req/seg recomendado, self-hosting posible. Menos confiable para direcciones informales comunes en RD.

**Sin API postal RD:** INPOSDOM no tiene API pública.

---

### 4.6 Burós de Crédito / SIC

**No accesibles para plataformas third-party.**

- **TransUnion RD, Equifax RD, Experian:** Acceso solo para entidades financieras registradas con Superintendencia de Bancos. Requieren consentimiento expreso (Ley 172-13 Art. 8).
- **SIC (Banco Central RD):** Solo intermediarios financieros regulados. Requiere autorización del BCRD.

**Estrategia:** La plataforma consume datos crediticios **proporcionados por el banco cedente** como parte de la transferencia de cartera. Registrar provenancia: `source: SIC-BCRD`, `legal_basis: portfolio_transfer_contract`, `allowed_uses: [recovery, scoring]`, `restrictions: [no_external_sharing]`.

---

### 4.7 Registros Judiciales / Propiedades

**No hay APIs públicas.**

- Poder Judicial RD: digitization initiatives existen pero no hay web services públicos para lookup de casos o gravámenes.
- Registro de Títulos: requiere visita presencial o representante legal autorizado.

**Estrategia:** Workflow manual en frontend donde personal legal adjunta certificaciones escaneadas. Document module almacena con full audit trail.

---

### 4.8 Bases Legales (RAG)

**vLex** — legal intelligence global, cubre República Dominicana.

- Productos: vLex Library (casos, estatutos, regulaciones), Docket Alarm (court records + API), Vincent AI (legal research AI)
- APIs: Docket Alarm ofrece APIs para court record monitoring. vLex Labs ofrece integraciones enterprise.
- Costo: Enterprise subscription, contactar sales.

**Uso:** Herramienta de research para personal legal, no fuente de datos automática. Citaciones almacenadas como structured data en plataforma.

**Alternativa:** Thomson Reuters Westlaw — cobertura global, Caribbean limitada comparado con vLex.

---

## 5. TESTING

### 5.1 NestJS

**Stack:** Jest (built-in) + `c8` + `testcontainers` + `jest-mock-extended` + `supertest`

- Jest: NestJS CLI scaffolds por defecto. `@nestjs/testing` con `Test.createTestingModule()`
- `testcontainers`: PostgreSQL 16, Redis, MinIO reales por suite de test. Compatible Docker-in-Docker en CI.
- `jest-mock-extended`: `mockDeep<PrismaClient>()` para mocking recursivo de todos los delegates Prisma.
- Supertest para E2E: `request(app.getHttpServer())`

**Testing constructs específicos:**
- Middleware (audit): mini-app con `Test.createTestingModule()` + `INestApplication`, mock clock con `jest.useFakeTimers()`
- Guards (RBAC): guard class directamente, mock `ExecutionContext` con `createMock<ExecutionContext>()` de `@golevelup/ts-jest`
- Pipes (validation): `validate(dto)` desde `class-validator`, o `.transform(value, metadata)` para custom pipes

**No usar Vitest como primario:** NestJS `TestingModule` y decorator metadata system asumen CommonJS/Jest. Vitest añade overhead de mantenimiento.

---

### 5.2 Next.js

**Stack:** Playwright + React Testing Library + Vitest

- **Playwright sobre Cypress:** cross-browser, parallel workers, auto-waiting, API request interception, manejo limpio de múltiples tabs/orígenes (los 3 portales)
- **RTL + Vitest:** component testing. Vitest natural para frontend desacoplado de Jest constraints.

**Flujos críticos E2E:**
1. Login MFA: generar TOTP en test usando `otpauth` o `speakeasy`
2. Upload portfolio: attach CSV, assert progress, validar toast, check backend
3. Create agreement: navigate case → proposal → assert PDF preview → assert audit log
4. Debtor portal: validar progressive auth (cédula → pregunta seguridad → OTP)

---

### 5.3 Python / FastAPI

**Stack:** pytest + pytest-asyncio + `httpx.AsyncClient` + pytest-factoryboy

- FastAPI recomienda `httpx.AsyncClient` (no sync `TestClient` para endpoints async)
- `pytest-asyncio`: `@pytest.mark.asyncio`, `asyncio_mode = auto`
- Mocking LangChain: `unittest.mock.AsyncMock` o `pytest-mock`
- Mocking ChromaDB: temporary directory-backed client, o mock `chromadb.Client`
- Fixtures: `pytest-factoryboy` para `Case`, `Document`, `Debtor`

---

### 5.4 API Testing / Documentación

**Elección:** Bruno

- Git-native collections (`.bru` files) en repo. No vendor lock-in.
- `bru run` CLI en CI.
- Versioned alongside code = auditors pueden ver exactamente qué tests existían en cada commit.

**Alternativas:** Hoppscotch (self-hosted, open source GUI), Postman (cloud vendor lock-in, $12-29/user/mo).

---

### 5.5 Contract Testing

**Elección:** Pact.io (frontend-backend)

- Consumer-driven: Next.js define pacts para 16 módulos API. NestJS verifica en CI.
- Pact Broker (self-hosted Docker) almacena contratos.
- Para backend-AI microservice (internal-only): validación custom OpenAPI + `openapi-typescript` + `zod` — más simple que Pact.

**Post-MVP evaluar:** PactFlow (commercial) para bi-directional contracts.

---

## 6. SEGURIDAD

### 6.1 Pentesting

**Stack:** OWASP ZAP + Nuclei

- **ZAP:** `zaproxy/zap-stable` Docker. `zap-baseline.py` o `zap-full-scan.py` en CI contra staging. Maneja OpenAPI specs nativamente.
- **Nuclei:** Template-based scanner de ProjectDiscovery. Miles de templates CVE, misconfigurations, API vulnerabilities.

**Workflow CI:**
1. Wait for staging healthcheck
2. ZAP baseline scan
3. Nuclei con severity `critical,high`
4. Upload SARIF a GitHub Security tab

**Para auditoría externa:** Burp Suite Pro (~$449/user/year).

---

### 6.2 Dependency Scanning

**Stack:** Snyk + Dependabot

- **Snyk:** `snyk test` falla CI en critical/high. `snyk container test` para Docker images. Fix PRs automáticos.
- **Dependabot:** GitHub native, PRs automáticos para updates rutinarios.
- **Costo:** Free tier open source / small teams (200 tests/mes). Paid ~$25-52/dev/mes.

---

### 6.3 Secret Detection

**Stack:** GitLeaks + TruffleHog

- **GitLeaks:** `gitleaks detect` en CI, `gitleaks protect` en pre-commit. 200+ secret patterns.
- **TruffleHog:** deep history + entropy + live API verification. Nightly scan en full history.
- **GitGuardian:** Enterprise opcional ($25-40/dev/mes) para team scaling.

**Pre-commit:**
```yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8
    hooks:
      - id: gitleaks
```

---

### 6.4 SAST (Static Analysis)

**Stack:** Semgrep + SonarQube Community Edition

- **Semgrep:** Fast, modern, open source. TypeScript, Python, SQL. Custom rules para LR OS:
  - "Endpoint sin `@UseGuards()`" → error
  - "`prisma.$queryRaw` sin parameterization" → error
  - "Canal WhatsApp sin opt-in check" → error
  - "Dato de deudor sin `canUseData()`" → error
- **SonarQube CE:** Code quality, duplication, complexity. Self-hosted Docker (`sonarqube:community`).
- **CodeQL:** GitHub Advanced Security para repos privados (~$21/dev/mes). Análisis semántico profundo.

**Costo:** Semgrep CE free. SonarQube CE free. CodeQL free para públicos, pago privados.

---

## 7. OBSERVABILIDAD

### 7.1 Logs

**Stack:** Grafana Loki + Promtail + Grafana

- Loki: label-based log aggregation, no full-text index como Elasticsearch = más barato y simple
- Promtail sidecars en cada servicio scrapen stdout/stderr
- NestJS: `nestjs-pino` outputting JSON
- FastAPI: `python-json-logger` o `structlog`
- Retención: `audit_logs_stream` = 7+ años (legal), `application_logs` = 90 días

**Alternativa:** ELK stack (más poderoso pero pesado: Elasticsearch 2-4GB RAM).

**Costo:** Self-hosted free. Grafana Cloud Loki ~$0/50GB luego ~$0.25/GB.

---

### 7.2 Métricas

**Stack:** Prometheus + Grafana

- Prometheus scrapes desde NestJS (`@willsoto/nestjs-prometheus` o `prom-client`), FastAPI (`prometheus-fastapi-instrumentator`), PostgreSQL (`postgres_exporter`), Redis (`redis_exporter`), MinIO (built-in `/minio/v2/metrics/cluster`)
- Business metrics custom:
  - `recovery_rate_total{institution_id="xxx"}`
  - `dispute_rate_total`
  - `agreement_conversion_rate`
  - `legal_firewall_blocked_total{reason="no_source"}`
- Grafana dashboards: importar community + custom "Legal Operations"

**Costo:** Self-hosted free. Grafana Cloud metrics ~$8/10K series/mes.

---

### 7.3 Tracing

**Stack:** OpenTelemetry + Jaeger (o Grafana Tempo)

- OTel SDKs: Node.js (`@opentelemetry/sdk-node`), Python (`opentelemetry-instrumentation-fastapi`), PostgreSQL, Redis, MinIO
- **Jaeger:** Self-hosted, UI excelente para trace search y dependency graphs.
- **Grafana Tempo:** Integra nativo con Grafana (trace-to-log correlation), más resource-efficient que Jaeger para high-volume.
- NestJS: `@metinseylan/nestjs-opentelemetry` o manual `NodeSDK`
- Next.js: OTel Node.js SDK en custom server o middleware

**Uso legal:** Cuando deudor disputa una comunicación, reconstruir path completo: Portal → NestJS → `canUseData()` → Communication Service → Twilio.

**Costo:** Self-hosted free. Datadog APM ~$31/host/mes.

---

### 7.4 Alerting

**Stack:** Alertmanager + Slack/PagerDuty

- Alertmanager: routing por severidad. `warning` → Slack, `critical` → PagerDuty
- Reglas para LR OS:
  - API down (>2m)
  - DB connection failure
  - Queue stuck (>1000 jobs >10m)
  - Audit log tampering (`audit_log_hash_verification_failed > 0`)
  - High dispute rate
  - Mass access anomaly

**PagerDuty:** $21-41/user/mes para on-call scheduling.

**Monitoreo externo:** UptimeRobot/Pingdom ($7-15/mes) para health checks desde múltiples regiones.

---

### 7.5 Backups / Disaster Recovery

**Stack:** pgBackRest → MinIO

- PostgreSQL backup gold standard: full, incremental, differential
- WAL archiving para Point-in-Time Recovery (PITR) a cualquier segundo
- Compresión y encryption AES-256
- Retención por compliance: 7 años audit data, 90 días application

**Alternativa:** wal-g (Go, Walmart) — cloud-native, más simple para S3/MinIO puro.

**pg_dump:** Solo para schema exports y portabilidad, NO para DR primario.

**Configuración:**
- pgBackRest sidecar/container junto a PostgreSQL
- Backup cada 6 horas incremental, semanal full
- Destino: MinIO bucket `backups/postgres/` con versioning
- CI: validar integridad restaurando backup en container temporal semanalmente

---

## 8. BI / REPORTES / FIRMA DIGITAL

### 8.1 BI Dashboards

**Elección primaria:** Metabase self-hosted

- Open source AGPL, self-hosted forever free
- Conecta directamente a PostgreSQL via read-only
- Row Level Security via Sanded Tables + Data Sandboxing
- Scheduled Pulses: email/Slack con PDF/CSV attachments
- Signed Embedding en Next.js portal: Next.js autentica user, genera signed JWT, Metabase muestra solo dashboards permitidos
- **Traducción español completa** desde v0.47+. Formato DOP soportado.
- Memory: 1-2GB RAM

**Configuración embedding:**
```typescript
const payload = {
  resource: { dashboard: 42 },
  params: { institution_id: user.institutionId },
  exp: Math.round(Date.now() / 1000) + (10 * 60)
};
const token = sign(payload, METABASE_SECRET);
const iframeUrl = `${METABASE_URL}/embed/dashboard/${token}#bordered=true&titled=true`;
```

**Alternativa avanzada:** Apache Superset — más poderoso para analytics complejos, pero steeper curve y Spanish translation menos completa.

**Dashboards custom Next.js:** Recharts/Tremor para KPIs embebidos en portal en tiempo real.

---

### 8.2 Scheduling de Reportes

**Arquitectura híbrida:**

1. **BullMQ custom jobs** para todos los reportes compliance/audit/legal (donde `canUseData()` debe filtrar datos)
2. **Metabase Pulses** para simples executive summaries (métricas agregadas read-only)

**Ejemplo BullMQ processor:**
```typescript
@Processor('report-queue')
export class ReportProcessor {
  @Process('generate-scheduled-report')
  async handle(job: Job<ReportJobData>) {
    const { reportType, institutionId, period, recipients } = job.data;
    const pdfBuffer = await this.pdfService.generate(reportType, institutionId, period);
    const excelBuffer = await this.excelService.generate(reportType, institutionId, period);
    const pdfUrl = await this.minioService.upload(`reports/...`, pdfBuffer);
    await this.emailService.send({ to: recipients, attachments: [...] });
    await this.auditService.log('REPORT_GENERATED', { reportType, institutionId, urls: [pdfUrl] });
  }
}
```

---

### 8.3 QR Code Generation

**Elección:** `qrcode` (Node.js) + `sharp`

- Pure Node.js, no native dependencies
- PNG, SVG, UTF-8 terminal
- Error correction levels L, M, Q, H
- Customización: colores brand, logo overlay via `sharp` composite

**Ejemplo:**
```typescript
const qrBuffer = await QRCode.toBuffer(data, {
  type: 'png',
  errorCorrectionLevel: 'H',
  color: { dark: '#003366', light: '#FFFFFF' },
  width: 500,
  margin: 2
});
const logo = await sharp(logoPath).resize(100, 100).toBuffer();
return sharp(qrBuffer).composite([{ input: logo, gravity: 'center' }]).png().toBuffer();
```

**Client-side preview:** `qrcode.react`

**Python:** `qrcode` + `Pillow`

---

### 8.4 Firma Digital

**MVP:** Click-accept + audit trail completo

- Checkbox "Acepto los términos" + timestamp + IP + user agent + OTP validation
- Legal basis: Ley 63-17 Art. 18 — electronic consent
- Document hash al momento de aceptación
- Generar PDF final con página de certificado de aceptación

**Producción (Phase 2):** DocuSign eSignature API (~$10-40/user/mes)

- Multi-party workflows (deudor + banco + despacho)
- Tamper-evident envelopes
- Certificate of completion automático

**Judicial (Phase 3):** Evaluar PKI local dominicano

---

### 8.5 Versioning de Documentos

**Arquitectura:** Store template + data hash (NO diff de PDF binario)

```sql
document_generations
  id UUID PK
  document_type VARCHAR
  case_id UUID FK
  template_id UUID FK
  template_version INTEGER
  template_hash VARCHAR (SHA-256 of HTML+CSS)
  data_hash VARCHAR (SHA-256 of JSON data)
  data_snapshot JSONB (complete snapshot — permite reconstrucción)
  generated_by UUID FK
  generated_at TIMESTAMP
  pdf_hash VARCHAR (SHA-256 of final PDF)
  pdf_path VARCHAR (MinIO)
  ip_address INET
  user_agent TEXT
```

**Reconstrucción:**
```typescript
async reconstructDocument(generationId: string): Promise<Buffer> {
  const gen = await prisma.documentGenerations.findUnique({ where: { id: generationId } });
  const template = await prisma.documentTemplates.findFirst({
    where: { name: gen.templateName, version: gen.templateVersion }
  });
  const currentHash = sha256(template.html_content + template.css_content);
  if (currentHash !== gen.templateHash) throw new Error('Template hash mismatch');
  return this.pdfService.generate(template, gen.dataSnapshot);
}
```

---

## 9. DÓCKER COMPOSE INTEGRACIÓN

```yaml
# Servicios core ya definidos en PLAN_MAESTRO + adiciones
services:
  # ... postgres, redis, minio, keycloak, app, worker ...

  browserless:
    image: browserless/chrome:latest
    environment:
      - MAX_CONCURRENT_SESSIONS=10
      - CONNECTION_TIMEOUT=30000
    ports:
      - "3000:3000"
    deploy:
      resources:
        limits:
          memory: 2G

  ollama:
    image: ollama/ollama
    volumes:
      - ollama-models:/root/.ollama
    # CPU-only; descomentar runtime: nvidia si GPU disponible

  chromadb:
    image: chromadb/chroma:latest
    volumes:
      - chroma-data:/chroma/chroma

  metabase:
    image: metabase/metabase:v0.49.0
    environment:
      - MB_DB_TYPE=postgres
      - MB_DB_DBNAME=metabase
      - MB_DB_PORT=5432
      - MB_DB_USER=metabase
      - MB_DB_PASS=secret
      - MB_DB_HOST=postgres
      - MB_ENCRYPTION_SECRET_KEY=${METABASE_SECRET}
    ports:
      - "3001:3000"

  loki:
    image: grafana/loki:latest
    volumes:
      - ./loki-config.yml:/etc/loki/local-config.yaml

  promtail:
    image: grafana/promtail:latest
    volumes:
      - /var/log:/var/log
      - ./promtail-config.yml:/etc/promtail/config.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3002:3000"

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686"
      - "4317:4317"
      - "4318:4318"

volumes:
  ollama-models:
  chroma-data:
```

---

## 10. ORDEN DE IMPLEMENTACIÓN SPRINT 0

1. **Secrets:** GitLeaks pre-commit hook
2. **SAST:** Semgrep en CI con custom rules para `@UseGuards()` y `canUseData()`
3. **Testing:** Jest (NestJS), Vitest + Playwright (Next.js), pytest (FastAPI)
4. **Observability:** Prometheus + Grafana + Loki en `docker-compose.observability.yml`
5. **Audit Integrity:** Implementar `audit_logs` hash chain ANTES del primer log de producción
6. **Security Scanning:** OWASP ZAP baseline scan en pipeline de deploy a staging
7. **Dependency Scanning:** Snyk `test` + `container test` en CI
8. **Backups:** pgBackRest configurado para MinIO target
9. **Comunicaciones:** Configurar nodemailer + AWS SES sandbox, Twilio SMS sandbox, Twilio WhatsApp sandbox
10. **Validación datos:** Implementar `CedulaService`, `RncService` (con `dgii-utils`), `PhoneService` (libphonenumber), `EmailService` (AbstractAPI)
11. **Documentos:** Configurar Puppeteer + Handlebars + browserless/chrome container
12. **BI:** Levantar Metabase, conectar read-only a PostgreSQL

---

*Documento sintetizado de investigación profunda en 7 áreas del stack. Las recomendaciones priorizan: compliance con Ley 172-13, mantenimiento activo, compatibilidad con arquitectura definida en PLAN_MAESTRO_IMPLEMENTACION.md, y viabilidad en VM 16GB RAM.*
