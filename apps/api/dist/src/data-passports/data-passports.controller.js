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
exports.DataPassportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const data_passports_service_1 = require("./data-passports.service");
const create_data_passport_dto_1 = require("./dto/create-data-passport.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let DataPassportsController = class DataPassportsController {
    constructor(service) {
        this.service = service;
    }
    findAll(caseId, user) {
        return this.service.findAll(caseId, user);
    }
    findById(id, user) {
        return this.service.findById(id, user);
    }
    create(data, user) {
        return this.service.create(data, user);
    }
    update(id, data, user) {
        return this.service.update(id, data, user);
    }
    revoke(id, user) {
        return this.service.revoke(id, user);
    }
    remove(id, user) {
        return this.service.remove(id, user);
    }
};
exports.DataPassportsController = DataPassportsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: "List data passports (optionally filtered by case)",
    }),
    (0, swagger_1.ApiQuery)({ name: "caseId", required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "List of data passports" }),
    __param(0, (0, common_1.Query)("caseId")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DataPassportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a single data passport by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Data passport returned" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Data passport not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DataPassportsController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.COMPLIANCE),
    (0, swagger_1.ApiOperation)({ summary: "Register a data passport for a case field" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Data passport created" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_data_passport_dto_1.CreateDataPassportDto, Object]),
    __metadata("design:returntype", void 0)
], DataPassportsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.COMPLIANCE),
    (0, swagger_1.ApiOperation)({ summary: "Update a data passport" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Data passport updated" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_data_passport_dto_1.UpdateDataPassportDto, Object]),
    __metadata("design:returntype", void 0)
], DataPassportsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(":id/revoke"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.COMPLIANCE),
    (0, swagger_1.ApiOperation)({
        summary: "Revoke (block) a data passport, preserving history",
    }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Data passport revoked" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DataPassportsController.prototype, "revoke", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: "Permanently delete a data passport (super admin only)",
    }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Data passport deleted" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DataPassportsController.prototype, "remove", null);
exports.DataPassportsController = DataPassportsController = __decorate([
    (0, swagger_1.ApiTags)("DataPassports"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)("v1/data-passports"),
    __metadata("design:paramtypes", [data_passports_service_1.DataPassportsService])
], DataPassportsController);
//# sourceMappingURL=data-passports.controller.js.map