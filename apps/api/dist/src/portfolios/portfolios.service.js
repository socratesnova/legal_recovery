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
exports.PortfoliosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let PortfoliosService = class PortfoliosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(user) {
        const where = { deletedAt: null };
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN) {
            if (!user.institutionId) {
                throw new common_1.ForbiddenException("User is not assigned to any institution");
            }
            where.institutionId = user.institutionId;
        }
        return this.prisma.portfolio.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                institution: { select: { id: true, name: true } },
                rules: true,
                _count: {
                    select: { cases: true },
                },
            },
        });
    }
    async findById(id, user) {
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id },
            include: {
                institution: true,
                rules: true,
                cases: {
                    where: { deletedAt: null },
                    include: {
                        debtor: true,
                        products: true,
                    },
                },
            },
        });
        if (!portfolio || portfolio.deletedAt) {
            throw new common_1.NotFoundException("Portfolio not found");
        }
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
            portfolio.institutionId !== user.institutionId) {
            throw new common_1.ForbiddenException("Portfolio does not belong to your institution");
        }
        return portfolio;
    }
    async create(data, user) {
        const institutionId = user.role === current_user_decorator_1.UserRole.SUPER_ADMIN
            ? data.institutionId
            : user.institutionId;
        if (!institutionId) {
            throw new common_1.ForbiddenException("Institution is required to create a portfolio");
        }
        return this.prisma.portfolio.create({
            data: {
                name: data.name,
                institutionId,
                type: data.type,
                totalAmount: data.totalAmount,
                currency: data.currency || "DOP",
                fileSource: data.fileSource,
                uploadDate: data.uploadDate ? new Date(data.uploadDate) : new Date(),
                status: data.status || "ACTIVE",
            },
            include: {
                institution: { select: { id: true, name: true } },
                rules: true,
            },
        });
    }
    async update(id, data, user) {
        await this.findById(id, user);
        const updateData = {
            name: data.name,
            type: data.type,
            totalAmount: data.totalAmount,
            currency: data.currency,
            fileSource: data.fileSource,
            uploadDate: data.uploadDate ? new Date(data.uploadDate) : undefined,
            status: data.status,
        };
        if (user.role === current_user_decorator_1.UserRole.SUPER_ADMIN && data.institutionId) {
            updateData.institutionId = data.institutionId;
        }
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        return this.prisma.portfolio.update({
            where: { id },
            data: updateData,
            include: {
                institution: { select: { id: true, name: true } },
                rules: true,
            },
        });
    }
    async remove(id, user) {
        await this.findById(id, user);
        return this.prisma.portfolio.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.PortfoliosService = PortfoliosService;
exports.PortfoliosService = PortfoliosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PortfoliosService);
//# sourceMappingURL=portfolios.service.js.map