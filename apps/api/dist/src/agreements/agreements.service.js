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
exports.AgreementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const portfolio_rules_service_1 = require("../rules/portfolio-rules.service");
const rule_evaluation_1 = require("../rules/rule-evaluation");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let AgreementsService = class AgreementsService {
    constructor(prisma, rulesService) {
        this.prisma = prisma;
        this.rulesService = rulesService;
    }
    async findAll(caseId, user) {
        const where = { deletedAt: null };
        if (caseId) {
            where.caseId = caseId;
        }
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN) {
            if (!user.institutionId) {
                throw new common_1.ForbiddenException("User is not assigned to any institution");
            }
            where.institutionId = user.institutionId;
        }
        return this.prisma.agreement.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                case: { select: { id: true, caseNumber: true } },
                institution: { select: { id: true, name: true } },
                payments: true,
                promises: true,
            },
        });
    }
    async findById(id, user) {
        const agreement = await this.prisma.agreement.findUnique({
            where: { id },
            include: {
                case: { select: { id: true, caseNumber: true } },
                institution: { select: { id: true, name: true } },
                payments: true,
                promises: true,
            },
        });
        if (!agreement || agreement.deletedAt) {
            throw new common_1.NotFoundException("Agreement not found");
        }
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
            agreement.institutionId !== user.institutionId) {
            throw new common_1.ForbiddenException("Agreement does not belong to your institution");
        }
        return agreement;
    }
    async create(data, user) {
        const institutionId = user.role === current_user_decorator_1.UserRole.SUPER_ADMIN
            ? data.institutionId
            : user.institutionId;
        if (!institutionId) {
            throw new common_1.ForbiddenException("Institution is required to create an agreement");
        }
        const caseRecord = await this.prisma.case.findUnique({
            where: { id: data.caseId },
            select: { id: true, institutionId: true, portfolioId: true },
        });
        if (!caseRecord) {
            throw new common_1.NotFoundException("Case not found");
        }
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
            caseRecord.institutionId !== user.institutionId) {
            throw new common_1.ForbiddenException("Case does not belong to your institution");
        }
        const rules = await this.rulesService.getEffectiveRules(institutionId, caseRecord.portfolioId);
        const validation = (0, rule_evaluation_1.validateAgreementAgainstRules)({
            type: data.type,
            amount: data.amount,
            discountPercentage: data.discountPercentage,
            installments: data.installments,
        }, rules);
        if (!validation.ok) {
            throw new common_1.BadRequestException({
                message: "Agreement violates institution rules",
                violations: validation.violations,
            });
        }
        let status = data.status;
        let approvedBy;
        let approvedAt;
        if (!status) {
            if (validation.autoApproved) {
                status = "APPROVED";
                approvedBy = user.userId;
                approvedAt = new Date();
            }
            else {
                status = "PENDING_APPROVAL";
            }
        }
        return this.prisma.agreement.create({
            data: {
                caseId: data.caseId,
                institutionId,
                type: data.type,
                amount: data.amount,
                discountPercentage: data.discountPercentage,
                installments: data.installments,
                status,
                approvedBy: approvedBy ?? null,
                approvedAt: approvedAt ?? null,
                createdBy: user.userId,
            },
            include: {
                case: { select: { id: true, caseNumber: true } },
                institution: { select: { id: true, name: true } },
            },
        });
    }
    async update(id, data, user) {
        await this.findById(id, user);
        const updateData = {
            type: data.type,
            amount: data.amount,
            discountPercentage: data.discountPercentage,
            installments: data.installments,
            status: data.status,
        };
        if (data.caseId) {
            const caseRecord = await this.prisma.case.findUnique({
                where: { id: data.caseId },
                select: { id: true, institutionId: true },
            });
            if (!caseRecord) {
                throw new common_1.NotFoundException("Target case not found");
            }
            if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
                caseRecord.institutionId !== user.institutionId) {
                throw new common_1.ForbiddenException("Target case does not belong to your institution");
            }
            updateData.caseId = data.caseId;
        }
        if (user.role === current_user_decorator_1.UserRole.SUPER_ADMIN && data.institutionId) {
            updateData.institutionId = data.institutionId;
        }
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        return this.prisma.agreement.update({
            where: { id },
            data: updateData,
            include: {
                case: { select: { id: true, caseNumber: true } },
                institution: { select: { id: true, name: true } },
            },
        });
    }
    async approve(id, user) {
        await this.findById(id, user);
        return this.prisma.agreement.update({
            where: { id },
            data: {
                status: "APPROVED",
                approvedBy: user.userId,
                approvedAt: new Date(),
            },
            include: {
                case: { select: { id: true, caseNumber: true } },
                institution: { select: { id: true, name: true } },
            },
        });
    }
    async remove(id, user) {
        await this.findById(id, user);
        return this.prisma.agreement.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.AgreementsService = AgreementsService;
exports.AgreementsService = AgreementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        portfolio_rules_service_1.PortfolioRulesService])
], AgreementsService);
//# sourceMappingURL=agreements.service.js.map