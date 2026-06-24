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
exports.ScoresController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const scoring_service_1 = require("./scoring.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ScoresController = class ScoresController {
    constructor(scoringService) {
        this.scoringService = scoringService;
    }
    score(caseId, user) {
        return this.scoringService.scoreCase(caseId, user);
    }
    getScores(caseId, user) {
        return this.scoringService.getScores(caseId, user);
    }
};
exports.ScoresController = ScoresController;
__decorate([
    (0, common_1.Post)("case/:caseId"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.SUPERVISOR, roles_decorator_1.Role.GESTOR),
    (0, swagger_1.ApiOperation)({
        summary: "Recalculate scores and Next Best Action for a case",
    }),
    (0, swagger_1.ApiParam)({ name: "caseId", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Scores computed and persisted" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Case not found" }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Case belongs to another institution",
    }),
    __param(0, (0, common_1.Param)("caseId")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "score", null);
__decorate([
    (0, common_1.Get)("case/:caseId"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.SUPERVISOR, roles_decorator_1.Role.GESTOR, roles_decorator_1.Role.ABOGADO, roles_decorator_1.Role.COMPLIANCE),
    (0, swagger_1.ApiOperation)({ summary: "Get the persisted scores for a case" }),
    (0, swagger_1.ApiParam)({ name: "caseId", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Persisted scores returned" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Case not found" }),
    __param(0, (0, common_1.Param)("caseId")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ScoresController.prototype, "getScores", null);
exports.ScoresController = ScoresController = __decorate([
    (0, swagger_1.ApiTags)("Scores"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)("v1/scores"),
    __metadata("design:paramtypes", [scoring_service_1.ScoringService])
], ScoresController);
//# sourceMappingURL=scores.controller.js.map