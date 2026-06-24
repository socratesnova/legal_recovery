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
exports.ConsentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const consents_service_1 = require("./consents.service");
const grant_consent_dto_1 = require("./dto/grant-consent.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ConsentsController = class ConsentsController {
    constructor(service) {
        this.service = service;
    }
    findAll(debtorId, user) {
        return this.service.findAll(debtorId, user);
    }
    findByDebtor(debtorId, user) {
        return this.service.findByDebtor(debtorId, user);
    }
    findById(id, user) {
        return this.service.findById(id, user);
    }
    grant(data, user) {
        return this.service.grant(data, user);
    }
    revoke(id, user) {
        return this.service.revoke(id, user);
    }
    revokeByType(debtorId, type, user) {
        return this.service.revokeByType(debtorId, type, user);
    }
};
exports.ConsentsController = ConsentsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List consents (optionally filtered by debtor)" }),
    (0, swagger_1.ApiQuery)({ name: "debtorId", required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "List of consents" }),
    __param(0, (0, common_1.Query)("debtorId")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConsentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("debtor/:debtorId"),
    (0, swagger_1.ApiOperation)({ summary: "Full consent history for a debtor" }),
    (0, swagger_1.ApiParam)({ name: "debtorId", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Consent history" }),
    __param(0, (0, common_1.Param)("debtorId")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConsentsController.prototype, "findByDebtor", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a single consent by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Consent returned" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Consent not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConsentsController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)("grant"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.COMPLIANCE, roles_decorator_1.Role.GESTOR, roles_decorator_1.Role.ABOGADO),
    (0, swagger_1.ApiOperation)({ summary: "Record a consent grant (opt-in)" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Consent granted" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [grant_consent_dto_1.GrantConsentDto, Object]),
    __metadata("design:returntype", void 0)
], ConsentsController.prototype, "grant", null);
__decorate([
    (0, common_1.Post)(":id/revoke"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.COMPLIANCE),
    (0, swagger_1.ApiOperation)({
        summary: "Revoke a consent by ID (appends a revocation row)",
    }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Consent revoked" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConsentsController.prototype, "revoke", null);
__decorate([
    (0, common_1.Post)("debtor/:debtorId/revoke"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.COMPLIANCE),
    (0, swagger_1.ApiOperation)({ summary: "Revoke the active consent of a type for a debtor" }),
    (0, swagger_1.ApiParam)({ name: "debtorId", type: String }),
    (0, swagger_1.ApiQuery)({ name: "type", required: true, enum: client_1.ConsentType }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Consent revoked" }),
    __param(0, (0, common_1.Param)("debtorId")),
    __param(1, (0, common_1.Query)("type")),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ConsentsController.prototype, "revokeByType", null);
exports.ConsentsController = ConsentsController = __decorate([
    (0, swagger_1.ApiTags)("Consents"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)("v1/consents"),
    __metadata("design:paramtypes", [consents_service_1.ConsentsService])
], ConsentsController);
//# sourceMappingURL=consents.controller.js.map