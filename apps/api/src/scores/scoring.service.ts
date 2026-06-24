import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import {
  AuthenticatedUser,
  UserRole,
} from "../common/decorators/current-user.decorator";

export interface ScoreInput {
  status: string;
  totalBalance: number;
  hasIdNumber: boolean;
  documentCount: number;
  productCount: number;
  contactCount: number;
  activeDataPassportCount: number;
  channels: {
    phone: boolean;
    email: boolean;
    whatsappOptIn: boolean;
    address: boolean;
  };
  communicationConsent: boolean;
  paidAmount: number;
  activeAgreement: boolean;
  draftAgreement: boolean;
  activeDispute: boolean;
  pendingOrBrokenPromise: boolean;
}

export interface ScoreResult {
  scoreDocumental: number;
  scoreRecoverability: number;
  scoreContactability: number;
  scoreRisk: number;
  nextBestAction: string;
}

const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(n)));

/**
 * Pure scoring logic. Decoupled from Prisma so it can be unit-tested directly.
 * Scores are 0-100. `scoreRisk` is higher when the case is riskier to recover.
 */
export function computeScores(input: ScoreInput): ScoreResult {
  const scoreDocumental = computeDocumental(input);
  const scoreRecoverability = computeRecoverability(input);
  const scoreContactability = computeContactability(input);
  const scoreRisk = computeRisk(input, scoreRecoverability);
  const nextBestAction = decideNextBestAction(
    input,
    scoreRecoverability,
    scoreContactability,
    scoreDocumental,
  );

  return {
    scoreDocumental,
    scoreRecoverability,
    scoreContactability,
    scoreRisk,
    nextBestAction,
  };
}

function computeDocumental(i: ScoreInput): number {
  let s = 0;
  if (i.hasIdNumber) s += 20;
  if (i.documentCount >= 1) s += 20;
  if (i.documentCount >= 3) s += 15;
  if (i.productCount >= 1) s += 20;
  if (i.contactCount >= 1) s += 15;
  if (i.activeDataPassportCount >= 1) s += 10;
  return clamp(s);
}

function computeContactability(i: ScoreInput): number {
  let s = 0;
  if (i.channels.phone) s += 30;
  if (i.channels.email) s += 25;
  if (i.channels.whatsappOptIn) s += 25;
  if (i.channels.address) s += 15;
  if (i.communicationConsent) s += 15;
  return clamp(s);
}

function computeRecoverability(i: ScoreInput): number {
  if (i.status === "DISPUTED" || i.status === "BLOCKED") return 5;
  let s = 0;
  const ratio =
    i.totalBalance > 0
      ? Math.min(i.paidAmount / i.totalBalance, 1)
      : i.paidAmount > 0
        ? 1
        : 0;
  s += ratio * 50;
  if (i.activeAgreement) s += 20;
  if (i.paidAmount > 0) s += 10;
  if (!i.activeDispute) s += 15;
  if (i.activeDispute) s = Math.min(s, 15);
  return clamp(s);
}

function computeRisk(i: ScoreInput, scoreRecoverability: number): number {
  let r = (100 - scoreRecoverability) * 0.5;
  if (i.activeDispute) r += 20;
  if (i.contactCount === 0) r += 15;
  if (i.paidAmount === 0) r += 10;
  if (i.totalBalance > 100000) r += 5;
  return clamp(r);
}

function decideNextBestAction(
  i: ScoreInput,
  recoverability: number,
  contactability: number,
  documental: number,
): string {
  if (i.status === "BLOCKED") {
    return "Caso bloqueado: revisar restricciones legales antes de cualquier acción.";
  }
  if (i.status === "DISPUTED" || i.activeDispute) {
    return "Resolver la disputa abierta antes de contactar al deudor.";
  }
  if (contactability < 30) {
    return "Actualizar y validar los datos de contacto del deudor.";
  }
  if (documental < 40) {
    return "Solicitar y cargar la documentación faltante del caso.";
  }
  if (i.draftAgreement) {
    return "Revisar y aprobar el acuerdo propuesto (en borrador).";
  }
  if (i.pendingOrBrokenPromise) {
    return "Registrar la gestión de incumplimiento de la promesa de pago.";
  }
  if (i.activeAgreement && recoverability > 60) {
    return "Confirmar y dar seguimiento al próximo pago acordado.";
  }
  if (recoverability < 20 && i.totalBalance > 0) {
    return "Evaluar una oferta de quita o refinanciamiento.";
  }
  return "Iniciar la gestión de contacto por el canal permitido más directo.";
}

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);

  constructor(private prisma: PrismaService) {}

  /** Recalculate scores for a case, persist them, and return the result. */
  async scoreCase(
    caseId: string,
    user: AuthenticatedUser,
  ): Promise<ScoreResult & { caseId: string; computedAt: Date }> {
    const record = await this.loadCase(caseId, user);
    const input = this.toScoreInput(record);
    const result = computeScores(input);

    await this.prisma.case.update({
      where: { id: caseId },
      data: {
        scoreDocumental: result.scoreDocumental,
        scoreRecoverability: result.scoreRecoverability,
        scoreContactability: result.scoreContactability,
        scoreRisk: result.scoreRisk,
        nextAction: result.nextBestAction,
      },
    });

    this.logger.log(
      `Case ${caseId} scored: D=${result.scoreDocumental} R=${result.scoreRecoverability} C=${result.scoreContactability} Risk=${result.scoreRisk}`,
    );
    return { caseId, computedAt: new Date(), ...result };
  }

  /** Return the previously-persisted scores (without recalculating). */
  async getScores(caseId: string, user: AuthenticatedUser) {
    const record = await this.loadCase(caseId, user, { minimal: true });
    return {
      caseId,
      scoreDocumental: record.scoreDocumental,
      scoreRecoverability: record.scoreRecoverability,
      scoreContactability: record.scoreContactability,
      scoreRisk: record.scoreRisk,
      nextAction: record.nextAction,
    };
  }

  private async loadCase(
    caseId: string,
    user: AuthenticatedUser,
    opts: { minimal?: boolean } = {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const include = opts.minimal
      ? undefined
      : {
          debtor: {
            include: {
              contacts: { where: { deletedAt: null } },
              consents: true,
            },
          },
          products: { select: { id: true } },
          documents: { where: { deletedAt: null }, select: { id: true } },
          agreements: {
            where: { deletedAt: null },
            include: {
              promises: { select: { status: true, promisedDate: true } },
            },
          },
          payments: {
            where: { deletedAt: null },
            select: { amount: true, status: true, reconciledAt: true },
          },
          disputes: { select: { status: true } },
          dataPassports: {
            where: { status: "ACTIVE" },
            select: { id: true, expirationDate: true },
          },
        };

    const record = await this.prisma.case.findUnique({
      where: { id: caseId },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      include: include as any,
    });

    if (!record || record.deletedAt) {
      throw new NotFoundException("Case not found");
    }
    if (
      user.role !== UserRole.SUPER_ADMIN &&
      record.institutionId !== user.institutionId
    ) {
      throw new ForbiddenException("Case does not belong to your institution");
    }
    return record;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toScoreInput(record: any): ScoreInput {
    const now = Date.now();
    const debtor = record.debtor ?? {};
    const contacts: { channel: string; optIn: boolean }[] =
      debtor.contacts ?? [];
    const consents: {
      type: string;
      granted: boolean;
      revokedAt: Date | null;
    }[] = debtor.consents ?? [];
    const agreements: {
      status: string;
      promises: { status: string; promisedDate: Date }[];
    }[] = record.agreements ?? [];
    const payments: {
      amount: unknown;
      status: string;
      reconciledAt: Date | null;
    }[] = record.payments ?? [];
    const disputes: { status: string }[] = record.disputes ?? [];
    const passports: { expirationDate: Date | null }[] =
      record.dataPassports ?? [];

    const paidAmount = payments
      .filter(
        (p) =>
          p.status === "VERIFIED" ||
          p.status === "RECONCILED" ||
          p.reconciledAt !== null,
      )
      .reduce((sum, p) => sum + Number(p.amount ?? 0), 0);

    const activeDataPassportCount = passports.filter(
      (p) => !p.expirationDate || new Date(p.expirationDate).getTime() > now,
    ).length;

    const pendingOrBrokenPromise = agreements.some((a) =>
      a.promises.some(
        (pr) =>
          pr.status === "BROKEN" ||
          (pr.status === "PENDING" &&
            new Date(pr.promisedDate).getTime() < now),
      ),
    );

    return {
      status: record.status,
      totalBalance: Number(record.totalBalance ?? 0),
      hasIdNumber: !!debtor.idNumber,
      documentCount: record.documents?.length ?? 0,
      productCount: record.products?.length ?? 0,
      contactCount: contacts.length,
      activeDataPassportCount,
      channels: {
        phone: contacts.some((c) => c.channel === "PHONE"),
        email: contacts.some((c) => c.channel === "EMAIL"),
        whatsappOptIn: contacts.some(
          (c) => c.channel === "WHATSAPP" && c.optIn,
        ),
        address: contacts.some((c) => c.channel === "ADDRESS"),
      },
      communicationConsent: consents.some(
        (c) => c.type === "COMMUNICATION" && c.granted && !c.revokedAt,
      ),
      paidAmount,
      activeAgreement: agreements.some((a) =>
        ["APPROVED", "ACTIVE", "COMPLETED"].includes(a.status),
      ),
      draftAgreement: agreements.some((a) =>
        ["DRAFT", "PENDING_APPROVAL"].includes(a.status),
      ),
      activeDispute: disputes.some((d) =>
        ["OPEN", "UNDER_REVIEW", "ESCALATED"].includes(d.status),
      ),
      pendingOrBrokenPromise,
    };
  }
}
