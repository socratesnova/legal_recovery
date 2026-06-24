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
exports.ConsentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ConsentsService = class ConsentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(debtorId, user) {
        if (debtorId) {
            await this.assertDebtorInTenant(debtorId, user);
            return this.prisma.consent.findMany({
                where: { debtorId },
                orderBy: { createdAt: "desc" },
            });
        }
        if (user.role === current_user_decorator_1.UserRole.SUPER_ADMIN) {
            return this.prisma.consent.findMany({ orderBy: { createdAt: "desc" } });
        }
        const debtorIds = await this.getTenantDebtorIds(user);
        return this.prisma.consent.findMany({
            where: { debtorId: { in: debtorIds } },
            orderBy: { createdAt: "desc" },
        });
    }
    async findByDebtor(debtorId, user) {
        await this.assertDebtorInTenant(debtorId, user);
        return this.prisma.consent.findMany({
            where: { debtorId },
            orderBy: { createdAt: "desc" },
        });
    }
    async findById(id, user) {
        const consent = await this.prisma.consent.findUnique({ where: { id } });
        if (!consent) {
            throw new common_1.NotFoundException("Consent not found");
        }
        await this.assertDebtorInTenant(consent.debtorId, user);
        return consent;
    }
    async grant(dto, user) {
        await this.assertDebtorInTenant(dto.debtorId, user);
        return this.prisma.consent.create({
            data: {
                debtorId: dto.debtorId,
                type: dto.type,
                granted: true,
                grantedAt: new Date(),
                revokedAt: null,
                ipAddress: dto.ipAddress,
                userAgent: dto.userAgent,
            },
        });
    }
    async revoke(id, user) {
        const consent = await this.findById(id, user);
        return this.prisma.consent.create({
            data: {
                debtorId: consent.debtorId,
                type: consent.type,
                granted: false,
                grantedAt: null,
                revokedAt: new Date(),
                ipAddress: undefined,
                userAgent: undefined,
            },
        });
    }
    async revokeByType(debtorId, type, user) {
        await this.assertDebtorInTenant(debtorId, user);
        return this.prisma.consent.create({
            data: {
                debtorId,
                type,
                granted: false,
                grantedAt: null,
                revokedAt: new Date(),
            },
        });
    }
    async getTenantDebtorIds(user) {
        if (!user.institutionId) {
            throw new common_1.ForbiddenException("User is not assigned to any institution");
        }
        const cases = await this.prisma.case.findMany({
            where: { institutionId: user.institutionId, deletedAt: null },
            select: { debtorId: true },
            distinct: ["debtorId"],
        });
        return cases.map((c) => c.debtorId);
    }
    async assertDebtorInTenant(debtorId, user) {
        if (user.role === current_user_decorator_1.UserRole.SUPER_ADMIN)
            return;
        if (!user.institutionId) {
            throw new common_1.ForbiddenException("User is not assigned to any institution");
        }
        const tenantCase = await this.prisma.case.findFirst({
            where: { debtorId, institutionId: user.institutionId, deletedAt: null },
            select: { id: true },
        });
        if (!tenantCase) {
            throw new common_1.ForbiddenException("Debtor does not belong to your institution");
        }
    }
};
exports.ConsentsService = ConsentsService;
exports.ConsentsService = ConsentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConsentsService);
//# sourceMappingURL=consents.service.js.map