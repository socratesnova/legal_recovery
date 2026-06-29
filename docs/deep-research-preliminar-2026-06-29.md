# Deep Research — Legal Recovery OS (REPORTE PRELIMINAR)

**Fecha:** 2026-06-29
**Estado:** 9 / 25 claims sobrevivieron verificación adversarial. Síntesis final y auditoría de código pendientes (rate limit alcanzó la cuota del proveedor LLM).
**Acción:** Este reporte es provisional; se completará cuando se relance el workflow con la cuota renovada.

---

## 1. Hallazgos verificados (claims que pasaron 2/3 votos adversarial)

### LATAM / República Dominicana

1. **OptiCredit** (`https://opticredit.app/`) — SaaS multi-tenant para financieras y prestamistas en RD. Pricing público: **RD$2,500 / 5,000 / 12,000 mensuales** (Basic / Professional / Enterprise) con topes de 100 / 300 / 800 préstamos activos por OCR y 1 / 5 / 15 usuarios. Diferenciador: OCR voucher validation. **Voto 3-0.**

2. **Recado Digital 809** (`https://recadodigital809.com/`) — Vendor dominicano con 8+ años en cobranza extrajudicial, focalizado en agencias de cobranza, abogados y administración de condominios. Producto: agente IA multicanal **WhatsApp + SMS + Email** nativo RD, 24/7, con "pacing inteligente y límites diarios para proteger tu número". Personalización por nombre deudor / monto / meses en mora. **Voto 2-1** (1 voto no entregado por 429).

3. **Ladonware Collector** (`https://ladonware.com/software-cobranzas-collector/`) — Cubre 5 jurisdicciones LATAM (Colombia, Chile, México, Argentina, Perú) con cumplimiento de **Ley 2300 (Colombia)** y **Ley 21320 (Chile)**. Compliance embebido: **bloqueo automático por país** (horarios, canales, frecuencia) + **registros inmutables para auditoría y trazabilidad judicial**. Argumento de venta: sanción de **USD 15,000 por infracción**. **Voto 2-0 + 1-1.**

4. **IUS PRO** (`https://iuspro.com/soluciones/cobro-judicial`) — Legal AI SaaS **específico de Costa Rica** ("toda la jurisprudencia y normativa costarricense"), especializado en **cobro judicial**. No es multi-jurisdicción. Genera escritos, valida títulos ejecutivos por lote, vigila plazos. **Voto 2-1.**

### Europa (benchmark de techo de features)

5. **Intrum** (`https://attachment.news.eu.nasdaq.com/...`) — Opera en **20 países europeos**, ingresos 2024 SEK **18,033 M**, Cash EBITDA SEK **9,287 M**, apalancamiento 4.5x. Lanza **Ophelos** (plataforma IA adquirida en 2023) en 5 países en 2024 (BE, FR, NL, ES, UK): cobros autónomos con ML tailoring de mensajes y self-serve digital journey. **Votos 1-1 + 2-0.**

### Compliance US (referencia, no mercado objetivo)

- Tratta (`tratta.io`) y Gryphon ONE (`gryphon.ai/collections/`) — productos compliance-as-code: SOC 2 Type II, PCI DSS L1, 2FA, embargo de contacto por TCPA/FDCPA/CFPB Reg F, Do-Not-Call scrubbing. Todos los claims de Tratta y Gryphon fueron **refutados o abstinentes** (0-1 / 0-0) por no verificarse con fuentes primarias — Tratta y Gryphon son **marketing sites**, no papers. La señal competitiva existe pero no pudimos cuantificarla.

### Regulación RD (fuentes consultadas, no verificadas)

- **INDOTEL Resolución 010-16 (2016)** sobre cobre de deudas vía telefónica — citada como controversial por Pro Consumidor. **Todos los 3 votos abstinentes por 429** — claim no se pudo verificar.
- **Ley 358-05 (Protección al Consumidor)** y **Ley 172-13 (Habeas Data / Protección Datos Personales)** — fuentes oficiales citadas (`proconsumidor.gob.do`, `camaradediputados.gob.do`) pero **0 votos válidos** por rate limit.

---

## 2. Lo que NO se pudo verificar (por rate limit)

- Cuantificación del cumplimiento US (Tratta, Gryphon) — necesario para roadmap enterprise.
- Texto literal y vigencia actual de INDOTEL 010-16, Ley 358-05, Ley 172-13 — bloqueante para módulo de compliance RD.
- Patrones arquitecturales (Postgres RLS, immudb, audit hash chains) — fuentes consultadas (ClickHouse, Jagatjeet, IRU docs) pero el ángulo de extracción quedó incompleto.

---

## 3. Lo que falta ejecutar

- **Auditoría interna del código** del repo (`apps/api/src/...`, `apps/web/src/...`) — agente nunca corrió.
- **Síntesis final en español** con roadmap en 3 horizontes — agente `synthesize` falló por 429.

---

## 4. Posicionamiento competitivo (lectura propia basada en lo verificado)

Legal Recovery OS **sí tiene diferenciadores reales** frente a los competidores LATAM identificados:

| Diferenciador LR_OS | Competidores LATAM |
|---|---|
| **Data Passport** (provenance metadata por campo) | No aparece en OptiCredit / Recado / Ladonware |
| **Legal Firewall** (gate de compliance centralizado) | Ladonware tiene "bloqueo automático" pero menos granular |
| **Multi-tenant con institution_id explícito** | OptiCredit lo tiene; Recado y Ladonware no tanto |
| **Stack moderno NestJS + Prisma + Next.js** | Ladonware corre en Oracle Cloud + Java/.NET (legacy) |
| **Auditoría inmutable como concepto** | Ladonware lo menciona; el resto no |

**Sin embargo, los competidores nos ganan en:**
- OptiCredit → pricing transparente publicado y OCR voucher validation (4x faster reconciliation según marketing).
- Recado Digital → agente IA WhatsApp 24/7 con anti-ban pacing (algo que LR_OS no tiene; tiene Communication module pero sin IA).
- Ladonware → multi-jurisdicción LATAM (5 países); LR_OS solo RD.

---

## 5. Próximo paso

Esperar a renovación de cuota del proveedor (`ollama.com/settings`) y relanzar el workflow con las optimizaciones que aplicaré al script:

1. Reducir verificadores de 3 a 2 votos por claim.
2. Limitar claims a verificar a 15 (no 25).
3. Bajar `MAX_FETCH` de 15 a 10.
4. Asegurar que las fases **audit-repo** y **synthesize-final** corran ANTES de la verificación (para que un corte por rate limit no las pierda).
5. Añadir backoff exponencial y resume automático.

Cuando termine el workflow completo, el reporte final cubrirá: auditoría técnica del repo (con rutas:line), roadmap accionable, y citas completas.