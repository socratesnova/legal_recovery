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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfoliosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const portfolios_service_1 = require("./portfolios.service");
const portfolio_ingest_service_1 = require("./portfolio-ingest.service");
const portfolio_ingest_producer_1 = require("./portfolio-ingest.producer");
const portfolio_ingest_job_service_1 = require("./portfolio-ingest-job.service");
const portfolio_rules_service_1 = require("../rules/portfolio-rules.service");
const upsert_portfolio_rule_dto_1 = require("../rules/dto/upsert-portfolio-rule.dto");
const create_portfolio_dto_1 = require("./dto/create-portfolio.dto");
const update_portfolio_dto_1 = require("./dto/update-portfolio.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const UPLOAD_MAX_BYTES = Number(process.env.UPLOAD_MAX_BYTES ?? 50 * 1024 * 1024);
let PortfoliosController = class PortfoliosController {
    constructor(portfoliosService, ingestService, ingestProducer, ingestJobs, rulesService) {
        this.portfoliosService = portfoliosService;
        this.ingestService = ingestService;
        this.ingestProducer = ingestProducer;
        this.ingestJobs = ingestJobs;
        this.rulesService = rulesService;
    }
    findAll(user) {
        return this.portfoliosService.findAll(user);
    }
    findById(id, user) {
        return this.portfoliosService.findById(id, user);
    }
    create(data, user) {
        return this.portfoliosService.create(data, user);
    }
    upload(id, file, user) {
        if (!file) {
            throw new common_1.BadRequestException("File is required");
        }
        return this.ingestService.ingest(file, id, user);
    }
    ingestAsync(id, file, user) {
        if (!file) {
            throw new common_1.BadRequestException("File is required");
        }
        return this.ingestProducer.enqueue(file, id, user);
    }
    listIngestJobs(id, user) {
        return this.ingestJobs.findByPortfolio(id, user);
    }
    getIngestJob(id, jobId, user) {
        return this.ingestJobs.findOne(id, jobId, user);
    }
    getRules(id, user) {
        return this.rulesService.getForPortfolio(id, user);
    }
    upsertRules(id, data, user) {
        return this.rulesService.upsertForPortfolio(id, data, user);
    }
    update(id, data, user) {
        return this.portfoliosService.update(id, data, user);
    }
    remove(id, user) {
        return this.portfoliosService.remove(id, user);
    }
};
exports.PortfoliosController = PortfoliosController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List all portfolios" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "List of portfolios returned" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a single portfolio by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Portfolio returned" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Portfolio not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Create a new portfolio" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Portfolio created" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_portfolio_dto_1.CreatePortfolioDto, Object]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(":id/upload"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Upload and ingest a portfolio file (CSV/XLSX)" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: { file: { type: "string", format: "binary" } },
            required: ["file"],
        },
    }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Ingest summary returned" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Missing file or unparseable file" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Portfolio not found" }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        limits: { fileSize: UPLOAD_MAX_BYTES },
    })),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "upload", null);
__decorate([
    (0, common_1.Post)(":id/ingest-async"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN),
    (0, common_1.HttpCode)(202),
    (0, swagger_1.ApiOperation)({
        summary: "Upload a portfolio file for async ingest (large files)",
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: { file: { type: "string", format: "binary" } },
            required: ["file"],
        },
    }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({
        status: 202,
        description: "Ingest job accepted; returns jobId to poll",
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Missing file" }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Portfolio belongs to another institution",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Portfolio not found" }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        limits: { fileSize: UPLOAD_MAX_BYTES },
    })),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "ingestAsync", null);
__decorate([
    (0, common_1.Get)(":id/ingest-jobs"),
    (0, swagger_1.ApiOperation)({ summary: "List async ingest jobs for a portfolio" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "List of ingest jobs returned" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "listIngestJobs", null);
__decorate([
    (0, common_1.Get)(":id/ingest-jobs/:jobId"),
    (0, swagger_1.ApiOperation)({ summary: "Get the status of an async ingest job" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiParam)({ name: "jobId", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Ingest job returned" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Ingest job not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("jobId")),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "getIngestJob", null);
__decorate([
    (0, common_1.Get)(":id/rules"),
    (0, swagger_1.ApiOperation)({ summary: "Get the rules configured for a portfolio" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Portfolio rules returned (or null)",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Portfolio not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "getRules", null);
__decorate([
    (0, common_1.Put)(":id/rules"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Create or update the rules for a portfolio" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Portfolio rules upserted" }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Portfolio belongs to another institution",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Portfolio not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, upsert_portfolio_rule_dto_1.UpsertPortfolioRuleDto, Object]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "upsertRules", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Update an existing portfolio" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Portfolio updated" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Portfolio not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_portfolio_dto_1.UpdatePortfolioDto, Object]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Soft-delete a portfolio" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Portfolio soft-deleted" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Portfolio not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PortfoliosController.prototype, "remove", null);
exports.PortfoliosController = PortfoliosController = __decorate([
    (0, swagger_1.ApiTags)("Portfolios"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)("v1/portfolios"),
    __metadata("design:paramtypes", [portfolios_service_1.PortfoliosService,
        portfolio_ingest_service_1.PortfolioIngestService,
        portfolio_ingest_producer_1.PortfolioIngestProducer,
        portfolio_ingest_job_service_1.PortfolioIngestJobService,
        portfolio_rules_service_1.PortfolioRulesService])
], PortfoliosController);
//# sourceMappingURL=portfolios.controller.js.map