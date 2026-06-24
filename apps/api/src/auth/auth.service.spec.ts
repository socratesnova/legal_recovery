import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { UserRole } from "../common/decorators/current-user.decorator";

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("mock-hash"),
  compare: jest.fn(),
}));

const mockUsersService = {
  findByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue("mock-jwt-token"),
};

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("validateUser", () => {
    it("should return user (without passwordHash) when credentials are valid", async () => {
      const bcrypt = await import("bcrypt");
      const user = {
        id: "user-001",
        email: "admin@legalrecovery.do",
        name: "Admin",
        role: "SUPER_ADMIN",
        passwordHash: "$2b$10$hashed",
      };
      mockUsersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.validateUser(
        "admin@legalrecovery.do",
        "demo1234",
      );
      expect(result).toEqual({
        id: "user-001",
        email: "admin@legalrecovery.do",
        name: "Admin",
        role: "SUPER_ADMIN",
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        "admin@legalrecovery.do",
      );
    });

    it("should return null when user is not found", async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      const result = await service.validateUser("missing@test.com", "password");
      expect(result).toBeNull();
    });

    it("should return null when user has no passwordHash", async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: "user-002",
        email: "legacy@test.com",
        passwordHash: null,
      });
      const result = await service.validateUser("legacy@test.com", "password");
      expect(result).toBeNull();
    });

    it("should return null when password does not match", async () => {
      const bcrypt = await import("bcrypt");
      const user = {
        id: "user-003",
        email: "test@test.com",
        passwordHash: "$2b$10$hashed",
      };
      mockUsersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const result = await service.validateUser("test@test.com", "wrongpass");
      expect(result).toBeNull();
    });
  });

  describe("login", () => {
    it("should return access_token and user object", () => {
      const user = {
        id: "user-001",
        email: "admin@legalrecovery.do",
        name: "Admin",
        role: UserRole.SUPER_ADMIN,
        institutionId: "inst-001",
      };

      const result = service.login(user);
      expect(result.access_token).toBe("mock-jwt-token");
      expect(result.user).toEqual({
        id: "user-001",
        email: "admin@legalrecovery.do",
        name: "Admin",
        role: UserRole.SUPER_ADMIN,
        institutionId: "inst-001",
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: "user-001",
        email: "admin@legalrecovery.do",
        role: UserRole.SUPER_ADMIN,
        institutionId: "inst-001",
      });
    });
  });

  describe("validateToken", () => {
    it("should be defined", () => {
      expect(service.validateToken).toBeDefined();
    });
  });
});
