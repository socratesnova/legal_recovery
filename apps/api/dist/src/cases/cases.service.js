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
exports.CasesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let CasesService = class CasesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filter, user) {
        const where = { deletedAt: null };
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN) {
            if (!user.institutionId) {
                throw new common_1.ForbiddenException("User is not assigned to any institution");
            }
            where.institutionId = user.institutionId;
        }
        else if (filter.institutionId) {
            where.institutionId = filter.institutionId;
        }
        if (filter.portfolioId) {
            where.portfolioId = filter.portfolioId;
        }
        if (filter.status) {
            where.status = filter.status;
        }
        if (filter.debtorId) {
            where.debtorId = filter.debtorId;
        }
        if (filter.search) {
            where.OR = [
                { caseNumber: { contains: filter.search, mode: "insensitive" } },
                {
                    debtor: {
                        OR: [
                            { firstName: { contains: filter.search, mode: "insensitive" } },
                            { lastName: { contains: filter.search, mode: "insensitive" } },
                            { idNumber: { contains: filter.search, mode: "insensitive" } },
                        ],
                    },
                },
            ];
        }
        return this.prisma.case.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                debtor: true,
                institution: { select: { id: true, name: true } },
                portfolio: { select: { id: true, name: true } },
                products: true,
                _count: {
                    select: {
                        documents: true,
                        communications: true,
                        agreements: true,
                        payments: true,
                        disputes: true,
                    },
                },
            },
        });
    }
    async findById(id, user) {
        const caseData = await this.prisma.case.findUnique({
            where: { id },
            include: {
                debtor: { include: { contacts: true } },
                institution: true,
                portfolio: { include: { rules: true } },
                products: true,
                documents: { where: { deletedAt: null } },
                communications: { orderBy: { createdAt: "desc" } },
                agreements: { include: { promises: true } },
                payments: true,
                disputes: true,
                dataPassports: true,
            },
        });
        if (!caseData || caseData.deletedAt) {
            throw new common_1.NotFoundException("Case not found");
        }
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
            caseData.institutionId !== user.institutionId) {
            throw new common_1.ForbiddenException("Case does not belong to your institution");
        }
        return caseData;
    }
    async create(data, user) {
        const institutionId = user.role === current_user_decorator_1.UserRole.SUPER_ADMIN
            ? data.institutionId
            : user.institutionId;
        if (!institutionId) {
            throw new common_1.ForbiddenException("Institution is required to create a case");
        }
        let debtorId = data.debtorId;
        if (!debtorId && data.debtor) {
            const existing = await this.prisma.debtor.findFirst({
                where: { idNumber: data.debtor.idNumber },
            });
            if (existing) {
                debtorId = existing.id;
            }
            else {
                const newDebtor = await this.prisma.debtor.create({
                    data: {
                        firstName: data.debtor.firstName,
                        lastName: data.debtor.lastName,
                        idNumber: data.debtor.idNumber,
                        idType: data.debtor.idType || "cedula",
                    },
                });
                debtorId = newDebtor.id;
            }
        }
        if (!debtorId) {
            throw new common_1.BadRequestException("Either debtorId or debtor data is required");
        }
        const caseData = await this.prisma.case.create({
            data: {
                caseNumber: data.caseNumber,
                institutionId,
                portfolioId: data.portfolioId,
                debtorId,
                totalBalance: data.totalBalance,
                status: data.status || "ACTIVE",
                scoreDocumental: data.scoreDocumental,
                scoreRecoverability: data.scoreRecoverability,
                scoreContactability: data.scoreContactability,
                scoreRisk: data.scoreRisk,
                nextAction: data.nextAction,
                nextActionDate: data.nextActionDate
                    ? new Date(data.nextActionDate)
                    : undefined,
                products: data.products
                    ? {
                        create: data.products.map((p) => ({
                            productType: p.productType,
                            originalAmount: p.originalAmount,
                            currentBalance: p.currentBalance,
                            interestRate: p.interestRate,
                        })),
                    }
                    : undefined,
            },
            include: {
                debtor: true,
                products: true,
                institution: { select: { id: true, name: true } },
                portfolio: { select: { id: true, name: true } },
            },
        });
        return caseData;
    }
    async update(id, data, user) {
        await this.findById(id, user);
        const updateData = {
            caseNumber: data.caseNumber,
            totalBalance: data.totalBalance,
            status: data.status,
            scoreDocumental: data.scoreDocumental,
            scoreRecoverability: data.scoreRecoverability,
            scoreContactability: data.scoreContactability,
            scoreRisk: data.scoreRisk,
            nextAction: data.nextAction,
            nextActionDate: data.nextActionDate
                ? new Date(data.nextActionDate)
                : undefined,
        };
        if (user.role === current_user_decorator_1.UserRole.SUPER_ADMIN) {
            if (data.institutionId)
                updateData.institutionId = data.institutionId;
        }
        if (data.portfolioId)
            updateData.portfolioId = data.portfolioId;
        if (data.debtorId)
            updateData.debtorId = data.debtorId;
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        return this.prisma.case.update({
            where: { id },
            data: updateData,
            include: {
                debtor: true,
                products: true,
                institution: { select: { id: true, name: true } },
                portfolio: { select: { id: true, name: true } },
            },
        });
    }
    async remove(id, user) {
        await this.findById(id, user);
        return this.prisma.case.update({
            where: { id },
            data: { deletedAt: new Date(), status: "CLOSED" },
        });
    }
};
exports.CasesService = CasesService;
exports.CasesService = CasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CasesService);
//# sourceMappingURL=cases.service.js.map