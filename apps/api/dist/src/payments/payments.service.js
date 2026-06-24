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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const rule_evaluation_1 = require("../rules/rule-evaluation");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(caseId, user) {
        const where = { deletedAt: null };
        if (caseId)
            where.caseId = caseId;
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN) {
            if (!user.institutionId) {
                throw new common_1.ForbiddenException("User is not assigned to any institution");
            }
            where.institutionId = user.institutionId;
        }
        return this.prisma.payment.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                case: { select: { id: true, caseNumber: true } },
                institution: { select: { id: true, name: true } },
                agreement: { select: { id: true, type: true } },
            },
        });
    }
    async findById(id, user) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
                case: { select: { id: true, caseNumber: true } },
                institution: { select: { id: true, name: true } },
                agreement: { select: { id: true, type: true } },
            },
        });
        if (!payment || payment.deletedAt) {
            throw new common_1.NotFoundException("Payment not found");
        }
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
            payment.institutionId !== user.institutionId) {
            throw new common_1.ForbiddenException("Payment does not belong to your institution");
        }
        return payment;
    }
    async create(data, user) {
        const institutionId = user.role === current_user_decorator_1.UserRole.SUPER_ADMIN
            ? data.institutionId
            : user.institutionId;
        if (!institutionId) {
            throw new common_1.ForbiddenException("Institution is required to create a payment");
        }
        const caseRecord = await this.prisma.case.findUnique({
            where: { id: data.caseId },
            select: { id: true, institutionId: true },
        });
        if (!caseRecord) {
            throw new common_1.NotFoundException("Case not found");
        }
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
            caseRecord.institutionId !== user.institutionId) {
            throw new common_1.ForbiddenException("Case does not belong to your institution");
        }
        if (data.agreementId) {
            const agreement = await this.prisma.agreement.findUnique({
                where: { id: data.agreementId },
                select: { id: true, institutionId: true, status: true },
            });
            if (!agreement) {
                throw new common_1.NotFoundException("Agreement not found");
            }
            if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
                agreement.institutionId !== user.institutionId) {
                throw new common_1.ForbiddenException("Agreement does not belong to your institution");
            }
            if (!(0, rule_evaluation_1.isAgreementActiveForPayment)(agreement.status)) {
                throw new common_1.ConflictException(`Cannot register a payment against an agreement with status ${agreement.status}; it must be approved, active, or completed first.`);
            }
        }
        return this.prisma.payment.create({
            data: {
                caseId: data.caseId,
                institutionId,
                agreementId: data.agreementId,
                amount: data.amount,
                method: data.method,
                reference: data.reference,
                receiptPath: data.receiptPath,
                status: data.status || "PENDING",
            },
            include: {
                case: { select: { id: true, caseNumber: true } },
                institution: { select: { id: true, name: true } },
                agreement: { select: { id: true, type: true } },
            },
        });
    }
    async update(id, data, user) {
        await this.findById(id, user);
        const updateData = {
            amount: data.amount,
            method: data.method,
            reference: data.reference,
            receiptPath: data.receiptPath,
            status: data.status,
            agreementId: data.agreementId,
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
        if (data.agreementId) {
            const agreement = await this.prisma.agreement.findUnique({
                where: { id: data.agreementId },
                select: { id: true, institutionId: true, status: true },
            });
            if (!agreement) {
                throw new common_1.NotFoundException("Target agreement not found");
            }
            if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
                agreement.institutionId !== user.institutionId) {
                throw new common_1.ForbiddenException("Target agreement does not belong to your institution");
            }
            if (!(0, rule_evaluation_1.isAgreementActiveForPayment)(agreement.status)) {
                throw new common_1.ConflictException(`Cannot attach a payment to an agreement with status ${agreement.status}; it must be approved, active, or completed first.`);
            }
        }
        if (user.role === current_user_decorator_1.UserRole.SUPER_ADMIN && data.institutionId) {
            updateData.institutionId = data.institutionId;
        }
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        return this.prisma.payment.update({
            where: { id },
            data: updateData,
            include: {
                case: { select: { id: true, caseNumber: true } },
                institution: { select: { id: true, name: true } },
                agreement: { select: { id: true, type: true } },
            },
        });
    }
    async reconcile(id, user) {
        await this.findById(id, user);
        return this.prisma.payment.update({
            where: { id },
            data: {
                status: "RECONCILED",
                reconciledBy: user.userId,
                reconciledAt: new Date(),
            },
            include: {
                case: { select: { id: true, caseNumber: true } },
                institution: { select: { id: true, name: true } },
            },
        });
    }
    async remove(id, user) {
        await this.findById(id, user);
        return this.prisma.payment.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map