# Análisis Estratégico, Estudio de Mercado y Plan de Demo — Legal Recovery OS

> **Fecha:** Junio 2026  
> **Rol:** Expert Product Manager, Tech Lead y Business Analyst  
> **Proyecto:** Legal Recovery OS + Legal Recovery Data Brain 360  
> **Mercado objetivo:** República Dominicana / Latinoamérica  

---

## FASE 1: Revisión y Síntesis del Proyecto

### 1.1 Propósito y Visión

**Legal Recovery OS** es una plataforma modular, segura y auditable para **oficinas legales** que gestionan **carteras castigadas bancarias** provenientes de bancos, fondos de inversión, financieras, cooperativas y entidades cedentes.

**El problema que resuelve:**
- Las oficinas legales tradicionales operan con hojas de Excel, llamadas manuales y cero trazabilidad de datos.
- Los bancos cedentes no tienen visibilidad de la recuperación real ni control de cumplimiento legal.
- El riesgo legal es alto: uso indebido de datos personales (Ley 172-13), contacto a terceros no autorizados, WhatsApp masivo sin consentimiento, y falta de evidencia documental para judicializar.
- Se gasta igual en todos los casos sin priorización ni scoring de recuperabilidad.

**El valor real:**
- **Recuperación Neta:** Diagnostica, prioriza, negocia y concilia con menor costo operativo por contacto.
- **Legal Data Governance:** Cada dato lleva un "pasaporte legal" que bloquea su uso si no cumple fuente, base legal, permiso y restricción.
- **Trazabilidad completa:** Desde la carga de la cartera hasta el pago, el acuerdo o la judicialización.
- **Protección anti-demanda:** Bloquea automáticamente acciones de cobro ilegales (terceros, WhatsApp sin opt-in, datos sin permiso, casos en disputa).

### 1.2 Estado Actual y Arquitectura

**Estado:** Pre-código. Solo existen documentos de alcance, plan maestro y 23 prompts de desarrollo. No hay repositorio de código, build system, ni CI/CD aún.

**Infraestructura ready:** VM en Proxmox (10.166.166.60) con Docker, PostgreSQL 16, Redis y MinIO.

**Stack resuelto (per PLAN_MAESTRO_IMPLEMENTACION.md):**
- Frontend: Next.js 15 + React 19 + Tailwind + shadcn/ui
- Backend: **NestJS** (TypeScript) — decidido, no FastAPI
- ORM: Prisma
- Auth: Keycloak (self-hosted) o Supabase Auth
- Queues: Redis + BullMQ
- Files: MinIO
- AI microservice: FastAPI + LangChain + ChromaDB (único servicio Python)
- BI: Metabase
- DB: PostgreSQL 16 (UUID PKs, soft deletes, RLS)

**Huecos críticos / dependencias:**
1. **Data Passport (Sprint 3) bloquea todo lo demás.** Sin el Legal Firewall, no se pueden hacer scores, comunicaciones ni AI.
2. **Auth + RBAC/ABAC (Sprint 0-1)** es prerequisito absoluto. Multi-tenant con `institution_id` + RLS requiere que todo esté listo antes de cargar datos reales.
3. **AI microservice** depende de Data Passport — la IA no puede entrenar ni inferir con datos bloqueados.
4. **Portal deudor** depende de Data Passport + acuerdos + pagos.
5. **Omnichannel** depende de Data Passport + opt-in + consentimientos.

### 1.3 Mapeo de Requisitos Críticos (Los 8 Pilares)

Estas reglas aparecen en **cada prompt** y son inquebrantables:

| # | Pilar | Implicación técnica |
|---|-------|---------------------|
| 1 | **Procedencia de datos** | Cada campo requiere: fuente, fecha, base legal, permisos, restricciones, confiabilidad, auditoría |
| 2 | **Bloqueo sin fuente legal** | El sistema debe impedir visualización, contacto o procesamiento de datos sin base contractual/legal |
| 3 | **No contacto a terceros** | Relacionados (cónyuges, familiares, empleadores) nunca son contactables sin consentimiento explícito |
| 4 | **WhatsApp restringido** | Solo con opt-in + mensajes neutrales + verificación de política. Nunca cobro directo masivo |
| 5 | **Integraciones externas autorizadas** | TSS, JCE, burós solo vía convenio/consentimiento/orden. Scraping prohibido |
| 6 | **Human-in-the-loop** | Decisiones legales sensibles (acuerdos fuera de política, judicialización) requieren aprobación humana |
| 7 | **Logs inmutables** | Todo create/update/delete/download/contact queda registrado con usuario, IP, timestamp, entidad y cambios |
| 8 | **RBAC/ABAC** | Acceso por rol + institución + cartera + sensibilidad del dato. Un banco no ve cartera de otro |

---

## FASE 2: Estudio de Mercado y Propuesta de Valor

### 2.1 Target Audience (Público Objetivo)

| Segmento | Perfil | Rol en la compra |
|----------|--------|-----------------|
| **Oficinas legales de cobro** | 5-50 abogados, gestionan carteras de 1-5 bancos | Usuario operativo + recomendador |
| **Fondos de inversión / NPL buyers** | Compran cartera castigada a descuento. Necesitan ROI transparente | **Comprador decisor** |
| **Bancos cedentes** | Áreas de recuperaciones / castigos. Quieren reportes y control | Patrocinador / influencer |
| **Cooperativas y financieras** | Menor volumen pero alto riesgo reputacional. Necesitan compliance | Comprador con presupuesto limitado |
| **Compliance officers** | Revisan que la oficina legal no genere riesgo legal al banco | Influencer técnico / gatekeeper |

### 2.2 Pain Points Mortales (sin Legal Recovery OS)

| Pain Point | Impacto | Consecuencia legal/negocio |
|-----------|---------|---------------------------|
| **Riesgo legal por mal uso de datos** | Alto | Multas por Ley 172-13 (hasta RD$ 5M+), demandas por daño moral, pérdida de contratos bancarios |
| **Cero trazabilidad de contactos** | Alto | No se puede probar que un gestor no contactó a un tercero. Demanda = indemnización + daño reputacional |
| **Baja recuperación por falta de priorización** | Medio/Alto | Se gasta RD$ 500 en SMS/caso que nunca pagará, mientras casos recuperables se abandonan |
| **WhatsApp masivo sin control** | Alto | Violación de política de WhatsApp Business + Ley 172-13 = bloqueo de número + sanción |
| **Falta de evidencia para judicializar** | Medio | Expedientes incompletos no pasan a abogado. Tiempo perdido, costo operativo alto |
| **Banco sin visibilidad** | Medio | El banco no sabe si la oficina legal está recuperando o no. Renueva contrato a ciegas |
| **Disputas no manejadas** | Alto | Caso en disputa que sigue cobrando = demanda segura por cobro indebido |

### 2.3 Propuesta de Valor Única (UVP)

**"Legal Recovery OS no es un CRM de cobro. Es una plataforma de Recuperación Neta con Legal Data Governance integrada."**

| ¿Qué hacen los demás? | ¿Qué hace Legal Recovery OS? |
|-----------------------|------------------------------|
| Experian/FICO: SaaS caro, compliance global genérico, no adaptado a oficinas legales locales | **Diseñado para oficinas legales RD/Latam** con reglas por institución, descuentos locales, y compliance con Ley 172-13 |
| CRM tradicional (HubSpot/Salesforce): Gestión de contactos genérica, sin control legal de datos | **Legal Firewall:** Cada dato tiene pasaporte. Si no cumple, el sistema lo bloquea automáticamente |
| Software local (CrediTudo): Sin cloud, sin multi-tenant, sin gobierno de datos | **Cloud-native + multi-institución** con RLS, auditoría inmutable y portal deudor seguro |
| AI-first (CollectAI): Automatización alta, pierde trazabilidad legal, poco control humano | **AI recomienda, humano decide.** Scores explicables, documentos revisados por abogado antes de judicializar |
| TrueAccord (US): Portal deudor excelente, no cubre requisitos judiciales latinoamericanos | **Portal deudor + expediente legal + judicialización selectiva** con matriz documental completa |

**Killer feature:** El momento "WOW" de la demo es cuando el **Legal Firewall bloquea un cobro ilegal en vivo** (WhatsApp sin opt-in, dato de JCE sin permiso, contacto a tercero). Eso no lo hace ningún competidor.

### 2.4 Competencia y Diferenciador

| Competidor | Modelo | Fortaleza | Debilidad vs LR OS |
|-----------|--------|-----------|-------------------|
| **Experian Collections** | SaaS Enterprise | Omnicanal, scoring predictivo, compliance global | Caro, inflexible para oficinas legales locales, no tiene Legal Firewall por campo |
| **FICO Debt Manager** | On-prem/SaaS | Workflow legal robusto, reglas avanzadas | Complejo, larga implementación, alto costo, no adaptado a RD |
| **CollectAI / In-debt** | AI-first SaaS | Voicebot avanzado, automatización alta | **Pierde trazabilidad legal, poco control humano.** La IA auto-decide |
| **CrediTudo / software local RD** | Local on-prem | Barato, adaptado a buró local | Sin cloud, sin multi-tenant, sin gobierno de datos, sin auditoría |
| **TrueAccord (US)** | Digital-first | Portal deudor excelente, self-service | No cubre requisitos judiciales latinoamericanos, sin Data Passport |
| **Excel + llamadas manuales** | "Software casero" | "Gratis" | Cero trazabilidad, máximo riesgo legal, baja recuperación |

**Diferenciador clave:** Legal Recovery OS es la única plataforma que combina **recuperación inteligente** (scores, Next Best Action, AI) con **gobierno legal de datos por campo** (Data Passport) y **protección anti-demanda** (Legal Firewall). No es cobro más rápido: es cobro más inteligente, más seguro y más rentable.

---

## FASE 3: Planificación del Sistema y Componentes

### 3.1 Roadmap Ejecutivo de Desarrollo

Organizamos los 22 módulos/prompts en 4 fases estratégicas:

#### FASE MVP — Sistema Vendible y Operable (Sprints 0-6, semanas 1-14)
**Meta:** Demo funcional para bancos. 10 criterios de aceptación pasan.

| Sprint | Módulos / Prompts | Entregables clave |
|--------|-------------------|-------------------|
| **Sprint 0** | `02_arquitectura`, `03_modelo_datos`, `20_devops` | Repo monorepo, Docker Compose, Prisma schema, Keycloak realm, CI/CD básico |
| **Sprint 1** | `01_maestro_producto`, `04_backend_api`, `19_seguridad` | Auth MFA, RBAC/ABAC, usuarios, roles, instituciones base |
| **Sprint 2** | `06_bank_portfolio` | CRUD instituciones, contratos, reglas, carga CSV/Excel, deduplicación |
| **Sprint 3** | `09_expediente_legal`, `07_legal_data_governance`, `08_data_passport` | Expedientes, documentos con hash, **Data Passport UI**, **Legal Firewall `canUseData()`** |
| **Sprint 4** | `10_ai_scoring` | Scores documental, recuperabilidad, contactabilidad, riesgo, Next Best Action |
| **Sprint 5** | `11_portal_deudor`, `12_negociador_ia` | Portal deudor (validación progresiva), propuesta de acuerdo, negociador IA por reglas |
| **Sprint 6** | `17_pagos_conciliacion`, `18_dashboards`, `21_testing_qa` | Pagos, conciliación, reportes PDF/Excel, dashboards, tests E2E |

#### FASE 2 — Automatización de Recuperación (Sprints 7-10, semanas 15-22)
**Meta:** Menos costo, más conversión. AI operativa.

| Sprint | Módulos | Entregables |
|--------|---------|-------------|
| Sprint 7 | `13_omnichannel_compliance` | Email, SMS, carta QR, voicebot, WhatsApp restringido con Legal Firewall |
| Sprint 8 | `14_voicebot_chatbot` | Voicebot neutral, chatbot, escalamiento humano |
| Sprint 9 | `15_copiloto_gestor`, `16_copiloto_juridico` | Copiloto para gestores (guiones, riesgos, botones rápidos) + Copiloto jurídico (documentos, checklist) |
| Sprint 10 | `12_negociador_ia` (mejora), AI microservice | RAG privado, modelos locales (Llama 3/Mistral), anonimización obligatoria |

#### FASE 3 — Data Brain y Gobierno Avanzado (Sprints 11-14, semanas 23-30)
**Meta:** Sistema bancarizable y auditable.

| Sprint | Módulos | Entregables |
|--------|---------|-------------|
| Sprint 11 | Full Data Passport v2 | Clean room de datos, validaciones autorizadas (TSS, JCE, burós con convenio) |
| Sprint 12 | Predictive models | Modelos predictivos de recuperación, churn, valoración de cartera |
| Sprint 13 | Marketplace / Judicialización | Judicialización selectiva, marketplace de carteras, valuación |
| Sprint 14 | Advanced voicebot | Voicebot avanzado con Whisper local, NLP en español dominicano |

#### FASE 4 — Autopilot Estratégico (Sprints 15+, semanas 31+)
**Meta:** Nuevo modelo de negocio.

- Portfolio valuation engine
- Selective judicialization with ROI threshold
- Marketplace de cartera (subastas entre fondos)
- Advanced analytics y forecasting

### 3.2 Dependencias Críticas

```
[Auth + RBAC/ABAC] → [Instituciones] → [Carteras] → [Expedientes]
                                                    ↓
[Data Passport + Legal Firewall] ← [Documentos] ← [Scores]
         ↓
[Portal Deudor] ← [Acuerdos] ← [Pagos] ← [Conciliación]
         ↓
[Omnichannel] ← [AI Scoring] ← [Voicebot/Chatbot]
         ↓
[Copilotos] ← [Dashboards] ← [Reportes]
```

**Regla de oro:** Ningún módulo de Fase 2 puede construirse antes de que Data Passport y Legal Firewall estén operativos al 100%.

---

## FASE 4: Diseño del POC / MVP Demo (30 Minutos)

> **Audiencia:** Directores de oficinas legales, fondos de cartera, compliance officers de bancos  
> **Duración:** 30 minutos exactos  
> **Meta:** Cerrar reunión de follow-up con prueba piloto de 1 cartera real  

### 4.1 Estructura Minuto a Minuto

#### Min 0-5: El Problema y la Solución (Introducción)
**Objetivo:** Crear empatía. El cliente debe pensar "eso me pasa a mí".

**Pantalla:** Slide de título + 3 bullets del dolor actual.

**Script del vendedor:**
> *"Director, le voy a ser honesto: en mi experiencia visitando oficinas legales en Santo Domingo, Santiago y Punta Cana, el 80% opera con Excel, llamadas manuales y WhatsApp masivo sin control. Y eso es una bomba de tiempo legal. La Ley 172-13 castiga el mal uso de datos personales. Un solo contacto a un tercero o un WhatsApp sin opt-in puede costarle al banco cedente una demanda millonaria. Hoy le traigo una plataforma que no solo cobra mejor: lo protege de demandas."*

**Acción:** Login con MFA a Legal Recovery OS (2 segundos, QR + TOTP).

---

#### Min 5-15: Flujos Críticos que Enamoran (Core Demo)

**Objetivo:** Mostrar los 3 "WOW moments" del sistema.

##### Flujo 1 (Min 5-8): Carga y Cumplimiento — "El Legal Firewall bloquea un cobro ilegal"

**Pantalla:** Portal Admin → Carga de Cartera → Expediente → Intentar enviar WhatsApp.

**Seed data precargado:**
- Institución: "Banco Popular Dominicano" (ficticio para demo)
- Cartera: "Tarjetas Castigadas Q2 2026" — 3 casos
- Caso A: Juan Pérez, teléfono validado, opt-in WhatsApp = ✅
- Caso B: María García, teléfono de JCE (sin permiso de contacto), opt-in WhatsApp = ❌
- Caso C: Pedro Martínez, teléfono del cónyuge (tercero no autorizado), opt-in = ❌

**Demo paso a paso:**
1. Vendedor entra al expediente de María García.
2. Click en "Enviar WhatsApp".
3. **Legal Firewall intercepta:** 🔴 BLOQUEADO — "Este número proviene de JCE sin permiso de contacto explícito. La base legal es 'consulta administrativa', no 'contacto comercial'. Acción bloqueada. Audit log registrado."
4. Vendedor entra al expediente de Pedro Martínez.
5. Click en "Enviar WhatsApp".
6. **Legal Firewall intercepta:** 🔴 BLOQUEADO — "Este contacto pertenece a un tercero no autorizado (cónyuge). Contacto prohibido por política institucional y Ley 172-13. Acción bloqueada."
7. Vendedor entra al expediente de Juan Pérez.
8. Click en "Enviar WhatsApp".
9. ✅ PERMITIDO — Se abre el diálogo con plantilla pre-aprobada y neutral.

**Frase de cierre del vendedor:**
> *"Imagínese que un gestor junior, a las 5pm del viernes, intenta enviar un WhatsApp a un número de JCE. En cualquier otro sistema, ese mensaje sale. En Legal Recovery OS, el sistema lo bloquea, registra el intento, y el supervisor lo ve el lunes. Eso es un juicio evitado."*

---

##### Flujo 2 (Min 8-12): Expediente y Recuperación — "La Ficha Integral del Deudor"

**Pantalla:** Ficha de expediente + Scores + Next Best Action.

**Seed data precargado:**
- Caso: Juan Pérez — Banco Popular, Tarjeta Castigada, Saldo RD$ 125,000
- Documentos: Contrato ✅, Cesión ✅, Estado de cuenta ✅, Pagaré ❌ (falta)
- Contactos: Teléfono principal (validado, opt-in) ✅, Email (sin validar) ⚠️
- Data Passport: Todos los datos con fuente, fecha, base legal visible.

**Demo paso a paso:**
1. Vendedor muestra la **ficha integral**: deudor, institución, cartera, producto, saldo, estado.
2. Click en "Timeline" — historial cronológico de toda acción sobre el caso.
3. Click en "Documentos" — contrato subido con hash SHA-256, fecha, usuario. Pagaré marcado como "faltante" en rojo.
4. Click en "Scores":
   - Score Documental: 🟡 75% (falta pagaré)
   - Score Recuperabilidad: 🟢 85% (monto medio, antigüedad < 2 años)
   - Score Contactabilidad: 🟢 90% (teléfono validado, opt-in)
   - Score Riesgo: 🟡 40% (una disputa previa, no recurrente)
   - **Next Best Action:** "Ofrecer acuerdo de 3 cuotas con 20% descuento. Canal: portal o llamada. Evitar SMS."
5. Vendedor click en "Next Best Action" → se abre pantalla de propuesta de acuerdo con los montos pre-calculados.

**Frase de cierre del vendedor:**
> *"Esto no es una lista de Excel. Es un cerebro que le dice a su gestor: 'Este caso tiene 85% de recuperar. Llámalo con esta oferta, no le mandes SMS, y ten cuidado porque antes abrió una disputa'. Su gestor no adivina: su gestor sigue una estrategia."*

---

##### Flujo 3 (Min 12-15): Negociación y Pago — "Acuerdo Generado Automáticamente"

**Pantalla:** Propuesta de acuerdo → Aprobación por reglas → Pago → Conciliación.

**Seed data precargado:**
- Regla del Banco Popular: Descuento automático hasta 30% en 3 cuotas. >30% requiere supervisor.
- Propuesta: RD$ 125,000 → Acuerdo 3 cuotas de RD$ 29,167 (30% descuento total = RD$ 87,500)
- El acuerdo entra en regla → aprobación automática ✅

**Demo paso a paso:**
1. Vendedor muestra la propuesta pre-llenada desde Next Best Action.
2. Sistema valida contra reglas del banco: "Descuento 30% en 3 cuotas = dentro de política ✅"
3. Click "Generar acuerdo" → PDF con términos, montos, fechas, firma digital placeholder.
4. Simular que el deudor acepta en el portal (vendedor cambia a tab del portal deudor).
5. Simular pago: deudor sube comprobante de transferencia.
6. Volver al admin: Pago registrado, OCR lee el comprobante, conciliación automática (match por referencia).
7. Balance actualizado: RD$ 0. Sistema genera "Paz y Salvo" automáticamente.
8. **Campaña detenida:** El sistema automáticamente pausa todas las comunicaciones de este caso.

**Frase de cierre del vendedor:**
> *"Desde que el deudor propone hasta que recibe su paz y salvo: cero intervención manual innecesaria. El sistema concilia, genera el documento y detiene la campaña. Su gestor ya está llamando al siguiente caso que el score dice que va a pagar."*

---

#### Min 15-25: Portal del Deudor y Cumplimiento Omnicanal

**Objetivo:** Mostrar que el deudor tiene dignidad y autogestión, y que el despacho está protegido de demandas por acoso.

**Pantalla:** Portal del Deudor (vista externa) + Omnichannel Admin.

**Demo paso a paso:**

**Parte A — Portal del Deudor (Min 15-20):**
1. Vendedor abre navegador incógnito → URL del portal deudor.
2. **Validación progresiva:**
   - Paso 1: Ingresar cédula (001-1234567-8)
   - Paso 2: Pregunta de seguridad (últimos 4 dígitos de tarjeta)
   - Paso 3: OTP por SMS al número validado
3. Dashboard del deudor: "Hola Juan, su saldo con Banco Popular es RD$ 125,000. Tiene una propuesta de acuerdo vigente."
4. Deudor ve:
   - Resumen del caso (solo datos mínimos)
   - Propuesta de acuerdo pre-aprobada
   - Botón "Pagar ahora" (redirige a pasarela)
   - Botón "Subir comprobante"
   - Botón "Abrir disputa" (formulario con motivo)
   - Botón "Gestionar preferencias" (opt-out de canales)
5. Vendedor muestra que el deudor puede descargar su recibo y paz y salvo si ya pagó.

**Frase del vendedor:**
> *"Su deudor no recibe 15 llamadas al día de números desconocidos. Su deudor entra a un portal seguro, valida su identidad, ve su situación, y decide: pagar, negociar, o abrir una disputa si cree que no le debe. Eso es trato digno. Y eso es protección legal para usted."*

**Parte B — Omnichannel y Compliance (Min 20-25):**
1. Vendedor vuelve al Admin → módulo "Comunicaciones".
2. Dashboard de campañas activas: 50 emails enviados, 20 SMS, 0 WhatsApp (restringido).
3. Click en "Auditoría de Comunicaciones" → log de cada mensaje:
   - "Email a juan.perez@email.com — permitido (opt-in email validado) — enviado 10:30am — entregado ✅"
   - "WhatsApp a María García — BLOQUEADO por Legal Firewall (dato JCE sin permiso) — 10:32am"
   - "SMS a Pedro Martínez — BLOQUEADO (caso en disputa desde 09/06/2026) — 10:35am"
4. Vendedor muestra "Preferencias del deudor" — Juan Pérez ha opt-out de SMS. Sistema automáticamente lo saca de campaña SMS.
5. Click en "Horarios permitidos" — el sistema solo envía comunicaciones entre 8am-8pm (cumplimiento Pro Consumidor / Ley 172-13).

**Frase del vendedor:**
> *"Cada comunicación que sale de este sistema tiene un permiso, una hora, un canal, y un audit log. Si Pro Consumidor o una juez le pide evidencia, usted la tiene en 10 segundos. Eso no lo tiene ni el software más caro del mercado."*

---

#### Min 25-30: Cierre, ROI y Próximos Pasos

**Objetivo:** Convertir la demo en una prueba piloto.

**Pantalla:** Dashboard ejecutivo de rentabilidad.

**Demo paso a paso:**
1. Vendedor muestra dashboard ejecutivo:
   - Cartera asignada: RD$ 50M
   - Recuperado este mes: RD$ 8.5M
   - **Recuperación neta:** RD$ 6.2M (después de costos y comisiones)
   - Costo por contacto: RD$ 45 (vs RD$ 200 promedio manual)
   - Casos con acuerdo: 45
   - Disputas resueltas: 3
   - Comunicaciones bloqueadas por Legal Firewall: 12 (12 riesgos legales evitados)
2. Vendedor resalta: "Recuperación neta" en grande. Ese es el KPI que el fondo de inversión quiere ver.
3. Click en "Reporte para el banco" → PDF auto-generado con toda la trazabilidad.

**Las 3 frases de cierre para cerrar la venta:**

> **1. Frase del dolor resuelto:**  
> *"Director, en los últimos 6 meses, ¿cuántas demandas ha evitado su oficina por cobro indebido? Con Legal Recovery OS, no evita demandas porque tiene suerte: las evita porque el sistema las bloquea antes de que pasen."*

> **2. Frase del ROI cuantificado:**  
> *"Si usted gestiona una cartera de RD$ 50 millones, y esta plataforma le aumenta la recuperación neta solo un 3%, eso son RD$ 1.5 millones adicionales. El costo anual del sistema es menos del 5% de esa cifra. Se paga solo en el primer mes."*

> **3. Frase del riesgo de no actuar:**  
> *"Su competidor de la calle de abajo ya está hablando con nosotros. El primer fondo que opere con Legal Data Governance va a tener una ventaja que los demás no pueden copiar en 6 meses. ¿Quiere ser el primero o el que sigue?"*

**Call to action:**
> *"Le propongo un piloto de 30 días con una cartera pequeña de su banco cedente. Sin costo de implementación. Si en 30 días no ve más recuperación, menos riesgo y mejor control, cancelamos y no pasa nada. Pero si ve lo que acabo de mostrarle... empezamos la semana que viene. ¿Le parece bien el martes a las 10am para definir la cartera piloto?"*

---

### 4.2 Mockups Requeridos para la Demo

| # | Pantalla / Mockup | Nivel de fidelidad | Quién la usa en la demo |
|---|-------------------|-------------------|------------------------|
| 1 | Login con MFA | Alta | Vendedor |
| 2 | Dashboard ejecutivo (KPIs) | Alta | Vendedor |
| 3 | Lista de expedientes con semáforos | Alta | Vendedor |
| 4 | **Ficha de expediente** (timeline, docs, scores) | **Alta — CRÍTICO** | Vendedor |
| 5 | **Data Passport / Legal Firewall** (bloqueo en vivo) | **Alta — CRÍTICO** | Vendedor |
| 6 | **Propuesta de acuerdo + Next Best Action** | **Alta — CRÍTICO** | Vendedor |
| 7 | Generación de PDF de acuerdo | Media | Vendedor |
| 8 | Registro de pago + OCR comprobante | Media | Vendedor |
| 9 | Generación de Paz y Salvo | Media | Vendedor |
| 10 | **Portal del deudor** (login, resumen, propuesta, pago) | **Alta — CRÍTICO** | Vendedor (navegador incógnito) |
| 11 | Módulo de comunicaciones / campañas | Alta | Vendedor |
| 12 | Auditoría de comunicaciones (log) | Alta | Vendedor |
| 13 | Dashboard de rentabilidad neta | Alta | Vendedor (cierre) |
| 14 | Reporte PDF para banco | Media | Vendedor (cierre) |

**Mockups mínimos imprescindibles (sin estos no hay demo):**
- Ficha de expediente con scores
- Data Passport bloqueando una acción
- Portal del deudor con validación progresiva

### 4.3 Seed Data Ficticio Requerido

Para que la demo fluya sin errores, se necesita precargar:

```
INSTITUCIÓN: Banco Popular Dominicano (demo)
  └── Cartera: Tarjetas Castigadas Q2 2026
      ├── Caso A: Juan Pérez
      │   ├── Cédula: 001-1234567-8
      │   ├── Saldo: RD$ 125,000
      │   ├── Producto: Tarjeta de crédito castigada
      │   ├── Documentos: Contrato ✅, Cesión ✅, Estado cuenta ✅, Pagaré ❌
      │   ├── Contactos: Tel +1-809-555-0100 (validado, opt-in WhatsApp ✅), Email juan@demo.rd (validado ✅)
      │   ├── Data Passport: Todo con fuente "banco cedente", base legal "mandato de gestión", permiso "contacto"
      │   ├── Score Documental: 75% 🟡
      │   ├── Score Recuperabilidad: 85% 🟢
      │   ├── Score Contactabilidad: 90% 🟢
      │   ├── Score Riesgo: 40% 🟡
      │   └── Next Best Action: "Ofrecer 3 cuotas, 30% descuento, canal llamada"
      │
      ├── Caso B: María García
      │   ├── Cédula: 002-7654321-0
      │   ├── Saldo: RD$ 89,000
      │   ├── Contactos: Tel +1-809-555-0200 (FUENTE: JCE, base legal: "consulta administrativa", permiso: "validación" — NO contacto)
      │   ├── opt-in WhatsApp: ❌
      │   └── Estado: Activo, pero Legal Firewall bloquea contacto
      │
      └── Caso C: Pedro Martínez
          ├── Cédula: 003-1111111-2
          ├── Saldo: RD$ 250,000
          ├── Contactos: Tel +1-809-555-0300 (pertenece a cónyuge, tercero no autorizado)
          ├── Estado: En disputa desde 09/06/2026
          └── Legal Firewall: Bloquea todo contacto

USUARIOS:
  ├── admin@legalrecovery.rd (Super Admin)
  ├── gestor@legalrecovery.rd (Gestor)
  ├── supervisor@legalrecovery.rd (Supervisor)
  ├── compliance@legalrecovery.rd (Compliance)
  └── banco_popular@demo.rd (Rol Banco)

REGLAS BANCO POPULAR:
  ├── Descuento automático: hasta 30% en 3 cuotas
  ├── Descuento manual: 31-45% (requiere supervisor)
  ├── Máximo cuotas: 6
  ├── Canales permitidos: portal, email, llamada, SMS selectivo
  ├── WhatsApp: restringido, solo con opt-in
  └── Judicialización: desde RD$ 100,000 con expediente verde
```

### 4.4 Preparación Técnica del Demo Environment

**Requisitos:**
- Instancia staging con Docker Compose completo
- Base de datos con seed data precargado
- Keycloak realm con usuarios demo
- MinIO con documentos de prueba (contrato PDF, pagaré PDF, estado de cuenta PDF)
- SSL + dominio demo (ej. `demo.legalrecovery.os`)
- Pantalla dual: una para admin, otra para portal deudor (o dos pestañas)
- Backup del estado inicial: si alguien "rompe" algo durante la demo, `docker-compose restart` en 30 segundos

**Riesgos y mitigaciones:**
| Riesgo | Mitigación |
|--------|-----------|
| Seed data inconsistente | Script de seed idempotente, ejecutado antes de cada demo |
| Legal Firewall no bloquea | Test automatizado antes de demo: assert `canUseData()` devuelve deny |
| Portal deudor lento | Precargar assets, CDN, no usar internet externo durante demo |
| OTP SMS no llega | Usar OTP fijo para demo (documentado internamente) |
| Pago/OCR falla | Preparar comprobante de prueba que OCR reconoce 100% |
| Demo se extiende | Timer visible en pantalla secundaria, vendedor practica con cronómetro |

---

## ANEXO A: Fuentes de Datos Legales para Integración

Para que Legal Recovery OS sea "verdaderamente inteligente", debe integrarse con fuentes de datos legales y administrativas autorizadas. A continuación, las fuentes identificadas para República Dominicana y Latinoamérica:

### A.1 Fuentes Gubernamentales y Oficiales (RD)

| Fuente | Tipo | Datos disponibles | Base legal requerida | Integración |
|--------|------|-------------------|----------------------|-------------|
| **JCE — Junta Central Electoral** | Gubernamental | Validación de cédula, nombre, estado civil, dirección histórica | Convenio con JCE o consentimiento del titular | API web services JCE (cedulación) |
| **TSS — Tesorería de la Seguridad Social** | Gubernamental | Validación de empleador, cotizaciones, estado laboral | Convenio con TSS o autorización judicial | Web services TSS (solo entidades autorizadas) |
| **DGII — Dirección General de Impuestos Internos** | Gubernamental | RNC, nombre comercial, dirección fiscal | Acceso público limitado (RNC es público) | API DGII consulta RNC |
| **Poder Judicial RD** | Gubernamental | Consulta de procesos judiciales, demandas, embargo | Orden judicial o representación legal | Web consulta procesos (Poder Judicial) |
| **Pro Consumidor** | Gubernamental | Quejas formales, denuncias contra entidades financieras | Datos públicos de denuncias | Web scraping controlado de denuncias públicas |
| **Superintendencia de Bancos** | Regulador | Entidades reguladas, estados financieros, alertas | Datos públicos | API/scraping de lista de entidades |

### A.2 Fuentes Comerciales y Burós (Autorizados)

| Fuente | Tipo | Datos disponibles | Base legal requerida | Integración |
|--------|------|-------------------|----------------------|-------------|
| **TransUnion / Equifax / Experian RD** | Buró de crédito | Historial crediticio, deudas, morosidad, score crediticio | Consentimiento expreso del titular (Ley 172-13 Art. 8) | API buró con credenciales de consulta |
| **SIC — Sistema de Información Crediticia** | Central de riesgos | Datos crediticios reportados por entidades financieras | Consentimiento del titular + autorización de la entidad | API SIC (vía entidad afiliada) |
| **Cámara de Comercio y Producción** | Comercial | Registro mercantil, empresas, representantes legales | Datos públicos | API/web scraping de registro mercantil |
| **Proveedores de validación telefónica** | Comercial | Verificación de número activo, portabilidad, titularidad | Consentimiento o base contractual | API terceros (Hazzit, Infoxel, etc.) |

### A.3 Fuentes Legales y Jurisprudenciales

| Fuente | Tipo | Datos disponibles | Uso en LR OS | Integración |
|--------|------|-------------------|--------------|-------------|
| **LexRD / VLEX / Thomson Reuters** | Base legal | Leyes RD, jurisprudencia, doctrina | Copiloto jurídico: citas legales para documentos, validación de argumentos | API o scraping controlado |
| **Poder Judicial — Buscador de sentencias** | Jurisprudencia | Sentencias, resoluciones, expedientes judiciales | Copiloto jurídico: precedentes para demandas, validación de estrategia | Web scraping controlado |
| **Gaceta Oficial RD** | Legislativo | Leyes, decretos, reglamentos publicados | Actualización automática de marco legal para compliance | RSS/API o scraping |
| **Ley 172-13 (texto completo)** | Norma | Protección de datos personales | Legal Firewall: validación de bases legales, opt-in, derechos ARCO | PDF parseado / texto estructurado en DB |
| **Código Civil RD, Ley 189-11 (Banca Múltiple), etc.** | Norma | Marco legal financiero y civil | Copiloto jurídico: generación de documentos con base legal correcta | Texto estructurado en RAG (ChromaDB) |

### A.4 Fuentes de Datos para Scoring y Validación

| Fuente | Tipo | Datos | Uso | Base legal |
|--------|------|-------|-----|------------|
| **Google Maps / OpenStreetMap** | Geográfica | Direcciones, geocodificación | Validación de dirección del deudor, zona de riesgo | Datos públicos |
| **Registro de la Propiedad** | Gubernamental | Propiedades a nombre del deudor | Score de recuperabilidad, patrimonio embargable | Orden judicial o consentimiento |
| **Verificadores de email (ZeroBounce, NeverBounce)** | Comercial | Validación de existencia de email | Score contactabilidad | Base contractual (uso interno) |
| **Hazzit / Plataformas de validación RD** | Comercial | Validación de teléfonos móviles RD | Score contactabilidad, evitar numeros falsos | Base contractual |

### A.5 Leyes y Normativas Clave para el Sistema

| Ley / Norma | País | Relevancia para LR OS | Obligaciones clave |
|-------------|------|----------------------|-------------------|
| **Ley 172-13** | República Dominicana | **Núcleo del compliance** | Consentimiento, finalidad, calidad, seguridad, derechos ARCO, sanciones hasta RD$ 5M+ |
| **Ley 189-11 (Banca Múltiple)** | RD | Marco financiero | Regulación de cartera castigada, provisiones, cesión |
| **Código Civil RD** | RD | Base para demandas | Prescripción, obligaciones, embargos |
| **Ley 141-15 (Ley de Mercado de Valores)** | RD | Fondos de inversión | Regulación de NPL, fondos de inversión en cartera |
| **Ley 63-17 (Régimen Electrónico)** | RD | Firma digital, documentos | Validez de acuerdos digitales, firmas electrónicas |
| **LGPD (Brasil)** | Brasil | Expansión futura | Similar a 172-13, consentimiento, derechos |
| **Ley Federal de Protección de Datos (México)** | México | Expansión futura | Consentimiento, tratamiento de datos financieros |
| **WhatsApp Business Messaging Policy** | Global | Canal restringido | No usar WhatsApp para cobro masivo, solo con opt-in, mensajes neutrales |
| **PCI DSS** | Global | Pagos con tarjeta | Si se procesan tarjetas, cumplir nivel apropiado |

---

## ANEXO B: Glosario de Términos para Demo

| Término | Definición corta (para vendedor) |
|---------|----------------------------------|
| **Cartera castigada** | Deudas que el banco no recupera por vía normal y transfiere a una oficina legal |
| **Data Passport** | "Pasaporte legal" de cada dato: dónde viene, para qué se puede usar, quién puede verlo, cuándo vence |
| **Legal Firewall** | El guardián del sistema: revisa cada acción y dice "sí", "no" o "solo si..." |
| **Next Best Action** | La recomendación de la IA: "llámalo con esta oferta, no le mandes SMS" |
| **Score de recuperabilidad** | Probabilidad (0-100%) de que este caso pague, basado en documentos, saldo, antigüedad, contactos |
| **Recuperación neta** | Lo que realmente ganó la oficina: lo recuperado menos costos, comisiones y gastos |
| **Human-in-the-loop** | La IA recomienda, pero el abogado/supervisor aprueba. La máquina no decide sola. |
| **Opt-in** | El deudor dijo "sí, contácteme por este canal". Sin opt-in = contacto ilegal. |
| **Human-in-the-loop** | La IA recomienda, pero un humano aprueba decisiones sensibles |
| **ARCO** | Derechos del titular: Acceso, Rectificación, Cancelación, Oposición (Ley 172-13) |
| **RLS** | Row Level Security: en la base de datos, cada banco solo ve sus propios datos |
| **NPL** | Non-Performing Loan = préstamo no performante = cartera castigada |

---

## Resumen Ejecutivo para el Fundador

### ¿Qué tiene ahora?
- Un producto conceptualmente sólido con 23 prompts modulares
- Un stack tecnológico moderno (NestJS + Next.js + Prisma + PostgreSQL)
- Una infraestructura de desarrollo lista (Proxmox VM con Docker)
- Un plan maestro de implementación de 732 líneas con roadmap detallado

### ¿Qué necesita para vender?
1. **Sprint 0-3 (semanas 1-8):** Construir el MVP funcional con Data Passport operativo
2. **Demo environment:** Una instancia staging con seed data ficticio y 3 casos demo
3. **Mockups de alta fidelidad:** Ficha de expediente, Legal Firewall bloqueando, portal deudor
4. **Pitch deck:** 10 slides con el UVP, comparativa de competidores, ROI, y capturas de pantalla del sistema

### ¿Cuál es el riesgo si no actúa ahora?
- El mercado de recovery en RD/Latam está creciendo. El primer jugador con "Legal Data Governance" gana credibilidad con bancos y fondos.
- La Ley 172-13 se está aplicando con más rigor. Las oficinas legales que no tengan control de datos personales van a perder contratos bancarios.
- Los competidores globales (Experian, FICO) son caros y genéricos. Hay una ventana de 12-18 meses para posicionarse como la opción local inteligente.

### Próximo paso inmediato
> **Semanas 1-2:** Ejecutar Sprint 0 (setup monorepo + Docker + DB + auth).  
> **Semanas 3-8:** Ejecutar Sprints 1-3 (instituciones, carteras, expedientes, Data Passport).  
> **Semana 9:** Preparar demo environment con seed data y practicar el guion de 30 minutos.  
> **Semana 10:** Primera demo a prospecto caliente (fondo de cartera o oficina legal tier-2).

---

*Documento generado por análisis estratégico de la documentación completa del proyecto (23 prompts + alcance + plan maestro). Requiere validación legal antes de uso en producción.*
