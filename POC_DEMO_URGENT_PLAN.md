# Plan POC Demo Urgente — Legal Recovery OS

> **Meta:** Demo funcional de 30 minutos lista para presentar a prospectos  
> **Infraestructura:** PC local (desarrollo) → K3s en Proxmox (deploy)  
> **VM de datos:** 10.166.166.60 (PostgreSQL 16, Redis, MinIO ya instalados)  
> **Cluster K3s:** 10.166.166.10-12 (CPs), 10.166.166.30-32 (workers)  > **Regla:** Demo-driven development. Solo construimos lo que el guion de 30 min pide.  
> **Tiempo objetivo:** 5 días full-time (1 persona) o 2-3 días (2-3 personas)

---

## Arquitectura POC

```
PC Local (desarrollo)
  └── next dev (puerto 3000) → http://localhost:3000
      ├── /portal/admin → Dashboard, casos, ficha, firewall, acuerdos
      └── /portal/debtor → Validación, resumen, propuesta, pago

Deploy a K3s (producción demo)
  └── kubernetes_proxmox/proyectos/legal-recovery/
      ├── namespace: legal-recovery
      ├── Deployment: frontend (Next.js) + backend (NestJS si alcanza
      ├── Service + Ingress → legal-recovery.licitpilot.com
      └── Secretos: DB_URL, REDIS_URL, JWT_SECRET

Servicios externos (VM 10.166.166.60)
  ├── PostgreSQL 16 (port 5432)
  ├── Redis (port 6379)
  └── MinIO (port 9000 / 9001)
```

**Decisiones para velocidad:**
- **Días 1-2:** Solo frontend Next.js + API routes (`/app/api`). Sin NestJS aún. Seed data en JSON estático.
- **Día 3+:** Si hay tiempo, añadir NestJS como backend real conectando a PostgreSQL en 10.166.166.60.
- **Deploy:** Manifests K8s en `kubernetes_proxmox/proyectos/legal-recovery/` para deploy automático.

---

## Estructura de Carpetas

```
legal_recovery/
├── poc/                          <- NUEVO: Código del POC demo
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              <- Landing → redirect /login
│   │   ├── globals.css
│   │   ├── login/page.tsx        <- Login + MFA mock
│   │   ├── api/                  <- Mock API routes (seed data)
│   │   │   ├── auth/route.ts
│   │   │   ├── cases/route.ts
│   │   │   ├── cases/[id]/route.ts
│   │   │   └── agreements/route.ts
│   │   └── portal/
│   │       ├── admin/
│   │       │   ├── layout.tsx
│   │       │   ├── dashboard/page.tsx
│   │       │   ├── cases/page.tsx
│   │       │   ├── cases/[id]/page.tsx    <- Ficha + Firewall
│   │       │   ├── communications/page.tsx
│   │       │   └── reports/page.tsx
│   │       └── debtor/
│   │           ├── layout.tsx
│   │           ├── validate/page.tsx     <- Validación progresiva
│   │           ├── dashboard/page.tsx
│   │           └── agreement/page.tsx
│   ├── components/
│   │   └── ui/                   <- shadcn/ui components
│   ├── lib/
│   │   ├── seed-data.ts          <- 3 casos demo completos
│   │   ├── demo-auth.ts          <- Auth mock (JWT simple)
│   │   └── utils.ts
│   ├── public/
│   │   └── documents/            <- PDFs de ejemplo
│   ├── package.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
└── kubernetes_proxmox/           <- EXISTENTE: deploy infra
    └── proyectos/
        └── legal-recovery/       <- NUEVO: manifests K8s
            ├── 00-namespace.yaml
            ├── 01-deployment.yaml
            ├── 02-service.yaml
            ├── 03-ingress.yaml
            └── README.md
```

---

## Timeline de 5 Días

### Día 1: Setup + Login + Dashboard
**Meta:** `http://localhost:3000/portal/admin/dashboard` carga con datos reales.

- [ ] `cd legal_recovery && mkdir poc && cd poc`
- [ ] `npx create-next-app@latest . --typescript --tailwind --app --no-turbopack` (turbopack tiene issues con algunas libs)
- [ ] `npx shadcn@latest init` (base color: slate, CSS variables: yes)
- [ ] Instalar dependencias:
  ```bash
  npm install lucide-react recharts react-hook-form zod @hookform/resolvers
  npm install @tanstack/react-table
  npm install sonner
  npm install jose  # JWT simple sin next-auth
  ```
- [ ] Crear `lib/seed-data.ts` con 3 casos completos (ver detalle abajo)
- [ ] Crear `lib/demo-auth.ts` con JWT simple (firmado con secret hardcodeado para demo)
- [ ] Login page: UI profesional con MFA simulation (input TOTP fijo "123456")
- [ ] Dashboard: KPIs, semáforos, tabla de casos, gráfico de recuperación
- [ ] Testear flujo: login → dashboard → lista de casos (3 filas)

### Día 2: Ficha Expediente + Legal Firewall (EL WOW)
**Meta:** El Legal Firewall bloquea visualmente con animación.

- [ ] Ficha de caso: tabs (Resumen, Documentos, Timeline, Scores, Data Passport)
- [ ] Scores: 4 cards con gauge/bars (documental, recuperabilidad, contactabilidad, riesgo)
- [ ] Next Best Action: banner destacado con botón de acción
- [ ] Timeline: lista vertical de eventos con iconos y colores
- [ ] **Legal Firewall:** 
  - Botón "Enviar WhatsApp" en cada caso
  - Modal de bloqueo con 🔴 animado, razón clara, y badge "Legal Firewall"
  - María García → bloqueo: "Dato de JCE sin permiso de contacto comercial"
  - Pedro Martínez → bloqueo: "Caso en disputa + contacto de tercero no autorizado"
  - Juan Pérez → éxito → diálogo de plantilla aprobada
- [ ] Animación: shake + toast + color change

### Día 3: Acuerdo + Portal Deudor
**Meta:** Flujo completo de acuerdo y portal deudor funcional.

- [ ] Propuesta de acuerdo: formulario pre-llenado desde Next Best Action
- [ ] Validación de reglas del banco: UI que muestra "30% descuento ✅ dentro de política"
- [ ] PDF preview: iframe con documento estático o HTML renderizado
- [ ] Simulación de aceptación: checkbox + timestamp + hash
- [ ] Paz y Salvo: documento generado visualmente
- [ ] **Portal deudor:**
  - Nueva ruta `/portal/debtor` (layout diferente, más amigable)
  - Validación progresiva: input cédula → pregunta seguridad → OTP
  - Resumen del caso: saldo, acuerdo vigente, botón de pago
  - Botón "Abrir disputa" → formulario simple
  - Diseño mobile-friendly

### Día 4: Comunicaciones + Auditoría + Rentabilidad
**Meta:** Dashboards de compliance y rentabilidad.

- [ ] Comunicaciones: tabla de mensajes enviados/bloqueados con badges de estado
- [ ] Auditoría: log de acciones con filtros (quién, qué, cuándo, resultado)
- [ ] Dashboard rentabilidad: 
  - Gráficos Recharts (líneas, barras, pie)
  - KPIs: monto asignado, recuperado, neta, costo, conversión
  - Filtro por institución/cartera/período
- [ ] Reporte ejecutivo: placeholder visual de PDF generado

### Día 5: Pulido + K8s Deploy + Práctica
**Meta:** Demo deployado en K3s, guion practicado.

- [ ] Pulir transiciones y animaciones
- [ ] Crear botón "Reset Demo" que vuelve todo al estado inicial
- [ ] Construir manifests K8s:
  - `00-namespace.yaml`
  - `01-deployment.yaml` (Next.js con Node 20, puerto 3000)
  - `02-service.yaml` (ClusterIP)
  - `03-ingress.yaml` (Traefik, host: `legal-recovery.licitpilot.com`)
- [ ] Crear secretos: `kubectl create secret generic legal-recovery-secrets ...`
- [ ] Deploy: `kubectl apply -f kubernetes_proxmox/proyectos/legal-recovery/`
- [ ] Verificar: `kubectl get pods -n legal-recovery`
- [ ] Testear URL: `https://legal-recovery.licitpilot.com`
- [ ] Practicar guion 3 veces con cronómetro
- [ ] Crear slides de backup con screenshots por si falla algo

---

## Seed Data (lib/seed-data.ts)

```typescript
export const demoUsers = [
  { id: "user-001", email: "admin@legalrecovery.rd", name: "Admin Demo", role: "super_admin", institutionId: "inst-001" },
  { id: "user-002", email: "gestor@legalrecovery.rd", name: "Gestor Demo", role: "gestor", institutionId: "inst-001" },
];

export const demoInstitution = {
  id: "inst-001",
  name: "Banco Popular Dominicano",
  logo: "/logos/banco-popular.png",
  rules: {
    maxDiscountAuto: 30,
    maxInstallments: 6,
    minInstallments: 1,
    channelsAllowed: ["portal", "email", "call", "sms"],
    whatsappAllowed: false,
  }
};

export const demoCases = [
  {
    id: "case-001",
    debtor: {
      name: "Juan Pérez",
      idNumber: "001-1234567-8",
      phone: { number: "+1-809-555-0100", source: "banco", optIn: true, allowed: true },
      email: { address: "juan.perez@demo.rd", source: "banco", optIn: true, allowed: true },
    },
    balance: 125000,
    product: "Tarjeta de crédito castigada",
    status: "active",
    scores: { documental: 75, recoverability: 85, contactability: 90, risk: 40 },
    documents: [
      { name: "Contrato", status: "complete" },
      { name: "Cesión", status: "complete" },
      { name: "Estado de cuenta", status: "complete" },
      { name: "Pagaré", status: "missing" },
    ],
    dataPassport: { source: "banco cedente", legalBasis: "mandato de gestión", allowedUses: ["contact", "analysis"], restrictions: [] },
    nextBestAction: { channel: "call", offer: "3 cuotas 30% descuento", message: "Ofrecer acuerdo de 3 cuotas con 20% descuento. Canal: llamada. Evitar SMS." },
    timeline: [
      { date: "2026-06-01", action: "Cartera cargada", user: "Sistema", type: "system" },
      { date: "2026-06-02", action: "Teléfono validado", user: "Sistema", type: "auto" },
      { date: "2026-06-03", action: "Score calculado", user: "Sistema", type: "auto" },
      { date: "2026-06-05", action: "Email enviado", user: "Sistema", type: "communication" },
    ],
    disputes: [],
    payments: [],
  },
  {
    id: "case-002",
    debtor: {
      name: "María García",
      idNumber: "002-7654321-0",
      phone: { number: "+1-809-555-0200", source: "JCE", optIn: false, allowed: false, reason: "Dato de JCE sin permiso de contacto comercial. Base legal: consulta administrativa." },
      email: { address: null, source: null, optIn: false, allowed: false },
    },
    balance: 89000,
    product: "Préstamo personal",
    status: "active",
    scores: { documental: 60, recoverability: 45, contactability: 20, risk: 70 },
    documents: [
      { name: "Contrato", status: "complete" },
      { name: "Pagaré", status: "missing" },
    ],
    dataPassport: { source: "JCE", legalBasis: "consulta administrativa", allowedUses: ["validation"], restrictions: ["no_contact", "no_whatsapp"] },
    timeline: [
      { date: "2026-06-01", action: "Cartera cargada", user: "Sistema", type: "system" },
      { date: "2026-06-02", action: "⚠️ Dato bloqueado por Legal Firewall", user: "Sistema", type: "blocked" },
    ],
    disputes: [],
    payments: [],
  },
  {
    id: "case-003",
    debtor: {
      name: "Pedro Martínez",
      idNumber: "003-1111111-2",
      phone: { number: "+1-809-555-0300", source: "tercero (cónyuge)", optIn: false, allowed: false, reason: "Contacto pertenece a tercero no autorizado. Prohibido por Ley 172-13." },
      email: { address: null, source: null, optIn: false, allowed: false },
    },
    balance: 250000,
    product: "Tarjeta de crédito castigada",
    status: "disputed",
    scores: { documental: 90, recoverability: 75, contactability: 0, risk: 95 },
    documents: [
      { name: "Contrato", status: "complete" },
      { name: "Cesión", status: "complete" },
      { name: "Estado de cuenta", status: "complete" },
      { name: "Pagaré", status: "complete" },
    ],
    dataPassport: { source: "banco cedente", legalBasis: "mandato de gestión", allowedUses: ["analysis"], restrictions: ["no_contact", "case_disputed"] },
    timeline: [
      { date: "2026-06-01", action: "Cartera cargada", user: "Sistema", type: "system" },
      { date: "2026-06-09", action: "Disputa abierta por deudor", user: "Pedro Martínez", type: "dispute" },
      { date: "2026-06-09", action: "🔴 Campaña pausada automáticamente", user: "Sistema", type: "blocked" },
    ],
    disputes: [{ openedAt: "2026-06-09", reason: "Deuda ya saldada según deudor", status: "open" }],
    payments: [],
  },
];

export const demoCommunications = [
  { id: "comm-001", caseId: "case-001", channel: "email", direction: "outbound", status: "delivered", content: "Recordatorio de saldo", timestamp: "2026-06-05T10:30:00Z" },
  { id: "comm-002", caseId: "case-002", channel: "whatsapp", direction: "outbound", status: "blocked", content: "BLOQUEADO: Dato JCE sin permiso", timestamp: "2026-06-06T14:00:00Z", blockedReason: "Legal Firewall: fuente JCE sin autorización de contacto" },
  { id: "comm-003", caseId: "case-003", channel: "sms", direction: "outbound", status: "blocked", content: "BLOQUEADO: Caso en disputa", timestamp: "2026-06-09T09:00:00Z", blockedReason: "Legal Firewall: caso en disputa + tercero no autorizado" },
];

export const demoKPIs = {
  portfolioAssigned: 50000000,
  recoveredThisMonth: 8500000,
  netRecovery: 6200000,
  costPerContact: 45,
  casesWithAgreement: 45,
  disputesResolved: 3,
  firewallBlocked: 12,
  activeCases: 1200,
  conversionRate: 18.5,
};
```

---

## Estrategia de Deploy K3s

### Pre-requisitos
- Conexión VPN a Proxmox
- `kubectl` configurado con contexto `k3s-proxmox`
- Acceso a Cloudflare Tunnel (ya configurado en cluster)

### Pasos
1. Crear directorio `kubernetes_proxmox/proyectos/legal-recovery/`
2. Crear manifests:
   - `00-namespace.yaml`: `legal-recovery`
   - `01-deployment.yaml`: Next.js app, 2 replicas, Node 20
   - `02-service.yaml`: ClusterIP, puerto 3000
   - `03-ingress.yaml`: Traefik, host `legal-recovery.licitpilot.com`
3. Build imagen Docker (si es necesario) o usar `image: node:20` con `npm run build` + `npm start`
4. Aplicar: `kubectl apply -f kubernetes_proxmox/proyectos/legal-recovery/`
5. Verificar: `kubectl get pods,svc,ingress -n legal-recovery`
6. URL: `https://legal-recovery.licitpilot.com`

### Si NO usamos imagen Docker (más rápido para MVP)
Podemos usar un **init container** que clone el repo y haga `npm run build`, o usar **K3s con local-path** y montar el código.

**Alternativa más rápida:** Desplegar con `kubectl run` + `kubectl expose` + Ingress manual.

**Alternativa más simple:** Usar Coolify si está disponible en el cluster (VM 200). Si Coolify corre en el cluster, puede deployar automáticamente desde git.

---

## Cómo Empezar AHORA

```bash
# 1. Ir al repo
 cd C:\Users\snova\Documents\GitHub\legal_recovery

# 2. Crear carpeta del POC
 mkdir poc
 cd poc

# 3. Inicializar Next.js 15
 npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-turbopack

# 4. Inicializar shadcn/ui
 npx shadcn@latest init

# 5. Instalar dependencias clave
 npm install lucide-react recharts react-hook-form zod @hookform/resolvers @tanstack/react-table sonner jose

# 6. Empezar a codear
#    - lib/seed-data.ts
#    - app/login/page.tsx
#    - app/portal/admin/dashboard/page.tsx
```

---

## Estimación Realista

| Día | Horas | Entregable | Riesgo |
|-----|-------|-----------|--------|
| 1 | 10h | Repo, login, dashboard, lista casos | Bajo |
| 2 | 10h | Ficha, Legal Firewall WOW | Medio (lógica de bloqueo) |
| 3 | 10h | Acuerdo, portal deudor | Medio (validación progresiva) |
| 4 | 10h | Comunicaciones, auditoría, rentabilidad | Bajo |
| 5 | 8h | K8s deploy, pulido, práctica | Medio (infra) |
| **Total** | **48h** | **Demo 30 min completo** | |

**Con 2 personas:** 2-3 días.
**Con 3 personas:** 2 días.

---

*Plan actualizado para infra K3s + VM datos. Empezar inmediatamente.*
