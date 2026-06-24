import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { PrismaService } from "../common/prisma.service";
import { UserRole } from "../common/decorators/current-user.decorator";

const superAdminActor = {
  userId: "actor-001",
  email: "actor@test.com",
  role: UserRole.SUPER_ADMIN,
};

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("mock-hashed-password"),
  compare: jest.fn(),
}));

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
};

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findByEmail", () => {
    it("should return a user by email", async () => {
      const user = { id: "1", email: "test@test.com" };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.findByEmail("test@test.com");
      expect(result).toEqual(user);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@test.com" },
      });
    });
  });

  describe("findById", () => {
    it("should return a user by id", async () => {
      const user = { id: "uuid-1", email: "test@test.com" };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.findById("uuid-1", superAdminActor);
      expect(result).toEqual(user);
    });

    it("should throw NotFoundException when user not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.findById("missing", superAdminActor),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    it("should hash password before creating user", async () => {
      const dto = {
        email: "new@test.com",
        name: "New",
        role: "GESTOR" as import("@prisma/client").UserRole,
        password: "secret123",
      };
      mockPrismaService.user.create.mockResolvedValue({
        id: "1",
        email: dto.email,
        name: dto.name,
        passwordHash: "mock-hashed-password",
      });

      await service.create(dto, superAdminActor);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: "new@test.com",
          name: "New",
          passwordHash: "mock-hashed-password",
        }),
      });
    });

    it("should create user without password when not provided", async () => {
      const dto = {
        email: "new@test.com",
        name: "New",
        role: "GESTOR" as import("@prisma/client").UserRole,
      };
      mockPrismaService.user.create.mockResolvedValue({ id: "1", ...dto });

      await service.create(dto, superAdminActor);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.not.objectContaining({ passwordHash: expect.anything() }),
      });
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: "new@test.com",
          name: "New",
        }),
      });
    });
  });

  describe("findAll", () => {
    it("should return all users ordered by createdAt desc", async () => {
      const users = [{ id: "1" }, { id: "2" }];
      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findAll(undefined, superAdminActor);
      expect(result).toEqual(users);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: "desc" },
      });
    });

    it("should filter by institutionId when provided", async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      await service.findAll("inst-001", superAdminActor);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: { institutionId: "inst-001" },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("update", () => {
    it("should hash password on update if provided", async () => {
      const dto = { name: "Updated", password: "newpass" };
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: "1",
        institutionId: undefined,
      });
      mockPrismaService.user.update.mockResolvedValue({
        id: "1",
        name: "Updated",
      });

      await service.update("1", dto, superAdminActor);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: expect.objectContaining({ passwordHash: "mock-hashed-password" }),
      });
    });

    it("should update without password when not provided", async () => {
      const dto = { name: "Updated" };
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: "1",
        institutionId: undefined,
      });
      mockPrismaService.user.update.mockResolvedValue({
        id: "1",
        name: "Updated",
      });

      await service.update("1", dto, superAdminActor);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: expect.objectContaining({ name: "Updated" }),
      });
    });
  });

  describe("remove", () => {
    it("should perform soft delete and suspend user", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: "1",
        role: "GESTOR",
        institutionId: undefined,
      });
      mockPrismaService.user.update.mockResolvedValue({
        id: "1",
        status: "SUSPENDED",
      });

      await service.remove("1", superAdminActor);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: expect.objectContaining({
          deletedAt: expect.any(Date),
          status: "SUSPENDED",
        }),
      });
    });
  });
});
