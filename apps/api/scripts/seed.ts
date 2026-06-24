import { PrismaClient, CaseStatus, EntityStatus, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'demo1234';

async function main() {
  console.log('Seeding database...');

  // ── Institution ──
  // Upsert by a stable id (taxId is not @unique in the schema, so it cannot be
  // used as a unique selector). A fixed id keeps the seed idempotent across
  // re-runs, mirroring the portfolio/debtor/case upserts below.
  const INSTITUTION_ID = '00000000-0000-0000-0000-000000000000';
  const institution = await prisma.institution.upsert({
    where: { id: INSTITUTION_ID },
    update: {},
    create: {
      id: INSTITUTION_ID,
      name: 'Banco Popular Dominicano',
      type: 'BANK',
      country: 'DO',
      taxId: '101123456',
      status: 'ACTIVE',
      maxDiscountAuto: 30.0,
      maxDiscountManual: 50.0,
      minInstallments: 1,
      maxInstallments: 6,
      autoApprovalLimit: 100000.0,
    },
  });
  console.log('Institution:', institution.name);

  // ── Users ──
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@legalrecovery.do' },
    update: { passwordHash },
    create: {
      email: 'admin@legalrecovery.do',
      name: 'Lic. María Fernández',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      institutionId: institution.id,
      passwordHash,
    },
  });
  console.log('User:', adminUser.email);

  const gestorUser = await prisma.user.upsert({
    where: { email: 'gestor@legalrecovery.do' },
    update: { passwordHash },
    create: {
      email: 'gestor@legalrecovery.do',
      name: 'Carlos Ramírez',
      role: 'GESTOR',
      status: 'ACTIVE',
      institutionId: institution.id,
      passwordHash,
    },
  });
  console.log('User:', gestorUser.email);

  // ── Portfolio ──
  const portfolio = await prisma.portfolio.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      institutionId: institution.id,
      name: 'Cartera Consumo Junio 2026',
      type: 'ASSIGNED',
      totalAmount: 50000000.0,
      currency: 'DOP',
      status: 'ACTIVE',
    },
  });
  console.log('Portfolio:', portfolio.name);

  // ── Portfolio Rules ──
  await prisma.portfolioRule.upsert({
    where: { portfolioId: portfolio.id },
    update: {},
    create: {
      portfolioId: portfolio.id,
      discountMax: 30.0,
      minInstallments: 1,
      maxInstallments: 6,
      autoApprovalLimit: 100000.0,
      channelsAllowed: ['portal', 'email', 'call', 'sms'],
    },
  });

  // ── Debtors ──
  const debtor1 = await prisma.debtor.upsert({
    where: { id: '00000000-0000-0000-0000-000000000011' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000011',
      firstName: 'Juan',
      lastName: 'Pérez',
      idNumber: '001-1234567-8',
      idType: 'cedula',
    },
  });

  const debtor2 = await prisma.debtor.upsert({
    where: { id: '00000000-0000-0000-0000-000000000012' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000012',
      firstName: 'María',
      lastName: 'García',
      idNumber: '002-7654321-0',
      idType: 'cedula',
    },
  });

  const debtor3 = await prisma.debtor.upsert({
    where: { id: '00000000-0000-0000-0000-000000000013' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000013',
      firstName: 'Pedro',
      lastName: 'Martínez',
      idNumber: '003-1111111-2',
      idType: 'cedula',
    },
  });
  console.log('Debtors created');

  // ── Contacts ──
  await prisma.contact.upsert({
    where: { id: '00000000-0000-0000-0000-000000000021' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000021',
      debtorId: debtor1.id,
      channel: 'PHONE',
      value: '+1-809-555-0100',
      isPrimary: true,
      optIn: true,
      optInDate: new Date('2026-01-15'),
    },
  });

  await prisma.contact.upsert({
    where: { id: '00000000-0000-0000-0000-000000000022' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000022',
      debtorId: debtor1.id,
      channel: 'EMAIL',
      value: 'juan.perez@demo.rd',
      isPrimary: true,
      optIn: true,
      optInDate: new Date('2026-01-15'),
    },
  });

  await prisma.contact.upsert({
    where: { id: '00000000-0000-0000-0000-000000000023' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000023',
      debtorId: debtor2.id,
      channel: 'PHONE',
      value: '+1-809-555-0200',
      isPrimary: true,
      optIn: false,
    },
  });

  await prisma.contact.upsert({
    where: { id: '00000000-0000-0000-0000-000000000024' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000024',
      debtorId: debtor3.id,
      channel: 'PHONE',
      value: '+1-809-555-0300',
      isPrimary: true,
      optIn: false,
    },
  });
  console.log('Contacts created');

  // ── Cases ──
  const case1 = await prisma.case.upsert({
    where: { id: '00000000-0000-0000-0000-000000000031' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000031',
      institutionId: institution.id,
      portfolioId: portfolio.id,
      debtorId: debtor1.id,
      caseNumber: 'CASE-2026-0001',
      status: 'ACTIVE',
      totalBalance: 125000.0,
      assignedDate: new Date('2026-06-01'),
      nextAction: 'call',
      nextActionDate: new Date('2026-06-15'),
      scoreDocumental: 75,
      scoreRecoverability: 85,
      scoreContactability: 90,
      scoreRisk: 40,
    },
  });

  const case2 = await prisma.case.upsert({
    where: { id: '00000000-0000-0000-0000-000000000032' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000032',
      institutionId: institution.id,
      portfolioId: portfolio.id,
      debtorId: debtor2.id,
      caseNumber: 'CASE-2026-0002',
      status: 'ACTIVE',
      totalBalance: 89000.0,
      assignedDate: new Date('2026-06-01'),
      nextAction: 'portal',
      nextActionDate: new Date('2026-06-20'),
      scoreDocumental: 60,
      scoreRecoverability: 45,
      scoreContactability: 20,
      scoreRisk: 70,
    },
  });

  const case3 = await prisma.case.upsert({
    where: { id: '00000000-0000-0000-0000-000000000033' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000033',
      institutionId: institution.id,
      portfolioId: portfolio.id,
      debtorId: debtor3.id,
      caseNumber: 'CASE-2026-0003',
      status: 'DISPUTED',
      totalBalance: 250000.0,
      assignedDate: new Date('2026-06-01'),
      nextAction: null,
      nextActionDate: null,
      scoreDocumental: 90,
      scoreRecoverability: 75,
      scoreContactability: 0,
      scoreRisk: 95,
    },
  });
  console.log('Cases created');

  // ── Case Products ──
  await prisma.caseProduct.upsert({
    where: { id: '00000000-0000-0000-0000-000000000041' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000041',
      caseId: case1.id,
      productType: 'Tarjeta de crédito castigada',
      originalAmount: 156000.0,
      currentBalance: 125000.0,
      interestRate: 1.5,
    },
  });

  await prisma.caseProduct.upsert({
    where: { id: '00000000-0000-0000-0000-000000000042' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000042',
      caseId: case2.id,
      productType: 'Préstamo personal',
      originalAmount: 120000.0,
      currentBalance: 89000.0,
      interestRate: 1.8,
    },
  });

  await prisma.caseProduct.upsert({
    where: { id: '00000000-0000-0000-0000-000000000043' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000043',
      caseId: case3.id,
      productType: 'Tarjeta de crédito castigada',
      originalAmount: 300000.0,
      currentBalance: 250000.0,
      interestRate: 1.5,
    },
  });
  console.log('Case products created');

  // ── Documents ──
  const docsCase1 = [
    { name: 'Contrato', status: 'complete' },
    { name: 'Cesión de cartera', status: 'complete' },
    { name: 'Estado de cuenta', status: 'complete' },
    { name: 'Pagaré', status: 'missing' },
  ];
  for (let i = 0; i < docsCase1.length; i++) {
    await prisma.document.upsert({
      where: { id: `00000000-0000-0000-0000-00000000005${i + 1}` },
      update: {},
      create: {
        id: `00000000-0000-0000-0000-00000000005${i + 1}`,
        caseId: case1.id,
        uploadedBy: adminUser.id,
        filename: `${docsCase1[i].name}.pdf`,
        filePath: `/documents/${case1.id}/${docsCase1[i].name}.pdf`,
        fileHash: 'sha256-stub-hash',
        mimeType: 'application/pdf',
        sizeBytes: 102400,
      },
    });
  }

  const docsCase2 = [
    { name: 'Contrato', status: 'complete' },
    { name: 'Cesión de cartera', status: 'pending' },
    { name: 'Pagaré', status: 'missing' },
  ];
  for (let i = 0; i < docsCase2.length; i++) {
    await prisma.document.upsert({
      where: { id: `00000000-0000-0000-0000-00000000006${i + 1}` },
      update: {},
      create: {
        id: `00000000-0000-0000-0000-00000000006${i + 1}`,
        caseId: case2.id,
        uploadedBy: adminUser.id,
        filename: `${docsCase2[i].name}.pdf`,
        filePath: `/documents/${case2.id}/${docsCase2[i].name}.pdf`,
        fileHash: 'sha256-stub-hash',
        mimeType: 'application/pdf',
        sizeBytes: 102400,
      },
    });
  }

  const docsCase3 = [
    { name: 'Contrato', status: 'complete' },
    { name: 'Cesión de cartera', status: 'complete' },
    { name: 'Estado de cuenta', status: 'complete' },
    { name: 'Pagaré', status: 'complete' },
  ];
  for (let i = 0; i < docsCase3.length; i++) {
    await prisma.document.upsert({
      where: { id: `00000000-0000-0000-0000-00000000007${i + 1}` },
      update: {},
      create: {
        id: `00000000-0000-0000-0000-00000000007${i + 1}`,
        caseId: case3.id,
        uploadedBy: adminUser.id,
        filename: `${docsCase3[i].name}.pdf`,
        filePath: `/documents/${case3.id}/${docsCase3[i].name}.pdf`,
        fileHash: 'sha256-stub-hash',
        mimeType: 'application/pdf',
        sizeBytes: 102400,
      },
    });
  }
  console.log('Documents created');

  // ── Data Passports ──
  await prisma.dataPassport.upsert({
    where: { id: '00000000-0000-0000-0000-000000000081' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000081',
      caseId: case1.id,
      entityType: 'debtor',
      entityId: debtor1.id,
      fieldName: 'phone',
      sourceType: 'bank',
      sourceReference: 'banco cedente',
      legalBasis: 'Mandato de gestión cobranza judicial',
      allowedUses: ['contact', 'analysis', 'agreement'],
      prohibitedUses: [],
      confidenceScore: 95,
      visibilityRoles: ['ADMIN', 'GESTOR', 'SUPERVISOR'],
      status: 'ACTIVE',
      capturedAt: new Date('2026-06-01'),
    },
  });

  await prisma.dataPassport.upsert({
    where: { id: '00000000-0000-0000-0000-000000000082' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000082',
      caseId: case2.id,
      entityType: 'debtor',
      entityId: debtor2.id,
      fieldName: 'phone',
      sourceType: 'JCE',
      sourceReference: 'consulta administrativa',
      legalBasis: 'Ley 659 sobre actos del estado civil',
      allowedUses: ['validation'],
      prohibitedUses: ['no_contact', 'no_whatsapp', 'no_sms', 'no_email'],
      confidenceScore: 60,
      visibilityRoles: ['ADMIN', 'GESTOR', 'COMPLIANCE'],
      status: 'RESTRICTED',
      capturedAt: new Date('2026-06-01'),
    },
  });

  await prisma.dataPassport.upsert({
    where: { id: '00000000-0000-0000-0000-000000000083' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000083',
      caseId: case3.id,
      entityType: 'debtor',
      entityId: debtor3.id,
      fieldName: 'phone',
      sourceType: 'tercero',
      sourceReference: 'cónyuge',
      legalBasis: 'Mandato de gestión cobranza judicial',
      allowedUses: ['analysis'],
      prohibitedUses: ['no_contact', 'case_disputed', 'no_whatsapp'],
      confidenceScore: 90,
      visibilityRoles: ['ADMIN', 'GESTOR', 'COMPLIANCE'],
      status: 'RESTRICTED',
      capturedAt: new Date('2026-06-01'),
    },
  });
  console.log('Data Passports created');

  // ── Communications (with some blocked for Legal Firewall demo) ──
  await prisma.communication.upsert({
    where: { id: '00000000-0000-0000-0000-000000000091' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000091',
      caseId: case1.id,
      channel: 'EMAIL',
      direction: 'OUTBOUND',
      contentSummary: 'Recordatorio de saldo pendiente',
      status: 'DELIVERED',
      blocked: false,
    },
  });

  await prisma.communication.upsert({
    where: { id: '00000000-0000-0000-0000-000000000092' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000092',
      caseId: case2.id,
      channel: 'WHATSAPP',
      direction: 'OUTBOUND',
      contentSummary: 'BLOQUEADO: Dato JCE sin autorización',
      status: 'BLOCKED',
      blocked: true,
      blockReason: 'Legal Firewall: Teléfono obtenido de JCE sin permiso de contacto comercial. Prohibido por Ley 659.',
    },
  });

  await prisma.communication.upsert({
    where: { id: '00000000-0000-0000-0000-000000000093' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000093',
      caseId: case3.id,
      channel: 'WHATSAPP',
      direction: 'OUTBOUND',
      contentSummary: 'BLOQUEADO: Caso en disputa + tercero no autorizado',
      status: 'BLOCKED',
      blocked: true,
      blockReason: 'Legal Firewall: 1) Caso en disputa. 2) Teléfono pertenece a tercero sin consentimiento.',
    },
  });
  console.log('Communications created');

  // ── Agreements ──
  await prisma.agreement.upsert({
    where: { id: '00000000-0000-0000-0000-000000000101' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000101',
      caseId: case1.id,
      institutionId: institution.id,
      type: 'INSTALLMENTS',
      amount: 100000.0,
      discountPercentage: 20.0,
      installments: 3,
      status: 'ACTIVE',
      createdBy: adminUser.id,
      approvedBy: adminUser.id,
      approvedAt: new Date('2026-06-05'),
    },
  });
  console.log('Agreements created');

  // ── Payments ──
  await prisma.payment.upsert({
    where: { id: '00000000-0000-0000-0000-000000000111' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000111',
      caseId: case1.id,
      agreementId: '00000000-0000-0000-0000-000000000101',
      institutionId: institution.id,
      amount: 33333.0,
      method: 'TRANSFER',
      reference: 'REF-001',
      status: 'RECONCILED',
      reconciledAt: new Date('2026-06-10'),
      reconciledBy: adminUser.id,
    },
  });
  console.log('Payments created');

  // ── Dispute ──
  await prisma.dispute.upsert({
    where: { id: '00000000-0000-0000-0000-000000000121' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000121',
      caseId: case3.id,
      reason: 'Deuda ya saldada según deudor. Presentó comprobante de pago.',
      description: 'El deudor alega que realizó un pago total el 2026-05-15 que no fue registrado.',
      status: 'OPEN',
      openedBy: debtor3.id,
      openedAt: new Date('2026-06-09'),
    },
  });
  console.log('Disputes created');

  console.log('\n✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
