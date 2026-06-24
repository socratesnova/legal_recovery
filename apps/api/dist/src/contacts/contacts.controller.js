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
exports.ContactsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contacts_service_1 = require("./contacts.service");
const create_contact_dto_1 = require("./dto/create-contact.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ContactsController = class ContactsController {
    constructor(service) {
        this.service = service;
    }
    findAll(debtorId, user) {
        return this.service.findAll(debtorId, user);
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
    remove(id, user) {
        return this.service.remove(id, user);
    }
};
exports.ContactsController = ContactsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List contacts (optionally filtered by debtor)" }),
    (0, swagger_1.ApiQuery)({ name: "debtorId", required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "List of contacts" }),
    __param(0, (0, common_1.Query)("debtorId")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a single contact by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Contact returned" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Contact not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.GESTOR, roles_decorator_1.Role.SUPERVISOR, roles_decorator_1.Role.ABOGADO, roles_decorator_1.Role.COMPLIANCE),
    (0, swagger_1.ApiOperation)({ summary: "Create a contact for a debtor" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Contact created" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contact_dto_1.CreateContactDto, Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.GESTOR, roles_decorator_1.Role.SUPERVISOR, roles_decorator_1.Role.ABOGADO, roles_decorator_1.Role.COMPLIANCE),
    (0, swagger_1.ApiOperation)({ summary: "Update a contact" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Contact updated" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_contact_dto_1.UpdateContactDto, Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN, roles_decorator_1.Role.SUPER_ADMIN, roles_decorator_1.Role.COMPLIANCE),
    (0, swagger_1.ApiOperation)({ summary: "Soft-delete a contact" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Contact soft-deleted" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "remove", null);
exports.ContactsController = ContactsController = __decorate([
    (0, swagger_1.ApiTags)("Contacts"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)("v1/contacts"),
    __metadata("design:paramtypes", [contacts_service_1.ContactsService])
], ContactsController);
//# sourceMappingURL=contacts.controller.js.map