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
exports.ContactsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ContactsService = class ContactsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(debtorId, user) {
        const where = { deletedAt: null };
        if (debtorId) {
            await this.assertDebtorInTenant(debtorId, user);
            where.debtorId = debtorId;
        }
        else if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN) {
            if (!user.institutionId) {
                throw new common_1.ForbiddenException("User is not assigned to any institution");
            }
            where.debtor = { cases: { some: { institutionId: user.institutionId } } };
        }
        return this.prisma.contact.findMany({
            where,
            orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
        });
    }
    async findById(id, user) {
        const contact = await this.prisma.contact.findUnique({
            where: { id },
        });
        if (!contact || contact.deletedAt) {
            throw new common_1.NotFoundException("Contact not found");
        }
        await this.assertDebtorInTenant(contact.debtorId, user);
        return contact;
    }
    async create(data, user) {
        await this.assertDebtorInTenant(data.debtorId, user);
        if (data.isPrimary) {
            await this.clearExistingPrimary(data.debtorId, data.channel);
        }
        return this.prisma.contact.create({
            data: {
                debtorId: data.debtorId,
                channel: data.channel,
                value: data.value,
                isPrimary: data.isPrimary ?? false,
                optIn: data.optIn ?? false,
                optInDate: data.optInDate ? new Date(data.optInDate) : undefined,
                dataPassportId: data.dataPassportId,
            },
        });
    }
    async update(id, data, user) {
        const existing = await this.findById(id, user);
        if (data.isPrimary) {
            await this.clearExistingPrimary(existing.debtorId, existing.channel, id);
        }
        const updateData = {
            value: data.value,
            isPrimary: data.isPrimary,
            optIn: data.optIn,
            optInDate: data.optInDate ? new Date(data.optInDate) : undefined,
            dataPassportId: data.dataPassportId,
        };
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        return this.prisma.contact.update({ where: { id }, data: updateData });
    }
    async remove(id, user) {
        await this.findById(id, user);
        return this.prisma.contact.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async clearExistingPrimary(debtorId, channel, exceptId) {
        const existing = await this.prisma.contact.findFirst({
            where: { debtorId, channel, isPrimary: true, deletedAt: null },
        });
        if (existing && existing.id !== exceptId) {
            await this.prisma.contact.update({
                where: { id: existing.id },
                data: { isPrimary: false },
            });
        }
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
exports.ContactsService = ContactsService;
exports.ContactsService = ContactsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContactsService);
//# sourceMappingURL=contacts.service.js.map