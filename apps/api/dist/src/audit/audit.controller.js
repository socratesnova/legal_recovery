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
exports.AuditController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const audit_service_1 = require("./audit.service");
const query_audit_dto_1 = require("./dto/query-audit.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let AuditController = class AuditController {
    constructor(service) {
        this.service = service;
    }
    findAll(query, user) {
        return this.service.findAll(query, user);
    }
    findById(id, user) {
        return this.service.findById(id, user);
    }
};
exports.AuditController = AuditController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.COMPLIANCE),
    (0, swagger_1.ApiOperation)({ summary: "Query the immutable audit log (scoped by tenant)" }),
    (0, swagger_1.ApiQuery)({ name: "institutionId", required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: "action", required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: "entityType", required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: "entityId", required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: "userId", required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: "from", required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: "to", required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: "skip", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "take", required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Paginated audit log entries" }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_audit_dto_1.QueryAuditDto, Object]),
    __metadata("design:returntype", void 0)
], AuditController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.COMPLIANCE),
    (0, swagger_1.ApiOperation)({ summary: "Get a single audit log entry by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Audit entry returned" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Audit entry not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AuditController.prototype, "findById", null);
exports.AuditController = AuditController = __decorate([
    (0, swagger_1.ApiTags)("Audit"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)("v1/audit"),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditController);
//# sourceMappingURL=audit.controller.js.map