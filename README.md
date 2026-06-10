# Legal Recovery OS - POC Demo

> Plataforma de gestión de cobro legal - República Dominicana
> Demo funcional para presentaciones de ventas

## Stack

- Next.js 15 (App Router, standalone output)
- React 19 + Tailwind CSS + shadcn/ui
- Recharts (gráficos)
- JWT auth (demo)
- Seed data estática (3 casos demo)

## Estructura del Proyecto

```
src/
├── app/
│   ├── login/              # Login + MFA mock
│   ├── portal/
│   │   ├── admin/
│   │   │   ├── dashboard/  # KPIs + gráficos
│   │   │   ├── cases/      # Lista de expedientes
│   │   │   ├── cases/[id]/ # Ficha + Legal Firewall
│   │   │   ├── communications/
│   │   │   ├── audit/      # Auditoría inmutable
│   │   │   └── reports/    # Rentabilidad
│   │   └── debtor/
│   │       ├── validate/   # Validación progresiva
│   │       ├── dashboard/  # Portal deudor
│   │       └── agreement/  # Acuerdo de pago
│   └── api/                # Mock API routes
├── lib/
│   ├── seed-data.ts        # 3 casos demo completos
│   ├── demo-auth.ts        # JWT simple
│   ├── legal-firewall.ts   # canUseData()
│   └── types.ts            # Tipos TypeScript
└── components/ui/          # shadcn/ui components
```

## Datos Demo

| Caso | Deudor | Estado | Saldo | WOW Moment |
|------|--------|--------|-------|------------|
| case-001 | Juan Pérez | Activo | $125,000 | Next Best Action + acuerdo |
| case-002 | María García | Activo | $89,000 | Legal Firewall bloquea WhatsApp (JCE) |
| case-003 | Pedro Martínez | En Disputa | $250,000 | Bloqueo tercero + disputa |

## Demo Flow

1. **Login** → `admin@legalrecovery.rd` / `demo123` / MFA: `123456`
2. **Dashboard** → KPIs, gráficos, tabla de casos
3. **Expedientes** → Lista con scores y semáforos
4. **Ficha** (María García) → Click WhatsApp → **Legal Firewall BLOQUEA**
5. **Ficha** (Pedro Martínez) → Click WhatsApp → **Bloqueo doble**
6. **Ficha** (Juan Pérez) → Scores + Next Best Action + Acuerdo
7. **Portal Deudor** → Validación progresiva → Resumen → Aceptar acuerdo
8. **Auditoría** → Log inmutable
9. **Reportes** → Rentabilidad neta

## Deploy

El deploy se realiza automáticamente via CI/CD en K3s al hacer push.

```bash
# Local dev
npm install
npm run dev
```

## URL

- **Prod**: https://legal-recovery.licitpilot.com

## Licencia

Propietario - Legal Recovery OS
