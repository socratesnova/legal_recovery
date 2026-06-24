import { Test } from "@nestjs/testing";
import { NotFoundException, ForbiddenException } from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { PrismaService } from "../common/prisma.service";
import { StorageService } from "../common/services/storage.service";
import { UserRole } from "../common/decorators/current-user.decorator";

describe("DocumentsService", () => {
  let service: DocumentsService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let storage: any;

  beforeEach(async () => {
    prisma = {
      case: { findUnique: jest.fn() },
      document: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
    };
    storage = {
      buildKey: jest.fn().mockReturnValue("cases/case1/uuid/f.txt"),
      put: jest.fn().mockResolvedValue({
        key: "cases/case1/uuid/f.txt",
        hash: "deadbeef",
        size: 12,
        mimeType: "text/plain",
      }),
      getDownloadUrl: jest
        .fn()
        .mockResolvedValue("https://signed.example/f.txt"),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: PrismaService, useValue: prisma },
        { provide: StorageService, useValue: storage },
      ],
    }).compile();

    service = moduleRef.get(DocumentsService);
  });

  const gestor = {
    userId: "u1",
    email: "a@b.c",
    role: UserRole.GESTOR,
    institutionId: "inst1",
  };
  const file = {
    originalname: "f.txt",
    buffer: Buffer.from("hello world!"),
    mimetype: "text/plain",
    size: 12,
  } as unknown as Express.Multer.File;

  it("uploads and registers a document", async () => {
    prisma.case.findUnique.mockResolvedValue({
      id: "case1",
      institutionId: "inst1",
    });
    prisma.document.create.mockResolvedValue({
      id: "doc1",
      filePath: "cases/case1/uuid/f.txt",
    });

    const result = await service.upload(file, "case1", gestor);

    expect(storage.buildKey).toHaveBeenCalledWith("cases/case1", "f.txt");
    expect(storage.put).toHaveBeenCalledWith(
      "cases/case1/uuid/f.txt",
      file.buffer,
      "text/plain",
    );
    expect(prisma.document.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          caseId: "case1",
          uploadedBy: "u1",
          filename: "f.txt",
          filePath: "cases/case1/uuid/f.txt",
          fileHash: "deadbeef",
          mimeType: "text/plain",
          sizeBytes: 12,
        }),
      }),
    );
    expect(result.id).toBe("doc1");
  });

  it("rejects upload when the case does not exist", async () => {
    prisma.case.findUnique.mockResolvedValue(null);
    await expect(service.upload(file, "case1", gestor)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(storage.put).not.toHaveBeenCalled();
  });

  it("rejects upload to another tenant's case", async () => {
    prisma.case.findUnique.mockResolvedValue({
      id: "case1",
      institutionId: "other-inst",
    });
    await expect(service.upload(file, "case1", gestor)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(storage.put).not.toHaveBeenCalled();
  });

  it("allows super_admin to upload to any tenant", async () => {
    const admin = { ...gestor, role: UserRole.SUPER_ADMIN };
    prisma.case.findUnique.mockResolvedValue({
      id: "case1",
      institutionId: "other-inst",
    });
    prisma.document.create.mockResolvedValue({ id: "doc1" });

    const result = await service.upload(file, "case1", admin);
    expect(storage.put).toHaveBeenCalled();
    expect(result.id).toBe("doc1");
  });

  it("issues a presigned download URL for a tenant-owned document", async () => {
    prisma.document.findUnique.mockResolvedValue({
      id: "doc1",
      filePath: "key1",
      deletedAt: null,
      case: { id: "c1", caseNumber: "CN1", institutionId: "inst1" },
    });

    const result = await service.getDownloadUrl("doc1", gestor);
    expect(storage.getDownloadUrl).toHaveBeenCalledWith("key1", 300);
    expect(result).toEqual({
      url: "https://signed.example/f.txt",
      expiresIn: 300,
    });
  });

  it("returns NotFound for a missing download target", async () => {
    prisma.document.findUnique.mockResolvedValue(null);
    await expect(service.getDownloadUrl("nope", gestor)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("forbids download of another tenant's document", async () => {
    prisma.document.findUnique.mockResolvedValue({
      id: "doc1",
      filePath: "key1",
      deletedAt: null,
      case: { id: "c1", caseNumber: "CN1", institutionId: "other-inst" },
    });
    await expect(service.getDownloadUrl("doc1", gestor)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(storage.getDownloadUrl).not.toHaveBeenCalled();
  });
});
