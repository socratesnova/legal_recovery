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
exports.AgreementsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const agreements_service_1 = require("./agreements.service");
const create_agreement_dto_1 = require("./dto/create-agreement.dto");
const update_agreement_dto_1 = require("./dto/update-agreement.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let AgreementsController = class AgreementsController {
    constructor(agreementsService) {
        this.agreementsService = agreementsService;
    }
    findAll(caseId, user) {
        return this.agreementsService.findAll(caseId, user);
    }
    findById(id, user) {
        return this.agreementsService.findById(id, user);
    }
    create(data, user) {
        return this.agreementsService.create(data, user);
    }
    update(id, data, user) {
        return this.agreementsService.update(id, data, user);
    }
    approve(id, user) {
        return this.agreementsService.approve(id, user);
    }
    remove(id, user) {
        return this.agreementsService.remove(id, user);
    }
};
exports.AgreementsController = AgreementsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List agreements" }),
    (0, swagger_1.ApiQuery)({ name: "caseId", required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "List of agreements returned" }),
    __param(0, (0, common_1.Query)("caseId")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AgreementsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a single agreement by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Agreement returned" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Agreement not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AgreementsController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.GESTOR),
    (0, swagger_1.ApiOperation)({ summary: "Create a new agreement" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Agreement created" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_agreement_dto_1.CreateAgreementDto, Object]),
    __metadata("design:returntype", void 0)
], AgreementsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.GESTOR),
    (0, swagger_1.ApiOperation)({ summary: "Update an agreement" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Agreement updated" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Agreement not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_agreement_dto_1.UpdateAgreementDto, Object]),
    __metadata("design:returntype", void 0)
], AgreementsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(":id/approve"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Approve an agreement" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Agreement approved" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Agreement not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AgreementsController.prototype, "approve", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Soft-delete an agreement" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Agreement soft-deleted" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Agreement not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AgreementsController.prototype, "remove", null);
exports.AgreementsController = AgreementsController = __decorate([
    (0, swagger_1.ApiTags)("Agreements"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)("v1/agreements"),
    __metadata("design:paramtypes", [agreements_service_1.AgreementsService])
], AgreementsController);
//# sourceMappingURL=agreements.controller.js.map