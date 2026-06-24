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
exports.DocumentsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const documents_service_1 = require("./documents.service");
const create_document_dto_1 = require("./dto/create-document.dto");
const update_document_dto_1 = require("./dto/update-document.dto");
const upload_document_dto_1 = require("./dto/upload-document.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const UPLOAD_MAX_BYTES = Number(process.env.UPLOAD_MAX_BYTES ?? 50 * 1024 * 1024);
let DocumentsController = class DocumentsController {
    constructor(documentsService) {
        this.documentsService = documentsService;
    }
    findAll(caseId, user) {
        return this.documentsService.findAll(caseId, user);
    }
    findById(id, user) {
        return this.documentsService.findById(id, user);
    }
    getDownloadUrl(id, user) {
        return this.documentsService.getDownloadUrl(id, user);
    }
    create(data, user) {
        return this.documentsService.create(data, user);
    }
    upload(file, dto, user) {
        if (!file) {
            throw new common_1.BadRequestException("File is required");
        }
        return this.documentsService.upload(file, dto.caseId, user);
    }
    update(id, data, user) {
        return this.documentsService.update(id, data, user);
    }
    remove(id, user) {
        return this.documentsService.remove(id, user);
    }
};
exports.DocumentsController = DocumentsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List documents" }),
    (0, swagger_1.ApiQuery)({ name: "caseId", required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "List of documents returned" }),
    __param(0, (0, common_1.Query)("caseId")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a single document by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Document returned" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Document not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)(":id/download"),
    (0, swagger_1.ApiOperation)({ summary: "Get a short-lived presigned download URL" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Presigned download URL" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Document not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "getDownloadUrl", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.GESTOR, roles_decorator_1.Role.ABOGADO),
    (0, swagger_1.ApiOperation)({ summary: "Create a new document record" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Document created" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_document_dto_1.CreateDocumentDto, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("upload"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.GESTOR, roles_decorator_1.Role.ABOGADO),
    (0, swagger_1.ApiOperation)({ summary: "Upload a file to object storage and register it" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                caseId: { type: "string", format: "uuid" },
                file: { type: "string", format: "binary" },
            },
            required: ["caseId", "file"],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Document uploaded" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Missing file or caseId" }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        limits: { fileSize: UPLOAD_MAX_BYTES },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upload_document_dto_1.UploadDocumentDto, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "upload", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.GESTOR, roles_decorator_1.Role.ABOGADO),
    (0, swagger_1.ApiOperation)({ summary: "Update a document record" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Document updated" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Document not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_document_dto_1.UpdateDocumentDto, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Soft-delete a document" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Document soft-deleted" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Document not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "remove", null);
exports.DocumentsController = DocumentsController = __decorate([
    (0, swagger_1.ApiTags)("Documents"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)("v1/documents"),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService])
], DocumentsController);
//# sourceMappingURL=documents.controller.js.map