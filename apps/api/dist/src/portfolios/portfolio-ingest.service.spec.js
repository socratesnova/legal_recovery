"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const portfolio_ingest_service_1 = require("./portfolio-ingest.service");
const prisma_service_1 = require("../common/prisma.service");
const storage_service_1 = require("../common/services/storage.service");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
describe("PortfolioIngestService", () => {
    let service;
    let prisma;
    let storage;
    beforeEach(async () => {
        prisma = {
            portfolio: { findUnique: jest.fn(), update: jest.fn() },
            debtor: { findFirst: jest.fn(), create: jest.fn() },
            case: { create: jest.fn(), aggregate: jest.fn() },
            caseProduct: { create: jest.fn() },
        };
        storage = {
            buildKey: jest.fn().mockReturnValue("portfolios/p1/uuid/f.csv"),
            put: jest.fn().mockResolvedValue({
                key: "portfolios/p1/uuid/f.csv",
                hash: "h",
                size: 10,
                mimeType: "text/csv",
            }),
        };
        const moduleRef = await testing_1.Test.createTestingModule({
            providers: [
                portfolio_ingest_service_1.PortfolioIngestService,
                { provide: prisma_service_1.PrismaService, useValue: prisma },
                { provide: storage_service_1.StorageService, useValue: storage },
            ],
        }).compile();
        service = moduleRef.get(portfolio_ingest_service_1.PortfolioIngestService);
    });
    const admin = {
        userId: "u1",
        email: "a@b.c",
        role: current_user_decorator_1.UserRole.ADMIN,
        institutionId: "inst1",
    };
    describe("toNumber", () => {
        it("parses plain decimals", () => {
            expect(service.toNumber("1500.50")).toBe(1500.5);
            expect(service.toNumber("2300.75")).toBe(2300.75);
        });
        it("parses ES format with dot thousands and comma decimals", () => {
            expect(service.toNumber("1.234,56")).toBe(1234.56);
            expect(service.toNumber("12.500,00")).toBe(12500);
        });
        it("parses EN format with comma thousands and dot decimals", () => {
            expect(service.toNumber("1,234.56")).toBe(1234.56);
            expect(service.toNumber("12,500.00")).toBe(12500);
        });
        it("parses comma-only as decimal (ES)", () => {
            expect(service.toNumber("2300,75")).toBe(2300.75);
        });
        it("strips currency symbols and spaces", () => {
            expect(service.toNumber("RD$ 1,500.50")).toBe(1500.5);
        });
        it("returns null for empty or non-numeric", () => {
            expect(service.toNumber("")).toBeNull();
            expect(service.toNumber("abc")).toBeNull();
        });
    });
    describe("normalizeRow", () => {
        it("maps Spanish headers", () => {
            const row = service.normalizeRow({
                cedula: "001-1234-5",
                nombres: "Juan",
                apellidos: "Perez",
                saldo: "1500.50",
            });
            expect(row).toEqual(expect.objectContaining({
                idNumber: "001-1234-5",
                firstName: "Juan",
                lastName: "Perez",
                totalBalance: 1500.5,
            }));
        });
        it("maps English headers", () => {
            const row = service.normalizeRow({
                idNumber: "002",
                firstName: "Maria",
                lastName: "Lopez",
                totalBalance: "2300.75",
                productType: "credit_card",
            });
            expect(row?.productType).toBe("credit_card");
        });
        it("returns null when required fields are missing", () => {
            expect(service.normalizeRow({ cedula: "001", nombres: "Juan", saldo: "" })).toBeNull();
            expect(service.normalizeRow({ cedula: "", nombres: "Juan", saldo: "100" })).toBeNull();
            expect(service.normalizeRow({ cedula: "001", nombres: "", saldo: "100" })).toBeNull();
        });
        it("returns null when balance is non-numeric", () => {
            expect(service.normalizeRow({
                cedula: "001",
                nombres: "Juan",
                apellidos: "P",
                saldo: "N/A",
            })).toBeNull();
        });
    });
    describe("parse (CSV)", () => {
        it("parses a semicolon-delimited CSV buffer", async () => {
            const csv = "cedula;nombres;apellidos;saldo\n001;Juan;Perez;1500.50\n002;Maria;Lopez;2300.75";
            const rows = await service.parse(Buffer.from(csv), "port.csv");
            expect(rows).toHaveLength(2);
            expect(rows[0]).toEqual(expect.objectContaining({ idNumber: "001", totalBalance: 1500.5 }));
            expect(rows[1]).toEqual(expect.objectContaining({ idNumber: "002", totalBalance: 2300.75 }));
        });
        it("skips malformed rows", async () => {
            const csv = "cedula;nombres;apellidos;saldo\n001;Juan;Perez;1500.50\n003;Carlos;SinSaldo;";
            const rows = await service.parse(Buffer.from(csv), "port.csv");
            expect(rows).toHaveLength(1);
        });
        it("returns an empty array for a header-only buffer", async () => {
            const rows = await service.parse(Buffer.from("cedula;nombres;apellidos;saldo"), "port.csv");
            expect(rows).toEqual([]);
        });
        it("throws BadRequest when the CSV has an unterminated quote", async () => {
            await expect(service.parse(Buffer.from('a,b,"c'), "port.csv")).rejects.toBeInstanceOf(common_1.BadRequestException);
        });
    });
    describe("ingest", () => {
        const csv = "cedula;nombres;apellidos;saldo\n001;Juan;Perez;1500.50\n002;Maria;Lopez;2300.75";
        const file = {
            originalname: "port.csv",
            buffer: Buffer.from(csv),
            mimetype: "text/csv",
            size: csv.length,
        };
        beforeEach(() => {
            prisma.portfolio.findUnique.mockResolvedValue({
                id: "p1",
                institutionId: "inst1",
                deletedAt: null,
            });
            prisma.debtor.findFirst.mockResolvedValue(null);
            prisma.debtor.create.mockImplementation(({ data }) => Promise.resolve({ id: `d-${data.idNumber}` }));
            prisma.case.create.mockResolvedValue({ id: "c1" });
            prisma.case.aggregate.mockResolvedValue({
                _sum: { totalBalance: 3800.25 },
            });
            prisma.portfolio.update.mockResolvedValue({});
        });
        it("creates debtors and cases and returns a summary", async () => {
            const summary = await service.ingest(file, "p1", admin);
            expect(storage.put).toHaveBeenCalled();
            expect(prisma.debtor.create).toHaveBeenCalledTimes(2);
            expect(prisma.case.create).toHaveBeenCalledTimes(2);
            expect(summary.casesCreated).toBe(2);
            expect(summary.debtorsCreated).toBe(2);
            expect(summary.debtorsReused).toBe(0);
            expect(summary.rowsProcessed).toBe(2);
            expect(summary.skipped).toBe(0);
            expect(prisma.portfolio.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: "p1" },
                data: expect.objectContaining({
                    totalAmount: 3800.25,
                    status: "ACTIVE",
                }),
            }));
        });
        it("reuses an existing debtor on duplicate national id", async () => {
            const dupCsv = "cedula;nombres;apellidos;saldo\n001;Juan;Perez;1000\n001;Juan;Perez;2000";
            const dupFile = {
                originalname: "dup.csv",
                buffer: Buffer.from(dupCsv),
                mimetype: "text/csv",
                size: dupCsv.length,
            };
            prisma.debtor.findFirst
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce({ id: "d-001" });
            const summary = await service.ingest(dupFile, "p1", admin);
            expect(summary.debtorsCreated).toBe(1);
            expect(summary.debtorsReused).toBe(1);
            expect(summary.casesCreated).toBe(2);
        });
        it("rejects ingest for another tenant's portfolio", async () => {
            prisma.portfolio.findUnique.mockResolvedValue({
                id: "p1",
                institutionId: "other-inst",
                deletedAt: null,
            });
            await expect(service.ingest(file, "p1", admin)).rejects.toBeInstanceOf(common_1.ForbiddenException);
            expect(storage.put).not.toHaveBeenCalled();
        });
        it("rejects ingest when the portfolio does not exist", async () => {
            prisma.portfolio.findUnique.mockResolvedValue(null);
            await expect(service.ingest(file, "p1", admin)).rejects.toBeInstanceOf(common_1.NotFoundException);
        });
        it("counts a row-level DB error as skipped without aborting", async () => {
            prisma.case.create
                .mockResolvedValueOnce({ id: "c1" })
                .mockRejectedValueOnce(new Error("db failure"));
            const summary = await service.ingest(file, "p1", admin);
            expect(summary.casesCreated).toBe(1);
            expect(summary.skipped).toBe(1);
            expect(summary.errors).toHaveLength(1);
        });
        it("reuses the debtor when create hits a unique-constraint race (P2002)", async () => {
            const p2002 = new client_1.Prisma.PrismaClientKnownRequestError("Unique constraint failed on id_number", { code: "P2002", clientVersion: "6.19.3" });
            prisma.debtor.findFirst
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce({ id: "d-001" });
            prisma.debtor.create.mockRejectedValueOnce(p2002);
            prisma.case.create.mockResolvedValue({ id: "c1" });
            const raceCsv = "cedula;nombres;apellidos;saldo\n001;Juan;Perez;1000";
            const raceFile = {
                originalname: "race.csv",
                buffer: Buffer.from(raceCsv),
                mimetype: "text/csv",
                size: raceCsv.length,
            };
            const summary = await service.ingest(raceFile, "p1", admin);
            expect(summary.debtorsCreated).toBe(0);
            expect(summary.debtorsReused).toBe(1);
            expect(summary.casesCreated).toBe(1);
            expect(summary.skipped).toBe(0);
        });
    });
});
//# sourceMappingURL=portfolio-ingest.service.spec.js.map