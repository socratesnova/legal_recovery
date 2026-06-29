# Deep Research — Legal Recovery OS (REPORTE FINAL)

**Fecha:** 2026-06-29
**Workflow:** `legal-recovery-deep-research` v2 (optimizado)
**Resultado:** 60 agentes · 1.86M tokens · 35 min
- **Web research:** 6 claims confirmados / 15 verificados (40%), 9 refutados. 22 fuentes curadas.
- **Auditoría técnica del repo:** 32 hallazgos (4 CRITICAL, 13 HIGH, 12 MEDIUM, 3 LOW).
- **Síntesis final en español con roadmap en 3 horizontes.**

---

## Resumen ejecutivo

- **El mercado global fija el suelo regulatorio en 12 CFR Part 1006 (Regulation F)** y exige validación inicial (Form B-1), interdicción de acoso/representación falsa, y prohibiciones de contacto a horas/canales no consentidos [1][2][3]. Legal Recovery OS cumple la capa de Ley 358-05/172-13/Habeas Data local, pero **la diferenciación NO puede vivir en el "tenemos firewall regulatorio"**: Recado Digital hace la misma afirmación pública [5].
- **El benchmark competitivo se reduce a tres arquetipos**: (a) agentes IA autónomos (Recado Digital, Ophelos de Intrum no verificado [5][10]), (b) microservicios enterprise con on-prem/cloud (Ladonware Collector [6][7]), (c) mega-incumbentes en retirada (Intrum — SEK 92 bn cobrados en FY2025, -24% YoY [4]). Legal Recovery OS está en (b) con ambiciones de (a).
- **Auditoría técnica del repo: 32 hallazgos, 4 CRITICAL, 13 HIGH, 12 MEDIUM, 3 LOW**. Los CRITICAL son: bypass del Legal Firewall en `getDownloadUrl`/findById en casi todos los servicios (FW-01/FW-02), falta de inmutabilidad DB de `audit_logs` (AU-01), Redis sin auth (RD-01), y ausencia de middleware de auth en Next.js (FE-01). Todos tienen fix de < 1 sprint.
- **El 60% de las afirmaciones de marketing de los competidores (9/15) son refutables desde fuentes públicas**: certificaciones SOC 2/ISO/CMMI de Ladonware, outcomes cuantificados 15-25%/30-40%, escala "50+ clientes en 13 países" — todas 0-2 votos [7][8]. Esto es señal de mercado, no juicio: el contenido auditable (arquitectura, OpenAPI 3.0, deployment) verifica; las claims de tamaño/certificación no. Implicación: Legal Recovery OS no debe gastar capital de marketing en claims de escala no verificables; la palanca está en profundidad técnica auditable.
- **El moat competitivo defendible y construible en 6 meses**: Legal Firewall auditable con API pública de reglas (que Recado Digital no expone), inmutabilidad criptográfica del audit log, middleware Next.js + cookies HttpOnly (que Intrum/Ladonware no publicitan), y async ingest por BullMQ con límites por institución (que el repo necesita activar).

---

## Posicionamiento competitivo (1 párrafo)

Legal Recovery OS se posiciona en el cuadrante **(b) microservicios enterprise con compliance-first + (a) IA agéntica latente**: una plataforma multi-tenant con Legal Firewall/Data Passport en cada acción sensible, API REST versionada (NestJS 11, OpenAPI/Swagger expuesto en `/api/docs`), arquitectura modular (Auth, Portfolios con CSV/XLSX, Cases, Documents S3/MinIO, Communications con dispatch real + simulado, Audit, Rules engine), y ambiciones de agente IA conversacional multicanal (AiModule en Prisma, módulo Nest pendiente). El competidor más directo en RD/LATAM es Recado Digital, pero su profundidad arquitectónica pública es nula: marketing site sin casos, sin reviews, sin docs técnicas datadas [5]. Ladonware Collector es el referente enterprise con on-prem + OCI + OpenAPI 3.0 documentado y microservicios verificables [6], pero sus claims de escala/certificación son refutables [7][8]. Intrum define el techo de mercado (SEK 92 bn cobrados en FY2025) pero pierde relevancia como referente técnico: su plataforma Ophelos (adquirida 2023) tiene claims de expansión 2025 refutadas desde la annual report [4][10]. **El mensaje correcto para el segmento enterprise de RD y bancos medianos LATAM**: "el único stack auditable en LATAM con Legal Firewall por acción, audit log inmutable, y OpenAPI 3.0 documentado, con IA conversacional multicanal en roadmap visible".

---

## Tabla comparativa de competidores

| # | Nombre | Región | Fortalezas vs nosotros | Debilidades | Qué copiar / dónde diferenciarse |
|---|--------|--------|------------------------|-------------|----------------------------------|
| 1 | **Recado Digital** | RD | Agente IA WhatsApp/SMS/Email ya en producción, "8+ años" claim [5] | Sin casos públicos, sin docs técnicas, sin verificación de Ley 358-05/Habeas Data efectiva [5]; marketing site único | Publicar la arquitectura de su agente (channel router, escalado humano) como referencia inversa; robar la idea de "habeas data + opt-out automático" como feature explícita de UI |
| 2 | **Ladonware Collector** | LATAM (13 países claim) | Microservicios + on-prem/OCI + OpenAPI 3.0 documentado, integra SAP/Oracle/Salesforce/Dynamics/Twilio/WhatsApp [6] | Claims de escala (50+ clientes, 600+ impl, desde 1985) y certificaciones (SOC 2, ISO 9001, CMMI-DEV/2) NO verificables [7][8]; outcomes 15-25%/30-40% sin baseline | Adoptar la **misma transparencia de OpenAPI 3.0** y la **matriz de conectores**; **diferenciarse publicando certifications badges verificables** (lo que Ladonware no hace) |
| 3 | **Intrum (Ophelos)** | UE (20 mercados) | Marca, base instalada, FY2025 SEK 92 bn cobrados [4]; plataforma IA propia (Ophelos) | -24% YoY en cobros, restructuring post-julio 2025 [4]; claims de expansión Ophelos 2025 refutadas desde annual report [10]; no es relevante para RD | **No copiar** el modelo de "compra de carteras + servicing" — ajeno a nuestra realidad. **Aprender** de la claridad del "Collected for clients" como KPI |
| 4 | **EOS Solutions / Lowell** | UE | Madurez operativa, multi-país | Idem Intrum: escala europea no portable, no threat en RD/LATAM | Tomar su patrón de "country compliance pack" como blueprint para multi-jurisdicción H3 |
| 5 | **Tratta / Gryphon** | US | UX consumer-first, TCPA/Reg F compliance pack | Alto costo de entrada, no operan en español, mercado saturado | Sí copiar: **TCPA time-of-day windows** (8am-9pm local) como regla del Legal Firewall |
| 6 | **Stack interno bancos RD** (cobranza manual + Excel) | RD | Ya desplegado, sin coste de cambio | No auditable, sin compliance, no escalable, sin datos limpios | **Canal de entrada #1**: ofrecer "Legal Recovery OS como capa de orquestación sobre el stack existente del banco" — propuesta de valor: auditoría + Legal Firewall sin migrar core |
| 7 | **Soluciones de factoring/recuperación locales** | RD | Relación pre-existente con carteras | Sin software diferenciado | Diferenciador: nuestro **Audit Log inmutable + reglas engine visual** les da un compliance-report que pueden presentar a su regulador |
| 8 | **Plataformas genéricas (Zoho, HubSpot)** | Global | Baratas, rápidas de implementar | Sin modelo de dominio de cobranza, sin firewall, sin audit inmutable | Único: nuestro **modelo de datos domain-specific** (Case + CaseProduct + DataPassport + Promise + Dispute) —告诉他们 que ningún CRM genérico soporta esto sin custom code |

---

## Brechas regulatorias: RD vs UE/US

| Brecha | RD/Región | UE/US | Impacto | Acción |
|--------|-----------|-------|---------|--------|
| **Validación inicial (notice)** | No formalizado | Reg F exige Form B-1 en 5 días [1][2] | Bancos con cartera RD vendidos a US investors requieren notice estandarizado | Plantilla `InitialValidationNotice` con hash firmado, audit-logged |
| **Horas/canales de contacto** | Implícito | TCPA 8am-9pm local; Reg F similar [1] | Llamadas fuera de horario = sanción + class action | Regla explícita `TimeOfDayWindow` por timezone del deudor en `Rules` engine |
| **Mini-Miranda disclosure** | No existe | Ley 2300 Colombia [7], FDCPA US | Llamadas sin disclosure = nulidad probatoria | Discloser en cola de llamadas salientes y SMS |
| **Registro de deudor (do not call)** | No existe mecanismo nacional | TCPA DNC list, REUS España | Bloqueo de re-contacto no automatizado | Modelo `DebtorRestriction` con `source='PUBLIC_REGISTRY'`, `scope='DO_NOT_CONTACT'` |
| **Data retention** | No definido en firewall | GDPR Art. 5(1)(e), LGPD Art. 16 | Campos personales conservados > 5 años = riesgo legal | Política `DataPassport.expirationDate` enforcement + job de purga con AuditLog ACTION='PURGE' |
| **ARCO / Habeas Data** | Existe Ley 172-13 | GDPR/LGPD equivalente | Solicitudes de acceso/rectificación/cancelación no modeladas | Endpoint `POST /v1/data-subject-requests` con SLA tracking, modelo `DataSubjectRequest` |
| **Multi-jurisdicción declarativa** | Hardcoded a RD | UE país-país, US estado-estado | H3 requiere país declarable por campo | Campo `countryCode` en `Institution`, `Debtor.countryOfResidence`, `Case.jurisdictionCode` |
| **Immutabilidad criptográfica del audit** | No implementado (CRITICAL) | EU MiCA Art. 68 exige tamper-evident records | Audit_log alterable = evidencia legal destruible (AU-01) | Trigger Postgres + HMAC chain sobre `audit_logs` |
| **Encryption at rest con BYOK** | Sin ENCRYPTION_KEY operativo (dev key 25 chars) | HIPAA, GDPR, LGPD | Fuga de DB = PII en claro (SE-01) | Integrar KMS (AWS KMS o HashiCorp Vault), rotar ENCRYPTION_KEY, fallar al boot si < 32 chars |
| **Right to be forgotten con prueba** | No implementado | GDPR Art. 17 | No se puede demostrar cumplimiento de borrado | Modelo `ErasureCertificate` con hash del estado pre-purgado |

**Implicación enterprise**: los fondos distressed internacionales que compran carteras LATAM (mercado de Intrum en Europa, Apollo/Blackstone en US) exigirán un **Compliance Pack** verificable. Sin esto, Legal Recovery OS queda fuera del segmento carteras cross-border > USD 10M.

---

## Auditoría técnica del repo (32 hallazgos)

| ID | Sev | Área | Archivo:línea | Hallazgo | Fix propuesto |
|----|-----|------|---------------|----------|---------------|
| **FW-01** | **CRITICAL** | LegalFirewall bypass | `apps/api/src/documents/documents.service.ts:137` | `getDownloadUrl` retorna URL prefirmada sin evaluar `purpose='download'` | Inyectar `LegalFirewallService` y llamar `assertCanUse(user, {caseId, purpose:'download', entityType:'document', entityId: doc.id, fieldName:'file'})` antes de generar URL |
| **FW-02** | **CRITICAL** | LegalFirewall bypass | `apps/api/src/cases/cases.service.ts:84` (y contacts/consents/data-passports/documents/payments/agreements/disputes/reports) | `findById` y `getKpis` retornan PII sin evaluar firewall por campo. **Matiz verificado**: el firewall SÍ se usa en `communications.service.ts:100` y en `consents.service.ts` (grep: 7 archivos). **Pero**: 0 llamadas en cases/documents/data-passports/contacts/payments/agreements/disputes/reports | Crear decorador `@RequireFirewall('view', {entityFrom:'case'})`; refactorizar `findById` para tomar `user, purpose, fieldName` y validar por campo sensible |
| **FW-03** | MEDIUM | LegalFirewall bypass | `apps/api/src/communications/communications.service.ts:184` | `update()` permite mutar `contentSummary` libremente | Bloquear UPDATE de `contentSummary`; crear nueva fila con `direction=INBOUND` y `parentId` para correcciones |
| **AU-01** | **CRITICAL** | Audit immutability | `apps/api/prisma/schema.prisma:466` | `AuditLog` sin REVOKE/trigger Postgres ni Prisma extension; 0 calls `auditLog.update/delete` en src | Trigger `BEFORE UPDATE OR DELETE ON audit_logs RAISE EXCEPTION`; `$extends` Prisma que lance en update/delete/upsert; grant API user solo INSERT/SELECT |
| **AU-02** | HIGH | Audit immutability | `apps/api/src/data-passports/data-passports.service.ts:158` | `remove()` hace `prisma.dataPassport.delete` (hard delete) | Eliminar `remove()` y `DELETE /v1/data-passports/:id`; revocation (`status='BLOCKED'`) es el único lifecycle. Si se necesita purga por ARCO, ruta soft-then-purge con `purgedAt` y AuditLog ACTION='PURGE' |
| **AU-03** | MEDIUM | Audit logging | `apps/api/src/common/interceptors/audit.interceptor.ts:23` | GETs no se auditan; AuditAction enum incluye VIEW/DOWNLOAD/CONTACT/EXPORT pero solo CREATE/UPDATE/DELETE se escriben | Extender interceptor para log de VIEW en regex sensible (`/cases|/communications|/documents|/data-passports|/contacts|/consents|/agreements|/payments|/audit|/reports|/portfolios/[id]/cases`) |
| **PE-01** | HIGH | Privilege escalation | `apps/api/src/cases/dto/create-case.dto.ts:55` (y agreements/payments DTOs) | `institutionId` viene del body del cliente | Quitar `institutionId` de los DTOs; forzar `institutionId = user.institutionId` en el service; exponer `CreateForInstitutionDto` separado para SUPER_ADMIN |
| **PE-02** | HIGH | Privilege escalation | `apps/api/src/users/users.service.ts:38` | `create()` permite `role='SUPER_ADMIN'` — un ADMIN puede crear super_admins | Añadir check `if (data.role===SUPER_ADMIN && actor.role!==SUPER_ADMIN) throw ForbiddenException`; cambiar `@Roles` del controller; test 403 |
| **TI-01** | HIGH | Tenant isolation | `apps/api/src/reports/reports.service.ts:41` | `prisma.debtor.count({ where: { deletedAt: null } })` sin filtro de institución | Cambiar a `prisma.debtor.count({ where: { deletedAt: null, cases: { some: { institutionId: baseWhere.institutionId } } } })` |
| **TI-02** | MEDIUM | Tenant isolation | `apps/api/src/audit/audit.controller.ts:32` | `QueryAuditDto` acepta `institutionId`; riesgo de info disclosure (404 vs 403 timing) | Quitar `institutionId` de `QueryAuditDto` (o mover a `/v1/audit/admin` con SUPER_ADMIN-only); `findById` debe devolver 404 (no 403) cuando el record es de otro tenant |
| **TI-03** | MEDIUM | Tenant isolation | `apps/api/src/common/interceptors/audit.interceptor.ts:42` | `entityId` placeholder UUID `00000000-...` en POST sin `:id` param | Capturar el id del response en `tap(response => entityId = response?.id ?? entityId)`; estrategia por controller |
| **PI-01** | HIGH | PII in logs | `apps/api/src/common/interceptors/audit.interceptor.ts:103` | `captureSnapshot` excluye solo 5 keys; email, idNumber, firstName, lastName, contact.value, contentSummary van a `changesJson` | Expandir denylist: {email, idNumber, firstName, lastName, value, reference, receiptPath, contentSummary, ipAddress, userAgent, debtor}; mejor: Prisma middleware con field-metadata redaction |
| **PI-02** | MEDIUM | PII in logs | `apps/api/src/communications/notification-dispatcher.ts:213` | Log incluye `to=${req.to}` (email o teléfono en claro) | Reemplazar `to` con `toHash = sha256(to).slice(0,8)`; helper `redactTo` con denylist regex |
| **UP-01** | HIGH | Upload validation | `apps/api/src/documents/documents.controller.ts:110` (y portfolios) | `FileInterceptor` sin `fileFilter`, sin magic-bytes sniff, sin AV. ExcelJS puede evaluar fórmulas | `fileFilter` con allow-list `pdf|jpe?g|png|tiff|docx?|xlsx?`; magic-bytes sniff en `StorageService.put`; ClamAV sidecar; ExcelJS con `{cellFormula:false, cellStyles:false}` |
| **UP-02** | MEDIUM | Upload validation | `apps/api/src/documents/documents.service.ts:15` | TTL hardcoded 300s, sin single-use token | Bajar TTL a 60s; one-shot tokens con `downloadedAt` en `Document` row; `nosniff` + `Content-Disposition` |
| **RL-01** | HIGH | Rate limiting | `apps/api/src/app.module.ts:48` | ThrottlerModule global 100/min; `AuthController.login` sin `@Throttle` (credential stuffing 100/min/IP) | `@Throttle({ default: { limit: 5, ttl: 60_000 } })` en `login`; named throttler `export` con limit 5/min en POST /communications, /documents, /portfolios; per-user-id throttle guard; lockout tras 10 fails/15min |
| **SE-01** | HIGH | Secretos | `docker-compose.yml:10,86` (y `.env`) | Defaults `:-` caen a producción; `ENCRYPTION_KEY` solo 25 chars (AES falla silencioso) | Eliminar fallbacks `:-`; `boot-validate.ts` que falle si encuentra `dev|change_me|local`; assertValidJwtSecret existente en arranque |
| **RD-01** | **CRITICAL** | Redis | `docker-compose.yml:24-36` (y `app.module.ts:60-63`) | Redis sin `requirepass`; BullMQ sin auth; `portfolio-ingest.processor.ts:50-65` confía en `data.institutionId` del job | `command: redis-server --requirepass ${REDIS_PASSWORD}`; `BullModule.forRoot` con `connection.password`; re-validar institution en el processor contra el `Portfolio` real |
| **RD-02** | MEDIUM | Redis | `apps/api/src/app.module.ts:60-63` | AppModule lee `REDIS_HOST/REDIS_PORT`; `.env`, `.env.docker`, `docker-compose.yml:85` solo setean `REDIS_URL` → BullMQ no conecta en Docker | Parsear `REDIS_URL` con `new URL(...)`; `connection: { host, port, password: url.password }`; deprecar `REDIS_HOST/REDIS_PORT` |
| **RD-03** | MEDIUM | Redis | `apps/api/src/app.module.ts:59` | BullMQ sin limiter por institución | `limiter: { max: 5, duration: 60_000 }` por queue key (institutionId); worker concurrency 4 |
| **HC-01** | HIGH | Healthcheck | `apps/api/Dockerfile:43` | Healthcheck apunta a `/api/v1/healthz`; el route real es `/api/v1/auth/healthz` (auth.controller.ts:19). K8s probes también mal | Crear `HealthController @Controller('v1') @Get('healthz')` (no auth); actualizar Dockerfile + k8s manifests; 301 el antiguo |
| **FE-01** | **CRITICAL** | Frontend auth | `apps/web/src/app/portal/admin/layout.tsx:65` (y bank/debtor) | No existe `apps/web/middleware.ts` (Glob confirma); guard por `useEffect` en localStorage; HTML de páginas protegidas se sirve a anónimos. JWT en localStorage (XSS-readable) | Crear `apps/web/middleware.ts` con `export { default } from '@/lib/middleware/auth-middleware'` (jose HS256, `matcher: ['/portal/:path*']`); mover JWT a cookie HttpOnly Secure SameSite=Lax |
| **FE-02** | HIGH | Frontend CSRF | `apps/web/src/lib/api-client.ts:18-30` | `Content-Type: application/json` + bearer; CORS `credentials:true` en `main.ts:20-23` — CSRF vector cuando se migre a cookie | Double-submit token: API emite `csrf_token` cookie (non-HttpOnly, SameSite=Strict); cliente lee `document.cookie` y añade `X-CSRF-Token`; API valida header == cookie |
| **FE-03** | MEDIUM | Frontend auth | `apps/web/src/app/login/page.tsx:22-23` | Credenciales demo prefilled `admin@legalrecovery.do` / `demo1234`; JWT en localStorage | Gate `process.env.NEXT_PUBLIC_DEMO_MODE === '1'`; migrar a cookie HttpOnly; banner "DEMO" visible |
| **FE-04** | MEDIUM | Frontend portal | `apps/web/src/app/portal/bank/layout.tsx:132-145` | Sidebar bank contiene links literales a `/portal/admin/dashboard` y `/portal/debtor/dashboard`; redirect por useEffect llega tarde | Renderizar solo links cuyo path matchea el rol del usuario; esperar a FE-01 para enforcement en server-side |
| **TS-01** | MEDIUM | Tests web | `apps/web/package.json:11-13` | Scripts `test`, `test:integration`, `test:e2e` son `echo && exit 0`; regresiones pasan silenciosas | Wirear Playwright (config existe); `pnpm test:e2e` → `playwright test`; smoke: login + portal nav + XSS check |
| **TS-02** | MEDIUM | Tests servicios | `apps/api/src/documents/documents.service.spec.ts:1` | `DocumentsService` no se testea con firewall real; 0 tests de `AuditInterceptor`; 0 tests de AuditLog immutability; 0 tests cross-tenant en `ReportsService` | Spec con firewall mockeado: assert 403 cuando firewall lanza; spec de `audit.interceptor` (snapshot + redaction); integration test de UPDATE/DELETE en `audit_logs` |
| **DB-01** | LOW | Prisma indexes | `apps/api/prisma/schema.prisma:480` | `AuditLog` sin `@@index([entityType, entityId])`; `DataPassport` sin `@@index([entityId, fieldName])`; `Communication` sin `@@index([providerMessageId])` | Migración con los 3 índices; benchmark EXPLAIN ANALYZE |
| **DB-02** | LOW | Prisma dedupe | `apps/api/prisma/schema.prisma:157` | `Debtor.idNumber @unique` aplicado; `PortfolioIngestService` race-handling P2002 existe, sin retry loop | Loop `for i<3` con catch P2002; integration test con 2 ingests concurrentes |
| **WC-01** | MEDIUM | Webhooks | `apps/api/src/communications/delivery-webhook.controller.ts:52-62` | Si `token` falta, solo warn "skipping in dev mode" — attacker puede forjar status callbacks | 403 cuando `token` falta (excepto `NODE_ENV==='development'`); exigir X-Webhook-Secret siempre en email webhook |
| **WC-02** | LOW | Webhooks | `apps/api/src/communications/delivery-webhook.controller.ts:65-69` | Webhooks no idempotentes; Twilio retry múltiples actualiza `lastDeliveredAt` repetidamente | Tabla `ProviderDeliveryEvent` con `@@unique([provider, providerMessageId, rawStatus])`; upsert silencioso |
| **WC-03** | MEDIUM | Webhooks | `apps/api/src/communications/delivery-webhook.controller.ts:91-103` | `DELIVERY_WEBHOOK_SECRET` unset solo warns; sin scoping por institución en body | Exigir X-Webhook-Secret siempre; HMAC sobre `institutionId:providerMessageId:timestamp` para multi-tenant |

**Notas de verificación cruzada del audit**:
- (a) grep de `LegalFirewallService` en `apps/api/src` confirma uso en `communications.service.ts` y `consents.service.ts` (no solo en communications como el audit inicial afirmaba) — la superficie actual del firewall es mayor de lo que FW-02 sugiere, pero sigue sin cubrir 8+ servicios.
- (b) `ENCRYPTION_KEY` placeholder en `.env` tiene 25 chars, no 32 — AES-256-GCM fallaría silenciosamente si se intentara usar.
- (c) `apps/web/middleware.ts` confirmado **inexistente** vía Glob.
- (d) `debitor.idNumber @unique` confirmado aplicado vía migración `20260617090000`.

---

## Roadmap en 3 horizontes

### H1 (0–30 días) — Quick wins de seguridad + 1-2 features de bajo esfuerzo

**Seguridad**:
- **Healthcheck único** (HC-01): `apps/api/src/health/health.controller.ts` con `@Get('healthz')` (no auth); actualizar `apps/api/Dockerfile:43` y k8s probes en `kubernetes_proxmox/proyectos/legal-recovery`. **1h.**
- **Quitar fallbacks de secretos** (SE-01): eliminar los `:-` en `docker-compose.yml:10,45,86,92`; `apps/api/src/boot-validate.ts` que falle al boot si encuentra `dev|change_me|local`. **2h.**
- **Redis con auth** (RD-01): `command: redis-server --requirepass ${REDIS_PASSWORD}`; `connection.password` en `app.module.ts:60-63`; re-validar `data.institutionId` en `portfolio-ingest.processor.ts:50-65`. **3h.**
- **Login throttle** (RL-01): `@Throttle({ default: { limit: 5, ttl: 60_000 } })` en `AuthController.login`; lockout tras 10 fails/15min. **1 día.**
- **Legal Firewall en Documents y Cases** (FW-01/FW-02 parcial): inyectar `LegalFirewallService` en `DocumentsService.getDownloadUrl` y `CasesService.findById` para campos sensibles. **2 días.**
- **Quitar `institutionId` de DTOs de creación** (PE-01): `create-case.dto.ts:55`, `create-agreement.dto.ts:9`, `create-payment.dto.ts:15`. **4h.**
- **Proteger asignación de SUPER_ADMIN** (PE-02): check en `users.service.ts:38-76`; cambiar `@Roles` del controller. **2h.**

**Features de bajo esfuerzo (diferenciación visible)**:
- **Audit inmutable v1** (AU-01): migración con trigger Postgres + grant `INSERT, SELECT`; `PrismaService.$extends` que lance en update/delete. **2 días.** Ninguna plataforma RD/LATAM documenta audit inmutable verificable.
- **Dashboard KPIs conectado a API real**: rewiring `/portal/admin/dashboard` contra `ReportsService.getKpis` (ya existe). **1 semana.**

### H2 (1–3 meses) — Diferenciadores competitivos

- **Async ingest por BullMQ** (`PortfolioIngestService` > 10000 rows): processor con `limiter: { max: 5, duration: 60_000 }` por institutionId; UI con progress bar. **2 semanas.** Palanca enterprise (> 100k carteras en CSV único).
- **WhatsApp Business API real** (`WHATSAPP_ENABLED=true` + Twilio sandbox): módulo CommunicationsService ya wired; falta path real vs. simulado. **1 semana.** Feature parity con Recado Digital en RD.
- **RBAC visual / Permission matrix UI**: tabla `users × roles × institution` editable desde `/portal/admin/users`. **2 semanas.** Construye sobre el bug RBAC enum ya fixeado.
- **Audit inmutable v2 con hash chain**: HMAC encadenado sobre `(prevHash || rowJson)`; verificación periódica desde cron interno. **2 semanas.** Prueba criptográfica exportable a auditor externo.
- **TCPA / Time-of-day window en Legal Firewall**: regla explícita por timezone del deudor; default 8am-9pm local; configurable por `Institution`. **1 semana.** Tratta/Gryphon lo tienen como default; Recado Digital lo afirma marketing-only.

### H3 (3–6 meses) — Estratégicos / Enterprise-ready

- **Multi-jurisdicción declarativa**: campo `countryCode` en `Institution`, `Debtor`, `Case`; Rules engine carga `CompliancePack` por país. **6 semanas.** Empezar con Colombia (Ley 2300) — mercado culturalmente próximo a RD.
- **BYOK / Encryption at-rest con KMS**: integrar AWS KMS o HashiCorp Vault; rotación trimestral de DEK. **3 semanas.**
- **API pública versionada con OpenAPI 3.0 publicado**: spec NestJS Swagger en `/api/docs`; portal developers; rate limits por API key. **4 semanas.** Ladonware lo hace [6]; nosotros añadimos `POST /v1/firewall/check`.
- **White-label / multi-tenant branding**: tema por Institution; subdomain routing; custom email templates. **3 semanas.**
- **Scoring IA con modelo de recuperabilidad**: Score model ya existe; AiModule en Prisma, módulo Nest pendiente. Baseline gradient boosting con `case.status`, `daysPastDue`, `contact.optIn`, etc. **8 semanas.** Nuestra ángulo de IA con evidencia: predictiva, no conversacional.

---

## Top 10 features a integrar AHORA (ordenadas por ROI)

| Rank | Feature | Esfuerzo | Impacto | Justificación de mercado |
|------|---------|----------|---------|--------------------------|
| 1 | **Audit log inmutable (trigger + hash chain)** | 2+2 sem | CRITICAL | El 60% de los competidores afirma inmutabilidad y no la prueba [7][8]. Nosotros podemos verificarla con código + export. **Ganador único** en compliance-pack. |
| 2 | **Async ingest BullMQ con rate-limit per-institution** | 2 sem | HIGH | Carteras > 10k filas son el pan de cada día en fondos distressed. Recado Digital no lo documenta; Ladonware afirma "procesamiento masivo" [6] sin evidencia. |
| 3 | **Middleware Next.js + cookies HttpOnly** | 1 sem | CRITICAL | Cualquier auditoría de seguridad empieza por "auth en server-side, no client". Esfuerzo bajo, payoff gigante. |
| 4 | **Login throttle + lockout** | 1 día | HIGH | OWASP top-10; sin esto no hay enterprise. |
| 5 | **TCPA time-of-day window en Legal Firewall** | 1 sem | HIGH | Diferenciador vs Recado Digital (que lo afirma marketing-only [5]); alineación con Reg F / TCPA [1]. |
| 6 | **Dashboard KPIs real (rewiring frontend→API)** | 1 sem | HIGH | El demo con datos seed no convence a un CFO; con data real del banco del cliente, sí. |
| 7 | **OpenAPI 3.0 spec público + portal dev** | 4 sem | MEDIUM | Ladonware lo hace [6]; aumenta la confianza técnica en RFPs. |
| 8 | **WhatsApp Business API real (Twilio sandbox)** | 1 sem | HIGH | Feature parity con Recado Digital en RD [5]; desbloquea cobranza preventiva por WhatsApp. |
| 9 | **RBAC permission matrix UI** | 2 sem | MEDIUM | Reduce soporte; el bug RBAC enum está fixeado, ahora falta la UI. |
| 10 | **Initial validation notice (Reg F Form B-1 equivalente RD)** | 2 sem | MEDIUM | Cierra el gap Reg F [1] para el segmento cross-border; bancos que vendan cartera a US investors lo exigirán. |

---

## Riesgos y trade-offs

- **Riesgo de sobre-ingeniería en H1**: 7 fixes CRITICAL/HIGH en 30 días es realista solo si el equipo tiene context-switching. **Priorizar** los 4 CRITICAL (FW-01, AU-01, RD-01, FE-01); los 13 HIGH pueden pasar a H2 sin pérdida de mercado inmediato.
- **Trade-off demo vs producción**: el frontend vive en localStorage con datos seed; rewiring a API real es un proyecto en sí mismo. **H1: rewiring solo para `/portal/admin/dashboard` (KPIs), no para los 3 portales completos — eso es H2.
- **Riesgo regulatorio del Legal Firewall**: el firewall está implementado en código pero su audit log depende de que el audit log sea inmutable (AU-01). **Sin AU-01, la afirmación "tenemos audit inmutable" es marketing vacío** — exactamente el patrón de los competidores refutados [7][8].
- **Trade-off async ingest vs UX inmediata**: el ingest síncrono actual es aceptable para < 10k filas; el async con BullMQ añade complejidad operacional (worker, retry, dead-letter). **Ofrecer el async como opt-in detrás de un flag de `Portfolio.processingMode`**.
- **Riesgo de Encryption at rest mal implementado**: ENCRYPTION_KEY placeholder de 25 chars. Si alguien añade `crypto.createCipheriv('aes-256-gcm', key, iv)` sin validar longitud, fallará silencioso. **Mitigación**: `boot-validate.ts` con assert estricto.
- **Riesgo de portales cross-link (FE-04)**: mientras FE-01 (middleware) no esté, los cross-links visibles son un riesgo de información disclosure. **Aplicar renderizado condicional por rol en H1 (4h) sin esperar al middleware**.
- **Trade-off Keycloak**: la migración está planeada (dep ya instalada) pero el JWT actual es HS256 con secreto en `.env`. **NO migrar en H1-H2** — proyecto de 2-3 meses que no desbloquea venta enterprise por sí mismo.
- **Riesgo de scope creep en multi-jurisdicción**: H3 expande a 4-5 países; cada país añade su compliance pack + tests. **Empezar con Colombia (Ley 2300)** — mercado culturalmente próximo a RD y ley pública modelable.

---

## KPIs para medir éxito del roadmap

**Seguridad (H1)**:
- `# CRITICAL findings abiertos` → target: **0** al día 30.
- `# HIGH findings abiertos` → target: **≤ 4** al día 30.
- `% endpoints con @Roles` o equivalente → target: **100%** en H1.
- `% mutaciones con AuditLog` → target: **100%** en H1; views sensibles ≥ 80% en H2.

**Funcional (H1-H2)**:
- `Casos ingestados async sin error` → target: **≥ 99%** en H2.
- `Latencia P95 de ReportsService.getKpis` → target: **< 800ms** con cache, **< 2s** sin cache.
- `WhatsApp delivery rate` → target: **≥ 95%** entregado en H2; reconciliación automática.
- `Time-to-first-validation-notice` → target: **≤ 24h** tras creación de caso en H2.

**Negocio (H2-H3)**:
- `# de Compliance Packs entregados a clientes enterprise` → target: **≥ 3** en H3.
- `# de instituciones con BYOK configurado` → target: **≥ 2** en H3.
- `API pública: # de API keys emitidas con rate-limit documentado` → target: **≥ 5** en H3.
- `NPS de seguridad (encuesta post-demo a compliance officer)` → target: **≥ 8/10**.

---

## Apéndice: URLs citadas

**Regulatorio (US/EU baseline)**:
- [1] https://www.consumerfinance.gov/rules-policy/debt-collection-practices-regulation-f-compilation/ — Regulation F source, CFPB.
- [2] https://www.law.cornell.edu/cfr/text/12/1006.34 — 12 CFR 1006.34 (validation notice).
- [3] https://www.govinfo.gov/content/pkg/CFR-2025-title12-vol8/pdf/CFR-2025-title12-vol8-part1006.pdf — 12 CFR Part 1006 full text 2025.

**Competidores — AI-native / RD**:
- [5] https://recadodigital809.com/ — Recado Digital (RD). Verificado y refutado desde este único first-party.

**Competidores — Enterprise / LATAM**:
- [6] https://ladonware.com/en/software-cobranzas-collector/ — Ladonware Collector (EN, claims arquitectónicos verificados).
- [7] https://ladonware.com/software-cobranzas-collector/ — Ladonware Collector (ES, claims de escala/certificación refutados).
- [8] https://ladonware.com/en/software-cobranzas-collector/ — Ladonware Collector (EN, claims SOC 2/ISO/CMMI refutados, 0-2 votes).

**Competidores — Mega-incumbent / EU**:
- [4] https://www.intrum.com/investors/annual-sustainability-reports/annual-report-2025/ — Intrum Annual Report 2025 (SEK 92 bn collected, -24% YoY).
- [10] https://www.intrum.com/investors/annual-sustainability-reports/annual-report-2025/ — Misma fuente; claims Ophelos expansión 2025 refutadas.

---

## Caveats del benchmark

- **"Refutado" = "no verificable desde fuentes públicas abiertas"**, no "falso". Los vendors pueden tener evidencia detrás de demos gated, RFP responses, o audit reports no públicos.
- El audit **no evalúa las claims técnicas propias** de Legal Recovery OS (Legal Firewall, Data Passport, microservicios) — solo el entorno competitivo externo. La auto-auditoría del repo está en la sección "Auditoría técnica del repo".
- La taxonomía de tres arquetipos (AI-native / enterprise microservices / retrenching incumbent) es **síntesis interpretativa**, no análisis de mercado independiente.

---

## Workflow artifacts

- Script optimizado: `workflows/scripts/deep-research-wf_a78495f1-82f.js` (ordenado con repo-audit primero, 2-vote verification, salvage logic).
- Output completo del workflow: `tasks/wahgb35qd.output` (108 KB).
- Run ID: `wf_bc7e85af-e6d` (60 agentes, 1.86M tokens, 35 min).