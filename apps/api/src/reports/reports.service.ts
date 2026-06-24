import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import {
  AuthenticatedUser,
  UserRole,
} from "../common/decorators/current-user.decorator";

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getKpis(user: AuthenticatedUser) {
    const baseWhere = { deletedAt: null } as {
      deletedAt: null;
      institutionId?: string;
    };

    if (user.role !== UserRole.SUPER_ADMIN) {
      if (!user.institutionId) {
        throw new ForbiddenException("User is not assigned to any institution");
      }
      baseWhere.institutionId = user.institutionId;
    }

    const [
      totalCases,
      casesByStatus,
      totalPortfolios,
      totalDebtors,
      totalAgreements,
      totalPaymentsAgg,
      upcomingActions,
    ] = await Promise.all([
      this.prisma.case.count({ where: baseWhere }),
      this.prisma.case.groupBy({
        by: ["status"],
        where: baseWhere,
        _count: { status: true },
      }),
      this.prisma.portfolio.count({ where: baseWhere }),
      this.prisma.debtor.count({ where: { deletedAt: null } }),
      this.prisma.agreement.count({ where: baseWhere }),
      this.prisma.payment.aggregate({
        where: {
          ...baseWhere,
          status: { in: ["VERIFIED", "RECONCILED"] },
        },
        _sum: { amount: true },
      }),
      this.prisma.case.findMany({
        where: {
          ...baseWhere,
          nextActionDate: { gte: new Date() },
        },
        orderBy: { nextActionDate: "asc" },
        take: 10,
        include: {
          debtor: { select: { firstName: true, lastName: true } },
        },
      }),
    ]);

    const casesByStatusMap = casesByStatus.reduce(
      (acc, curr) => {
        acc[curr.status] = curr._count.status;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalCases,
      casesByStatus: casesByStatusMap,
      totalPortfolios,
      totalDebtors,
      totalAgreements,
      totalPaymentsAmount: totalPaymentsAgg._sum.amount || 0,
      upcomingActions: upcomingActions.map((c) => ({
        id: c.id,
        caseNumber: c.caseNumber,
        debtorName: `${c.debtor.firstName} ${c.debtor.lastName}`,
        nextAction: c.nextAction,
        nextActionDate: c.nextActionDate,
      })),
    };
  }
}
