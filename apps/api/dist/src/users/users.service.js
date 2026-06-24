"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../common/prisma.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async findById(id, actor) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        if (actor.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
            user.institutionId !== actor.institutionId) {
            throw new common_1.ForbiddenException("User does not belong to your institution");
        }
        return user;
    }
    async create(data, actor) {
        if (actor.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
            data.institutionId &&
            data.institutionId !== actor.institutionId) {
            throw new common_1.ForbiddenException("Cannot assign user to a different institution");
        }
        const institutionId = actor.role === current_user_decorator_1.UserRole.SUPER_ADMIN
            ? data.institutionId
            : actor.institutionId;
        const createData = {
            email: data.email,
            name: data.name,
            role: data.role,
            institutionId,
            status: data.status,
            mfaEnabled: data.mfaEnabled,
        };
        if (data.password) {
            createData.passwordHash = await bcrypt.hash(data.password, 10);
        }
        return this.prisma.user.create({ data: createData });
    }
    async findAll(institutionId, actor) {
        const where = {};
        if (actor.role !== current_user_decorator_1.UserRole.SUPER_ADMIN) {
            if (!actor.institutionId) {
                throw new common_1.ForbiddenException("User is not assigned to any institution");
            }
            where.institutionId = actor.institutionId;
        }
        else if (institutionId) {
            where.institutionId = institutionId;
        }
        return this.prisma.user.findMany({ where, orderBy: { createdAt: "desc" } });
    }
    async update(id, data, actor) {
        await this.findById(id, actor);
        if (actor.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
            data.institutionId &&
            data.institutionId !== actor.institutionId) {
            throw new common_1.ForbiddenException("Cannot move user to a different institution");
        }
        const updateData = {
            email: data.email,
            name: data.name,
            role: data.role,
            status: data.status,
            mfaEnabled: data.mfaEnabled,
        };
        if (data.password) {
            updateData.passwordHash = await bcrypt.hash(data.password, 10);
        }
        if (data.institutionId !== undefined) {
            updateData.institutionId = data.institutionId;
        }
        if (data.role === current_user_decorator_1.UserRole.SUPER_ADMIN &&
            actor.role !== current_user_decorator_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException("Only super administrators can assign the super_admin role");
        }
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        return this.prisma.user.update({ where: { id }, data: updateData });
    }
    async remove(id, actor) {
        const existing = await this.findById(id, actor);
        if (existing.role === "super_admin" ||
            existing.role === "SUPER_ADMIN") {
            throw new common_1.BadRequestException("Cannot delete a super administrator");
        }
        return this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), status: "SUSPENDED" },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map