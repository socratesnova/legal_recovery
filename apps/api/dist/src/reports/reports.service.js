"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getKpis(user) {
        const baseWhere = { deletedAt: null };
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN) {
            if (!user.institutionId) {
                throw new common_1.ForbiddenException("User is not assigned to any institution");
            }
            baseWhere.institutionId = user.institutionId;
        }
        const [totalCases, casesByStatus, totalPortfolios, totalDebtors, totalAgreements, totalPaymentsAgg, upcomingActions,] = await Promise.all([
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
        const casesByStatusMap = casesByStatus.reduce((acc, curr) => {
            acc[curr.status] = curr._count.status;
            return acc;
        }, {});
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map