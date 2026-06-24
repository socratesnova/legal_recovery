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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let InstitutionsService = class InstitutionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.institution.create({ data });
    }
    async findAll() {
        return this.prisma.institution.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: "desc" },
        });
    }
    async findOne(id) {
        const inst = await this.prisma.institution.findUnique({ where: { id } });
        if (!inst || inst.deletedAt)
            throw new common_1.NotFoundException("Institution not found");
        return inst;
    }
    async update(id, data) {
        return this.prisma.institution.update({ where: { id }, data });
    }
    async remove(id) {
        return this.prisma.institution.update({
            where: { id },
            data: { deletedAt: new Date(), status: "SUSPENDED" },
        });
    }
};
exports.InstitutionsService = InstitutionsService;
exports.InstitutionsService = InstitutionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InstitutionsService);
//# sourceMappingURL=institutions.service.js.map