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
exports.PortfolioRulesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const rule_evaluation_1 = require("./rule-evaluation");
function num(value) {
    if (value == null)
        return null;
    return Number(value);
}
let PortfolioRulesService = class PortfolioRulesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getEffectiveRules(institutionId, portfolioId) {
        const [institution, portfolioRule] = await Promise.all([
            this.prisma.institution.findUnique({
                where: { id: institutionId },
                select: {
                    maxDiscountAuto: true,
                    maxDiscountManual: true,
                    minInstallments: true,
                    maxInstallments: true,
                    autoApprovalLimit: true,
                },
            }),
            this.prisma.portfolioRule.findUnique({
                where: { portfolioId },
            }),
        ]);
        const institutionRules = institution
            ? {
                maxDiscountAuto: num(institution.maxDiscountAuto),
                maxDiscountManual: num(institution.maxDiscountManual),
                minInstallments: num(institution.minInstallments),
                maxInstallments: num(institution.maxInstallments),
                autoApprovalLimit: num(institution.autoApprovalLimit),
            }
            : null;
        const portfolioRules = portfolioRule
            ? {
                discountMax: num(portfolioRule.discountMax),
                minInstallments: num(portfolioRule.minInstallments),
                maxInstallments: num(portfolioRule.maxInstallments),
                autoApprovalLimit: num(portfolioRule.autoApprovalLimit),
                channelsAllowed: portfolioRule.channelsAllowed ?? null,
            }
            : null;
        return (0, rule_evaluation_1.mergeRules)(institutionRules, portfolioRules);
    }
    async getForPortfolio(portfolioId, user) {
        await this.assertPortfolioInTenant(portfolioId, user);
        return this.prisma.portfolioRule.findUnique({
            where: { portfolioId },
        });
    }
    async upsertForPortfolio(portfolioId, data, user) {
        await this.assertPortfolioInTenant(portfolioId, user);
        const payload = {};
        if (data.discountMax !== undefined)
            payload.discountMax = data.discountMax;
        if (data.minInstallments !== undefined)
            payload.minInstallments = data.minInstallments;
        if (data.maxInstallments !== undefined)
            payload.maxInstallments = data.maxInstallments;
        if (data.autoApprovalLimit !== undefined)
            payload.autoApprovalLimit = data.autoApprovalLimit;
        if (data.channelsAllowed !== undefined)
            payload.channelsAllowed = data.channelsAllowed;
        return this.prisma.portfolioRule.upsert({
            where: { portfolioId },
            create: { portfolioId, ...payload },
            update: payload,
        });
    }
    async assertPortfolioInTenant(portfolioId, user) {
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id: portfolioId },
            select: { id: true, institutionId: true, deletedAt: true },
        });
        if (!portfolio || portfolio.deletedAt) {
            throw new common_1.NotFoundException("Portfolio not found");
        }
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
            portfolio.institutionId !== user.institutionId) {
            throw new common_1.ForbiddenException("Portfolio does not belong to your institution");
        }
    }
};
exports.PortfolioRulesService = PortfolioRulesService;
exports.PortfolioRulesService = PortfolioRulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PortfolioRulesService);
//# sourceMappingURL=portfolio-rules.service.js.map