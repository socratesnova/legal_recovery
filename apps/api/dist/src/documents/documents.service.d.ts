import { PrismaService } from "../common/prisma.service";
import { StorageService } from "../common/services/storage.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export declare class DocumentsService {
    private prisma;
    private storage;
    constructor(prisma: PrismaService, storage: StorageService);
    findAll(caseId: string | undefined, user: AuthenticatedUser): Promise<({
        case: {
            institutionId: string;
            id: string;
            caseNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        caseId: string;
        mimeType: string;
        uploadedBy: string;
        filename: string;
        filePath: string;
        fileHash: string;
        sizeBytes: number;
    })[]>;
    findById(id: string, user: AuthenticatedUser): Promise<{
        case: {
            institutionId: string;
            id: string;
            caseNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        caseId: string;
        mimeType: string;
        uploadedBy: string;
        filename: string;
        filePath: string;
        fileHash: string;
        sizeBytes: number;
    }>;
    create(data: CreateDocumentDto, user: AuthenticatedUser): Promise<{
        case: {
            institutionId: string;
            id: string;
            caseNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        caseId: string;
        mimeType: string;
        uploadedBy: string;
        filename: string;
        filePath: string;
        fileHash: string;
        sizeBytes: number;
    }>;
    upload(file: Express.Multer.File, caseId: string, user: AuthenticatedUser): Promise<{
        case: {
            institutionId: string;
            id: string;
            caseNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        caseId: string;
        mimeType: string;
        uploadedBy: string;
        filename: string;
        filePath: string;
        fileHash: string;
        sizeBytes: number;
    }>;
    getDownloadUrl(id: string, user: AuthenticatedUser): Promise<{
        url: string;
        expiresIn: number;
    }>;
    update(id: string, data: UpdateDocumentDto, user: AuthenticatedUser): Promise<{
        case: {
            institutionId: string;
            id: string;
            caseNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        caseId: string;
        mimeType: string;
        uploadedBy: string;
        filename: string;
        filePath: string;
        fileHash: string;
        sizeBytes: number;
    }>;
    remove(id: string, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        caseId: string;
        mimeType: string;
        uploadedBy: string;
        filename: string;
        filePath: string;
        fileHash: string;
        sizeBytes: number;
    }>;
    private assertCaseInTenant;
}
