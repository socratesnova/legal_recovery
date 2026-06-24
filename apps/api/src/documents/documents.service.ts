import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { StorageService } from "../common/services/storage.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";
import {
  AuthenticatedUser,
  UserRole,
} from "../common/decorators/current-user.decorator";

const DOWNLOAD_URL_TTL_SECONDS = 300;

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async findAll(caseId: string | undefined, user: AuthenticatedUser) {
    const where = { deletedAt: null } as {
      deletedAt: null;
      caseId?: string;
      case?: { institutionId: string };
    };

    if (caseId) {
      where.caseId = caseId;
    }

    if (user.role !== UserRole.SUPER_ADMIN) {
      if (!user.institutionId) {
        throw new ForbiddenException("User is not assigned to any institution");
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

  async findById(id: string, user: AuthenticatedUser) {
    const doc = await this.prisma.document.findUnique({
      where: { id },
      include: {
        case: { select: { id: true, caseNumber: true, institutionId: true } },
      },
    });

    if (!doc || doc.deletedAt) {
      throw new NotFoundException("Document not found");
    }

    if (
      user.role !== UserRole.SUPER_ADMIN &&
      doc.case.institutionId !== user.institutionId
    ) {
      throw new ForbiddenException(
        "Document does not belong to your institution",
      );
    }

    return doc;
  }

  /**
   * Persist a document record pointing at an already-stored object.
   * Kept for internal/programmatic flows; interactive uploads should go
   * through `upload()` which performs the real object storage.
   */
  async create(data: CreateDocumentDto, user: AuthenticatedUser) {
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

  /**
   * Real upload pipeline: validate the case belongs to the tenant, stream the
   * file to object storage (SHA-256 computed for integrity), and persist the
   * document row with the object key as `filePath`.
   */
  async upload(
    file: Express.Multer.File,
    caseId: string,
    user: AuthenticatedUser,
  ) {
    const caseRecord = await this.assertCaseInTenant(caseId, user);

    const key = this.storage.buildKey(
      `cases/${caseRecord.id}`,
      file.originalname,
    );
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

  /**
   * Issue a short-lived presigned download URL for the object backing a document.
   * Tenant scoping is enforced via findById.
   */
  async getDownloadUrl(id: string, user: AuthenticatedUser) {
    const doc = await this.findById(id, user);
    const url = await this.storage.getDownloadUrl(
      doc.filePath,
      DOWNLOAD_URL_TTL_SECONDS,
    );
    return { url, expiresIn: DOWNLOAD_URL_TTL_SECONDS };
  }

  async update(id: string, data: UpdateDocumentDto, user: AuthenticatedUser) {
    await this.findById(id, user); // ensure exists and belongs to tenant

    const updateData: {
      filename?: string;
      filePath?: string;
      fileHash?: string;
      mimeType?: string;
      sizeBytes?: number;
      caseId?: string;
    } = {
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
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
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

  async remove(id: string, user: AuthenticatedUser) {
    await this.findById(id, user); // ensure exists and belongs to tenant

    return this.prisma.document.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /** Validate that a case exists and belongs to the caller's institution. */
  private async assertCaseInTenant(caseId: string, user: AuthenticatedUser) {
    const caseRecord = await this.prisma.case.findUnique({
      where: { id: caseId },
      select: { id: true, institutionId: true },
    });

    if (!caseRecord) {
      throw new NotFoundException("Case not found");
    }

    if (
      user.role !== UserRole.SUPER_ADMIN &&
      caseRecord.institutionId !== user.institutionId
    ) {
      throw new ForbiddenException("Case does not belong to your institution");
    }

    return caseRecord;
  }
}
