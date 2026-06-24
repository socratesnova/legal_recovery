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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let AuditService = class AuditService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query, user) {
        const where = {};
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN) {
            if (!user.institutionId) {
                throw new common_1.ForbiddenException("User is not assigned to any institution");
            }
            where.institutionId = user.institutionId;
        }
        else if (query.institutionId) {
            where.institutionId = query.institutionId;
        }
        if (query.action)
            where.action = query.action;
        if (query.entityType)
            where.entityType = query.entityType;
        if (query.entityId)
            where.entityId = query.entityId;
        if (query.userId)
            where.userId = query.userId;
        if (query.from || query.to) {
            where.createdAt = {};
            if (query.from)
                where.createdAt.gte = new Date(query.from);
            if (query.to)
                where.createdAt.lte = new Date(query.to);
        }
        const take = query.take ?? 50;
        const skip = query.skip ?? 0;
        const [items, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take,
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        return { items, total, skip, take };
    }
    async findById(id, user) {
        const entry = await this.prisma.auditLog.findUnique({ where: { id } });
        if (!entry) {
            throw new common_1.NotFoundException("Audit log entry not found");
        }
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
            entry.institutionId !== user.institutionId) {
            throw new common_1.ForbiddenException("Audit entry does not belong to your institution");
        }
        return entry;
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map