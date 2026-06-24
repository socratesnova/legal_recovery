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
exports.DataPassportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let DataPassportsService = class DataPassportsService {
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
        return this.prisma.dataPassport.findMany({
            where,
            orderBy: { capturedAt: "desc" },
            include: { case: { select: { id: true, caseNumber: true } } },
        });
    }
    async findById(id, user) {
        const passport = await this.prisma.dataPassport.findUnique({
            where: { id },
            include: {
                case: { select: { id: true, caseNumber: true, institutionId: true } },
            },
        });
        if (!passport) {
            throw new common_1.NotFoundException("Data Passport not found");
        }
        this.assertTenant(passport.case.institutionId, user);
        return passport;
    }
    async create(data, user) {
        const caseRecord = await this.prisma.case.findUnique({
            where: { id: data.caseId },
            select: { id: true, institutionId: true },
        });
        if (!caseRecord) {
            throw new common_1.NotFoundException("Case not found");
        }
        this.assertTenant(caseRecord.institutionId, user);
        return this.prisma.dataPassport.create({
            data: {
                caseId: data.caseId,
                entityType: data.entityType,
                entityId: data.entityId,
                fieldName: data.fieldName,
                fieldValueHash: data.fieldValueHash,
                sourceType: data.sourceType,
                sourceReference: data.sourceReference,
                legalBasis: data.legalBasis,
                allowedUses: data.allowedUses,
                prohibitedUses: data.prohibitedUses,
                confidenceScore: data.confidenceScore,
                visibilityRoles: data.visibilityRoles,
                status: data.status ?? client_1.PassportStatus.ACTIVE,
                expirationDate: data.expirationDate
                    ? new Date(data.expirationDate)
                    : undefined,
                lastValidatedAt: new Date(),
            },
            include: { case: { select: { id: true, caseNumber: true } } },
        });
    }
    async update(id, data, user) {
        await this.findById(id, user);
        const updateData = {
            fieldValueHash: data.fieldValueHash,
            sourceReference: data.sourceReference,
            legalBasis: data.legalBasis,
            allowedUses: data.allowedUses,
            prohibitedUses: data.prohibitedUses,
            confidenceScore: data.confidenceScore,
            visibilityRoles: data.visibilityRoles,
            status: data.status,
            expirationDate: data.expirationDate
                ? new Date(data.expirationDate)
                : undefined,
            lastValidatedAt: data.lastValidatedAt
                ? new Date(data.lastValidatedAt)
                : undefined,
        };
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        return this.prisma.dataPassport.update({
            where: { id },
            data: updateData,
            include: { case: { select: { id: true, caseNumber: true } } },
        });
    }
    async revoke(id, user) {
        await this.findById(id, user);
        return this.prisma.dataPassport.update({
            where: { id },
            data: { status: client_1.PassportStatus.BLOCKED },
        });
    }
    async remove(id, user) {
        await this.findById(id, user);
        return this.prisma.dataPassport.delete({ where: { id } });
    }
    assertTenant(institutionId, user) {
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
            institutionId !== user.institutionId) {
            throw new common_1.ForbiddenException("Data Passport does not belong to your institution");
        }
    }
};
exports.DataPassportsService = DataPassportsService;
exports.DataPassportsService = DataPassportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DataPassportsService);
//# sourceMappingURL=data-passports.service.js.map