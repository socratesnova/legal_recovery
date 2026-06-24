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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const storage_service_1 = require("../common/services/storage.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const DOWNLOAD_URL_TTL_SECONDS = 300;
let DocumentsService = class DocumentsService {
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    async findAll(caseId, user) {
        const where = { deletedAt: null };
        if (caseId) {
            where.caseId = caseId;
        }
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN) {
            if (!user.institutionId) {
                throw new common_1.ForbiddenException("User is not assigned to any institution");
            }
            where.case = { institutionId: user.institutionId };
        }
        return this.prisma.document.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                case: { select: { id: true, caseNumber: true, institutionId: true } },
            },
        });
    }
    async findById(id, user) {
        const doc = await this.prisma.document.findUnique({
            where: { id },
            include: {
                case: { select: { id: true, caseNumber: true, institutionId: true } },
            },
        });
        if (!doc || doc.deletedAt) {
            throw new common_1.NotFoundException("Document not found");
        }
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
            doc.case.institutionId !== user.institutionId) {
            throw new common_1.ForbiddenException("Document does not belong to your institution");
        }
        return doc;
    }
    async create(data, user) {
        const caseRecord = await this.assertCaseInTenant(data.caseId, user);
        return this.prisma.document.create({
            data: {
                caseId: caseRecord.id,
                uploadedBy: user.userId,
                filename: data.filename,
                filePath: data.filePath,
                fileHash: data.fileHash,
                mimeType: data.mimeType,
                sizeBytes: data.sizeBytes,
            },
            include: {
                case: { select: { id: true, caseNumber: true, institutionId: true } },
            },
        });
    }
    async upload(file, caseId, user) {
        const caseRecord = await this.assertCaseInTenant(caseId, user);
        const key = this.storage.buildKey(`cases/${caseRecord.id}`, file.originalname);
        const stored = await this.storage.put(key, file.buffer, file.mimetype);
        return this.prisma.document.create({
            data: {
                caseId: caseRecord.id,
                uploadedBy: user.userId,
                filename: file.originalname,
                filePath: stored.key,
                fileHash: stored.hash,
                mimeType: stored.mimeType,
                sizeBytes: stored.size,
            },
            include: {
                case: { select: { id: true, caseNumber: true, institutionId: true } },
            },
        });
    }
    async getDownloadUrl(id, user) {
        const doc = await this.findById(id, user);
        const url = await this.storage.getDownloadUrl(doc.filePath, DOWNLOAD_URL_TTL_SECONDS);
        return { url, expiresIn: DOWNLOAD_URL_TTL_SECONDS };
    }
    async update(id, data, user) {
        await this.findById(id, user);
        const updateData = {
            filename: data.filename,
            filePath: data.filePath,
            fileHash: data.fileHash,
            mimeType: data.mimeType,
            sizeBytes: data.sizeBytes,
        };
        if (data.caseId) {
            const caseRecord = await this.assertCaseInTenant(data.caseId, user);
            updateData.caseId = caseRecord.id;
        }
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        return this.prisma.document.update({
            where: { id },
            data: updateData,
            include: {
                case: { select: { id: true, caseNumber: true, institutionId: true } },
            },
        });
    }
    async remove(id, user) {
        await this.findById(id, user);
        return this.prisma.document.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async assertCaseInTenant(caseId, user) {
        const caseRecord = await this.prisma.case.findUnique({
            where: { id: caseId },
            select: { id: true, institutionId: true },
        });
        if (!caseRecord) {
            throw new common_1.NotFoundException("Case not found");
        }
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
            caseRecord.institutionId !== user.institutionId) {
            throw new common_1.ForbiddenException("Case does not belong to your institution");
        }
        return caseRecord;
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map