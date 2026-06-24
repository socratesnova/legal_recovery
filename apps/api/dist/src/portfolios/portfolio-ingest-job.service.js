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
exports.PortfolioIngestJobService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let PortfolioIngestJobService = class PortfolioIngestJobService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    createPending(input) {
        return this.prisma.portfolioIngestJob.create({
            data: { ...input, status: "PENDING" },
        });
    }
    markRunning(id) {
        return this.prisma.portfolioIngestJob.update({
            where: { id },
            data: { status: "RUNNING" },
        });
    }
    markSucceeded(id, summary) {
        return this.prisma.portfolioIngestJob.update({
            where: { id },
            data: {
                status: "SUCCEEDED",
                rowsProcessed: summary.rowsProcessed,
                casesCreated: summary.casesCreated,
                debtorsCreated: summary.debtorsCreated,
                debtorsReused: summary.debtorsReused,
                skipped: summary.skipped,
                errors: summary.errors,
                finishedAt: new Date(),
                errorMessage: null,
            },
        });
    }
    markFailed(id, error) {
        return this.prisma.portfolioIngestJob.update({
            where: { id },
            data: {
                status: "FAILED",
                errorMessage: error?.message ?? "unknown error",
                finishedAt: new Date(),
            },
        });
    }
    async findByPortfolio(portfolioId, user) {
        const where = {
            portfolioId,
        };
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN) {
            if (!user.institutionId) {
                throw new common_1.ForbiddenException("User is not assigned to any institution");
            }
            where.institutionId = user.institutionId;
        }
        return this.prisma.portfolioIngestJob.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
    }
    async findOne(portfolioId, jobId, user) {
        const job = await this.prisma.portfolioIngestJob.findUnique({
            where: { id: jobId },
        });
        if (!job || job.portfolioId !== portfolioId) {
            throw new common_1.NotFoundException("Ingest job not found");
        }
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
            job.institutionId !== user.institutionId) {
            throw new common_1.ForbiddenException("Ingest job does not belong to your institution");
        }
        return job;
    }
};
exports.PortfolioIngestJobService = PortfolioIngestJobService;
exports.PortfolioIngestJobService = PortfolioIngestJobService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PortfolioIngestJobService);
//# sourceMappingURL=portfolio-ingest-job.service.js.map