# Análisis de Brecha a Producción — Legal Recovery OS

**Fecha del análisis:** 2026-06-13  
**Repo:** `C:\Users\snova\Documents\GitHub\legal_recovery`  
**Mandato:** Evaluar propósito, requisitos, competencia, stack, código, lógica de negocio y distancia a producción.

---

## 1. Resumen Ejecutivo

**Legal Recovery OS** es una plataforma de gestión de cobro legal y recuperación de carteras castigadas orientada al mercado dominicano y, a futuro, latinoamericano. Su propuesta de valor diferenciadora es combinar **recuperación inteligente**, **gobierno legal de datos por campo (Data Passport)** y **protección contra contactos ilegales (Legal Firewall)** en un solo sistema.

**Veredicto actual:** El proyecto se encuentra en una fase **temprana de MVP funcional**. Existe un backend NestJS con CRUDs básicos, un frontend Next.js visualmente completo con tres portales, y un modelo de datos Prisma relativamente maduro. Sin embargo, **no está listo para producción**: faltan módulos críticos de negocio, la seguridad de acceso y aislamiento entre instituciones es incompleta, el stack tiene vulnerabilidades conocidas, y la infraestructura requiere endurecimiento.

**Estimación de esfuerzo restante para MVP vendible:** 10–14 semanas de un equipo full-stack disciplinado.  
**Estimación para producción bancaria robusta:** 24–32 semanas adicionales.

---

## 2. Propósito del Producto

### 2.1 Visión
Transformar la operación de cobro legal tradicional (basada en Excel, llamadas manuales y cero trazabilidad) en una **operación de recuperación neta inteligente**, donde cada decisión de contacto, acuerdo o gasto esté gobernada por reglas legales, riesgo y rentabilidad.

### 2.2 Segmentos objetivo

| Segmento | Rol |
|----------|-----|
| Oficinas legales de cobro | Usuario operativo principal |
| Fondos de inversión / compradores de NPL | Decisor económico |
| Bancos cedentes | Patrocinador / influencer |
| Cooperativas y financieras | Comprador con presupuesto limitado |
| Compliance officers / auditores | Gatekeeper técnico |

### 2.3 Problemas que resuelve

- Operación desordenada sin trazabilidad legal.
- Riesgo de multas y demandas por mal uso de datos personales (Ley 172-13 de República Dominicana).
- Contacto a terceros no autorizados.
- Uso masivo de WhatsApp sin consentimiento.
- Falta de priorización: "gastar igual en todos los casos".
- Expedientes incompletos para judicializar.
- Falta de visibilidad para el banco cedente.

### 2.4 Propuesta de valor diferenciadora

> *"No es un CRM de cobro; es una plataforma de Recuperación Neta con Legal Data Governance integrada."*

**Killer feature:** el **Legal Firewall bloquea un cobro ilegal en vivo** (WhatsApp sin opt-in, dato sin base legal, contacto a tercero, caso en disputa). Esto no lo ofrece ningún competidor documentado.

### 2.5 Competidores identificados

| Competidor | Fortaleza | Debilidad frente a LR OS |
|------------|-----------|----------------------------|
| Experian Collections | Omnicanal, scoring predictivo | Caro, inflexible, sin Legal Firewall por campo |
| FICO Debt Manager | Workflow legal robusto | Complejo, costoso, no adaptado a RD |
| CollectAI / In-debt | Voicebot avanzado | IA auto-decide sin control humano suficiente |
| Software local RD (CrediTudo) | Barato, adaptado a buró local | Sin cloud, multi-tenant ni auditoría inmutable |
| TrueAccord (US) | Portal deudor excelente | No cubre requisitos judiciales latinoamericanos |
| Excel + llamadas manuales | "Gratis" | Cero trazabilidad, máximo riesgo legal |

---

## 3. Estado del Código

### 3.1 Métricas generales

| Indicador | Valor |
|-----------|-------|
| Backend archivos TypeScript (`apps/api/src`) | ~55 |
| Frontend archivos TypeScript/TSX (`apps/web/src`) | ~88 |
| Tests unitarios backend | 2 archivos (`auth.service.spec.ts`, `users.service.spec.ts`) |
| Tests de integración/E2E | Configs referenciados pero **inexistentes** |
| Módulos backend activos | 9 |
| Módulos backend stubs vacíos/comentados | 8 |
| Páginas frontend (admin/bank/debtor) | ~46 |

### 3.2 Módulos implementados vs. pendientes

| Módulo | Estado | Madurez (1-5) | Notas |
|--------|--------|---------------|-------|
| Autenticación JWT | Funcional con bcrypt | 3 | Tokens en `localStorage`, password demo en frontend |
| Usuarios | CRUD backend | 3 | Frontend usa demo |
| Instituciones | CRUD backend | 3 | Sin protección JWT en controller |
| Carteras (Portfolios) | CRUD + reglas | 3 | Sin upload CSV/XLSX |
| Expedientes (Cases) | CRUD + creación compuesta | 3 | Detalle usa demo |
| Documentos | CRUD metadatos | 2 | Sin upload/download real a MinIO |
| Acuerdos | CRUD + aprobación | 3 | Sin validación de reglas de institución |
| Pagos | CRUD + reconciliación | 3 | Sin pasarela real, `remove` es hard delete |
| Reportes/KPIs | Endpoint funcional | 3 | Sin filtro por institución |
| Data Passport | Modelo Prisma | 1 | Sin módulo backend/frontend real |
| Legal Firewall | Solo frontend demo | 1 | No protege endpoints |
| Contactos | Modelo Prisma | 1 | Sin módulo |
| Consentimientos | Modelo Prisma | 1 | Sin módulo |
| Comunicaciones | Modelo Prisma | 1 | Sin módulo |
| Disputas | Modelo Prisma | 1 | Sin módulo |
| Scoring/AI | Modelo Prisma | 1 | Sin motor |
| Auditoría inmutable | Modelo Prisma | 1 | `AuditInterceptor` vacío |

### 3.3 Hallazgos críticos de seguridad

| ID | Hallazgo | Severidad |
|----|----------|-----------|
| SEC-001 | JWT secret con fallback hardcodeado (`process.env.JWT_SECRET \|\| 'legal-recovery-jwt-secret'`) | CRÍTICO |
| SEC-002 | `JwtAuthGuard` básico sin issuer/audience/blacklist | CRÍTICO |
| SEC-003 | **Multi-tenancy roto:** servicios no filtran por `institutionId` del JWT | CRÍTICO |
| SEC-004 | `InstitutionsController` solo tiene `RolesGuard`, no `JwtAuthGuard` | CRÍTICO |
| SEC-005 | Frontend almacena token en `localStorage` y usa password demo universal (`demo123`) | CRÍTICO |
| SEC-006 | `AuditInterceptor` es un no-op; no hay auditoría inmutable | CRÍTICO |
| SEC-007 | Legal Firewall solo existe en frontend demo; backend no valida | CRÍTICO |
| SEC-008 | `.env` versionado con secretos | CRÍTICO |
| SEC-009 | Dockerfiles usan `npm` en lugar de `pnpm`; lockfiles inconsistentes | CRÍTICO |
| SEC-010 | Migraciones Prisma ejecutadas en startup del contenedor | IMPORTANTE |
| SEC-011 | Rate limiting genérico, sin protección específica por endpoint | IMPORTANTE |
| SEC-012 | `HttpExceptionFilter` expone mensajes internos al cliente | IMPORTANTE |

### 3.4 Hallazgos de calidad y arquitectura

| ID | Hallazgo | Impacto |
|----|----------|---------|
| QA-001 | Uso extensivo de `any` en servicios (`data: any`, `where: any`) | Pérdida de type-safety |
| QA-002 | Sin transacciones Prisma en creación de caso + deudor + productos | Inconsistencia de datos |
| QA-003 | `CasesService.findById` incluye relaciones masivas innecesarias | Performance, filtrado de datos |
| QA-004 | Sin paginación en listados | Escalabilidad |
| QA-005 | Pagos usan `delete()` en lugar de soft delete | Pérdida de trazabilidad financiera |
| QA-006 | `AuditInterceptor` vacío | Incumplimiento regulatorio |
| QA-007 | Tests de integración/E2E referenciados pero inexistentes | Calidad no garantizada |
| QA-008 | Documentación (`AGENTS.md`, `CLAUDE.md`) desactualizada respecto al código | Confusión para desarrolladores |

---

## 4. Auditoría de Stack

### 4.1 Stack actual

| Capa | Tecnología | Versión |
|------|------------|---------|
| Frontend | Next.js | 15.3.2 |
| Frontend | React | 19.0.0 |
| Frontend | Tailwind CSS | 4.x |
| Backend | NestJS | 11.x |
| Backend | Prisma | 6.x |
| Backend | Node.js | 20 |
| Base de datos | PostgreSQL | 16 |
| Cache/Colas | Redis | 7 |
| Object Storage | MinIO | latest |
| Monorepo | pnpm + Turbo | 10.x / 2.5.x |

### 4.2 Vulnerabilidades conocidas (pnpm audit)

| Paquete | Versión actual | Problema | Severidad | Solución |
|---------|---------------|----------|-----------|----------|
| `next` | 15.3.2 | RCE en React flight protocol (GHSA-9qr9-h5gf-34mp) | **CRÍTICO** | Actualizar a >= 15.3.6 |
| `next` | 15.3.2 | DoS con Server Components (GHSA-mwv6-3258-q52c) | **HIGH** | Actualizar a >= 15.3.7 |
| `next` | 15.3.2 | HTTP request deserialization DoS (GHSA-h25m-26qc-wcjf) | **HIGH** | Actualizar a >= 15.3.9 |
| `xlsx` | 0.18.5 | Prototype Pollution (GHSA-4r6h-8v6p-xvw6) | **HIGH** | Considerar `xlsx` actualizado o alternativa como `exceljs` / `sheetjs` parcheado |
| `xlsx` | 0.18.5 | ReDoS (GHSA-5pgg-2g8v-p4x9) | **HIGH** | Actualizar o reemplazar |
| `tar` | <7.5.7 | Arbitrary file creation/overwrite | **HIGH** | Actualizar |

**Acción inmediata:** actualizar `next` a la última versión estable del canal 15.x y resolver `xlsx` antes de cualquier despliegue.

### 4.3 Conflictos de herramientas

- El monorepo declara `packageManager: "pnpm@10.0.0"`, pero los Dockerfiles usan `npm ci`.
- Existe `package-lock.json` en `apps/web/` (legacy de la migración desde `poc/`).
- Recomendación: migrar Dockerfiles a `pnpm install --frozen-lockfile` y eliminar `package-lock.json` de `apps/web`.

---

## 5. Brechas para Llegar a Producción

### 5.1 Funcionales de negocio

| Brecha | Impacto | Esfuerzo estimado |
|--------|---------|-------------------|
| Data Passport + Legal Firewall backend | Prerrequisito de comunicaciones, scoring y portal deudor | 3 semanas |
| Comunicaciones omnicanal (email, SMS, WhatsApp, voz) | Core del producto | 4–6 semanas |
| Upload y procesamiento de carteras (CSV/XLSX) | Entrada principal de datos | 2 semanas |
| Gestión de documentos con MinIO/S3 | Evidencia legal | 2 semanas |
| Disputas y pausas automáticas | Cumplimiento legal | 2 semanas |
| Scoring y Next Best Action | Diferenciador comercial | 4 semanas |
| Portal deudor 100% funcional | Experiencia de auto-gestión | 3 semanas |
| Auditoría inmutable | Cumplimiento regulatorio | 1–2 semanas |

### 5.2 Seguridad y compliance

| Brecha | Impacto | Esfuerzo estimado |
|--------|---------|-------------------|
| Reemplazar JWT demo por Keycloak + MFA + ABAC | Control de acceso real | 3–4 semanas |
| Implementar filtrado por `institution_id` en todo el backend | Aislamiento multi-tenant | 2 semanas |
| Mover tokens a cookies HttpOnly | Protección XSS | 1 semana |
| Implementar auditoría inmutable | Cumplimiento legal | 1–2 semanas |
| Implementar RLS en PostgreSQL | Defensa en profundidad | 1 semana |
| Encriptación en reposo y tránsito | Requisito financiero | 1–2 semanas |
| Políticas de retención y derechos ARCO | Ley 172-13 | 1 semana |
| Pentest y tests de seguridad | Antes de producción | 2 semanas |

### 5.3 Infraestructura y DevOps

| Brecha | Impacto | Esfuerzo estimado |
|--------|---------|-------------------|
| Migrar Dockerfiles a pnpm | Builds reproducibles | 2–3 días |
| Separar migraciones del startup del contenedor | Inmutabilidad | 2–3 días |
| Eliminar secretos del repo y rotarlos | Seguridad | 1 semana |
| Healthchecks y endpoints de salud | Observabilidad | 2–3 días |
| SSL/TLS y proxy reverso | Producción segura | 1 semana |
| Backups automáticos de PostgreSQL | Recuperación ante desastres | 1 semana |
| Secret management (Vault/Sealed Secrets) | Seguridad | 1–2 semanas |
| Observabilidad completa (Grafana/Prometheus/Loki) | Operación | 2 semanas |

### 5.4 Testing

| Brecha | Impacto | Esfuerzo estimado |
|--------|---------|-------------------|
| Configs de integración/E2E | Calidad | 3–5 días |
| Cobertura de tests unitarios >70% | Calidad | 2–3 semanas |
| Tests E2E con Playwright | Regresión | 2–3 semanas |
| Tests de seguridad (OWASP ZAP, Burp Suite) | Seguridad | 1–2 semanas |

---

## 6. Riesgos Principales

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Brecha de seguridad por JWT débil/multi-tenancy roto | Alta | Crítico | Keycloak + TenantGuard + RLS |
| Uso de datos personales sin base legal | Alta | Crítico | Legal Firewall backend + Data Passport |
| Incumplimiento de Ley 172-13 | Media | Crítico | Auditoría inmutable + consentimientos + derechos ARCO |
| Falta de trazabilidad financiera | Media | Alto | Soft deletes + transacciones + logs |
| Builds inconsistentes por npm/pnpm | Alta | Medio | Unificar en pnpm + eliminar package-lock.json |
| Dependencias con CVEs críticas | Alta | Alto | Actualizar next, xlsx, tar inmediatamente |
| Documentación desactualizada | Alta | Medio | Actualizar AGENTS.md y CLAUDE.md |
| Falta de tests de integración | Alta | Alto | Crear configs y tests prioritarios |

---

## 7. Roadmap Recomendado a Producción

### Fase 0 — Parar y saneamiento (Semanas 1–2)
- Actualizar dependencias críticas (`next`, `xlsx`, `tar`).
- Eliminar `.env` del control de versiones y rotar secretos.
- Migrar Dockerfiles a pnpm.
- Actualizar `AGENTS.md` y `CLAUDE.md`.

### Fase 1 — Seguridad y gobierno (Semanas 3–6)
- Implementar `TenantGuard` y filtrado por `institutionId` en todos los servicios.
- Reemplazar JWT demo por Keycloak + MFA.
- Mover tokens a cookies HttpOnly.
- Implementar `AuditInterceptor` real con persistencia en `AuditLog`.

### Fase 2 — Legal Firewall y Data Passport (Semanas 7–10)
- Implementar `DataPassportsModule` y `ContactsModule` backend.
- Mover `Legal Firewall` al backend como servicio real.
- Implementar `ConsentsModule` y validación de opt-in/opt-out.

### Fase 3 — Core operativo (Semanas 11–18)
- Upload de carteras (CSV/XLSX) y procesamiento batch.
- Gestión de documentos con MinIO/S3.
- `CommunicationsModule` con canales controlados.
- `DisputesModule` con pausas automáticas.
- `PaymentsModule` con pasarela real y soft delete.

### Fase 4 — Inteligencia y portal deudor (Semanas 19–24)
- Scoring y Next Best Action.
- Portal deudor 100% funcional.
- Copilotos básicos.

### Fase 5 — Pruebas, compliance y producción (Semanas 25–30)
- Tests de integración/E2E.
- Pentest y remediación.
- RLS, encriptación, backups, observabilidad.
- Go-live controlado con piloto.

---

## 8. Conclusiones

Legal Recovery OS tiene una **visión de producto sólida y diferenciada**. El modelo de negocio es claro, el mercado objetivo existe, y el concepto de Legal Firewall es un diferenciador potente frente a competidores globales y locales.

Sin embargo, el código actual refleja una **fase de transición entre demo y MVP funcional**:

1. **Backend:** CRUDs base funcionan, pero faltan módulos críticos y el aislamiento multi-tenant no existe.
2. **Frontend:** Visualmente rico, pero mezcla datos reales con datos demo; la seguridad del cliente es débil.
3. **Seguridad:** Hay vulnerabilidades críticas que deben resolverse antes de exponer cualquier endpoint público.
4. **Compliance:** La auditoría inmutable y el Legal Firewall son requisitos de negocio que aún no están implementados.
5. **Infraestructura:** Docker/CI necesita estandarización urgente en pnpm y separación de migraciones.
6. **Testing:** Cobertura mínima; tests de integración/E2E inexistentes.

**Recomendación estratégica:** no se debe desplegar en producción hasta completar como mínimo las Fases 0, 1 y 2 del roadmap. El esfuerzo estimado es de **10–14 semanas para un MVP vendible** y **24–32 semanas adicionales para una plataforma bancaria robusta** con IA, omnichannel y compliance completo.
