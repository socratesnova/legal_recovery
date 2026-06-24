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
exports.DisputesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let DisputesService = class DisputesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(caseId, user) {
        const where = {};
        if (caseId) {
            where.caseId = caseId;
        }
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN) {
            if (!user.institutionId) {
                throw new common_1.ForbiddenException("User is not assigned to any institution");
            }
            where.case = { institutionId: user.institutionId };
        }
        return this.prisma.dispute.findMany({
            where,
            orderBy: { openedAt: "desc" },
            include: { case: { select: { id: true, caseNumber: true } } },
        });
    }
    async findById(id, user) {
        const dispute = await this.prisma.dispute.findUnique({
            where: { id },
            include: {
                case: { select: { id: true, caseNumber: true, institutionId: true } },
            },
        });
        if (!dispute) {
            throw new common_1.NotFoundException("Dispute not found");
        }
        this.assertTenant(dispute.case.institutionId, user);
        return dispute;
    }
    async open(data, user) {
        const caseRecord = await this.prisma.case.findUnique({
            where: { id: data.caseId },
            select: { id: true, institutionId: true },
        });
        if (!caseRecord) {
            throw new common_1.NotFoundException("Case not found");
        }
        this.assertTenant(caseRecord.institutionId, user);
        return this.prisma.dispute.create({
            data: {
                caseId: data.caseId,
                reason: data.reason,
                description: data.description,
                status: client_1.DisputeStatus.OPEN,
                openedBy: user.userId,
                openedAt: new Date(),
            },
            include: { case: { select: { id: true, caseNumber: true } } },
        });
    }
    async update(id, data, user) {
        await this.findById(id, user);
        const updateData = {
            description: data.description,
            resolution: data.resolution,
        };
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        return this.prisma.dispute.update({
            where: { id },
            data: updateData,
        });
    }
    async escalate(id, user) {
        await this.findById(id, user);
        return this.prisma.dispute.update({
            where: { id },
            data: { status: client_1.DisputeStatus.ESCALATED },
        });
    }
    async resolve(id, data, user) {
        await this.findById(id, user);
        return this.prisma.dispute.update({
            where: { id },
            data: {
                status: client_1.DisputeStatus.RESOLVED,
                resolvedBy: user.userId,
                resolvedAt: new Date(),
                resolution: data.resolution,
            },
        });
    }
    assertTenant(institutionId, user) {
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
            institutionId !== user.institutionId) {
            throw new common_1.ForbiddenException("Dispute does not belong to your institution");
        }
    }
};
exports.DisputesService = DisputesService;
exports.DisputesService = DisputesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DisputesService);
//# sourceMappingURL=disputes.service.js.map