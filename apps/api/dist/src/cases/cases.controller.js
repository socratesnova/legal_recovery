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
exports.CasesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cases_service_1 = require("./cases.service");
const create_case_dto_1 = require("./dto/create-case.dto");
const update_case_dto_1 = require("./dto/update-case.dto");
const filter_case_dto_1 = require("./dto/filter-case.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let CasesController = class CasesController {
    constructor(casesService) {
        this.casesService = casesService;
    }
    findAll(filter, user) {
        return this.casesService.findAll(filter, user);
    }
    findById(id, user) {
        return this.casesService.findById(id, user);
    }
    create(data, user) {
        return this.casesService.create(data, user);
    }
    update(id, data, user) {
        return this.casesService.update(id, data, user);
    }
    remove(id, user) {
        return this.casesService.remove(id, user);
    }
};
exports.CasesController = CasesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List cases with optional filters" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "List of cases returned" }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_case_dto_1.CaseFilterDto, Object]),
    __metadata("design:returntype", void 0)
], CasesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a single case by ID with full relations" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Case returned" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Case not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CasesController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.GESTOR),
    (0, swagger_1.ApiOperation)({ summary: "Create a new case" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Case created" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_case_dto_1.CreateCaseDto, Object]),
    __metadata("design:returntype", void 0)
], CasesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.GESTOR),
    (0, swagger_1.ApiOperation)({ summary: "Update an existing case" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Case updated" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Case not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_case_dto_1.UpdateCaseDto, Object]),
    __metadata("design:returntype", void 0)
], CasesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Soft-delete a case" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Case soft-deleted" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Case not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CasesController.prototype, "remove", null);
exports.CasesController = CasesController = __decorate([
    (0, swagger_1.ApiTags)("Cases"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)("v1/cases"),
    __metadata("design:paramtypes", [cases_service_1.CasesService])
], CasesController);
//# sourceMappingURL=cases.controller.js.map