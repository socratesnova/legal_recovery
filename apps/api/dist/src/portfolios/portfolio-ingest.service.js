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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PortfolioIngestService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioIngestService = void 0;
const common_1 = require("@nestjs/common");
const sync_1 = require("csv-parse/sync");
const exceljs_1 = __importDefault(require("exceljs"));
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../common/prisma.service");
const storage_service_1 = require("../common/services/storage.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const MAX_ROWS = 10000;
const HEADER_ALIASES = {
    idNumber: ["idnumber", "cedula", "documento", "identificacion", "dni", "rnc"],
    firstName: ["firstname", "nombres", "nombre", "primer_nombre"],
    lastName: ["lastname", "apellidos", "apellido", "primer_apellido"],
    caseNumber: ["casenumber", "expediente", "caso", "no_caso", "case"],
    totalBalance: ["totalbalance", "saldo", "saldo_total", "balance", "monto"],
    productType: ["producttype", "producto", "tipo_producto", "product"],
    originalAmount: ["originalamount", "monto_original", "capital", "principal"],
    currentBalance: ["currentbalance", "saldo_producto", "saldo_actual"],
    interestRate: ["interestrate", "tasa", "tasa_interes"],
    ignored: [],
};
let PortfolioIngestService = PortfolioIngestService_1 = class PortfolioIngestService {
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
        this.logger = new common_1.Logger(PortfolioIngestService_1.name);
    }
    async ingest(file, portfolioId, user) {
        const portfolio = await this.assertPortfolioInTenant(portfolioId, user);
        const storageKey = this.storage.buildKey(`portfolios/${portfolio.id}`, file.originalname);
        await this.storage.put(storageKey, file.buffer, file.mimetype);
        const rows = await this.parse(file.buffer, file.originalname);
        if (rows.length === 0) {
            throw new common_1.BadRequestException("No data rows found in the uploaded file");
        }
        if (rows.length > MAX_ROWS) {
            throw new common_1.BadRequestException(`File has ${rows.length} rows; the synchronous ingest limit is ${MAX_ROWS}. Use the async pipeline for larger files.`);
        }
        const summary = {
            portfolioId: portfolio.id,
            rowsProcessed: rows.length,
            casesCreated: 0,
            debtorsCreated: 0,
            debtorsReused: 0,
            skipped: 0,
            errors: [],
            storageKey,
        };
        await this.processRows(rows, portfolio, summary);
        await this.finalizeIngest(portfolio, summary, storageKey);
        return summary;
    }
    async processRows(rows, portfolio, summary) {
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            try {
                await this.ingestRow(row, portfolio, i, summary);
            }
            catch (err) {
                summary.errors.push(`Row ${i + 2}: ${err?.message ?? "unexpected error"}`);
                summary.skipped += 1;
            }
        }
    }
    async finalizeIngest(portfolio, summary, storageKey) {
        const aggregate = await this.prisma.case.aggregate({
            where: { portfolioId: portfolio.id, deletedAt: null },
            _sum: { totalBalance: true },
        });
        await this.prisma.portfolio.update({
            where: { id: portfolio.id },
            data: {
                totalAmount: Number(aggregate._sum.totalBalance ?? 0),
                fileSource: storageKey,
                status: "ACTIVE",
            },
        });
        this.logger.log(`Portfolio ${portfolio.id} ingested: ${summary.casesCreated} cases, ${summary.debtorsCreated} new debtors, ${summary.skipped} skipped, ${summary.errors.length} errors`);
    }
    async ingestRow(row, portfolio, index, summary) {
        let debtor = await this.prisma.debtor.findFirst({
            where: { idNumber: row.idNumber },
            select: { id: true },
        });
        if (!debtor) {
            try {
                debtor = await this.prisma.debtor.create({
                    data: {
                        firstName: row.firstName,
                        lastName: row.lastName,
                        idNumber: row.idNumber,
                    },
                    select: { id: true },
                });
                summary.debtorsCreated += 1;
            }
            catch (err) {
                if (this.isUniqueViolation(err)) {
                    debtor = await this.prisma.debtor.findFirst({
                        where: { idNumber: row.idNumber },
                        select: { id: true },
                    });
                    if (!debtor)
                        throw err;
                    summary.debtorsReused += 1;
                }
                else {
                    throw err;
                }
            }
        }
        else {
            summary.debtorsReused += 1;
        }
        const caseNumber = row.caseNumber?.trim() ||
            `PF-${portfolio.id.slice(0, 8).toUpperCase()}-${(index + 1)
                .toString()
                .padStart(4, "0")}`;
        const createdCase = await this.prisma.case.create({
            data: {
                institutionId: portfolio.institutionId,
                portfolioId: portfolio.id,
                debtorId: debtor.id,
                caseNumber,
                totalBalance: row.totalBalance,
                status: "ACTIVE",
            },
            select: { id: true },
        });
        summary.casesCreated += 1;
        if (row.productType ||
            row.originalAmount !== undefined ||
            row.currentBalance !== undefined) {
            await this.prisma.caseProduct.create({
                data: {
                    caseId: createdCase.id,
                    productType: row.productType ?? "loan",
                    originalAmount: row.originalAmount ?? row.totalBalance,
                    currentBalance: row.currentBalance ?? row.totalBalance,
                    interestRate: row.interestRate,
                },
            });
        }
    }
    async parse(buffer, filename) {
        const lower = filename.toLowerCase();
        if (lower.endsWith(".xlsx") || lower.endsWith(".xlsm")) {
            return this.parseXlsx(buffer);
        }
        return this.parseCsv(buffer);
    }
    parseCsv(buffer) {
        let records = [];
        try {
            records = (0, sync_1.parse)(buffer, {
                columns: true,
                delimiter: [",", ";", "\t"],
                trim: true,
                skip_empty_lines: true,
                bom: true,
                relax_column_count: true,
            });
        }
        catch (err) {
            throw new common_1.BadRequestException(`Could not parse CSV: ${err?.message ?? err}`);
        }
        return records
            .map((r) => this.normalizeRow(r))
            .filter((row) => row !== null);
    }
    async parseXlsx(buffer) {
        const workbook = new exceljs_1.default.Workbook();
        await workbook.xlsx.load(buffer);
        const ws = workbook.worksheets[0];
        if (!ws) {
            throw new common_1.BadRequestException("XLSX workbook has no worksheets");
        }
        const headerValues = (ws.getRow(1).values ?? []);
        const headers = headerValues
            .map((v) => (v === undefined || v === null ? "" : String(v)))
            .map((s) => s.trim().toLowerCase());
        const rows = [];
        for (let r = 2; r <= ws.rowCount; r++) {
            const values = (ws.getRow(r).values ?? []);
            const raw = {};
            headers.forEach((h, idx) => {
                if (!h)
                    return;
                const v = values[idx];
                raw[h] = v === undefined || v === null ? "" : String(v);
            });
            const row = this.normalizeRow(raw);
            if (row)
                rows.push(row);
        }
        return rows;
    }
    normalizeRow(raw) {
        const mapping = {};
        for (const rawHeader of Object.keys(raw)) {
            const canon = this.canonicalHeader(rawHeader);
            if (canon && canon !== "ignored") {
                mapping[canon] = raw[rawHeader];
            }
        }
        const idNumber = (mapping.idNumber ?? "").trim();
        const firstName = (mapping.firstName ?? "").trim();
        const lastName = (mapping.lastName ?? "").trim();
        const totalBalanceRaw = (mapping.totalBalance ?? "").trim();
        if (!idNumber || !firstName || !lastName || !totalBalanceRaw) {
            return null;
        }
        const totalBalance = this.toNumber(totalBalanceRaw);
        if (totalBalance === null) {
            return null;
        }
        return {
            idNumber,
            firstName,
            lastName,
            caseNumber: mapping.caseNumber,
            totalBalance,
            productType: mapping.productType?.trim() || undefined,
            originalAmount: this.toNumber(mapping.originalAmount ?? "") ?? undefined,
            currentBalance: this.toNumber(mapping.currentBalance ?? "") ?? undefined,
            interestRate: this.toNumber(mapping.interestRate ?? "") ?? undefined,
        };
    }
    canonicalHeader(header) {
        const h = header.trim().toLowerCase();
        for (const key of Object.keys(HEADER_ALIASES)) {
            if (HEADER_ALIASES[key].includes(h))
                return key;
        }
        return null;
    }
    toNumber(value) {
        if (!value)
            return null;
        const raw = value.trim().replace(/[^\d.,-]/g, "");
        if (!raw)
            return null;
        const hasDot = raw.includes(".");
        const hasComma = raw.includes(",");
        let normalized = raw;
        if (hasDot && hasComma) {
            if (raw.lastIndexOf(",") > raw.lastIndexOf(".")) {
                normalized = raw.replace(/\./g, "").replace(",", ".");
            }
            else {
                normalized = raw.replace(/,/g, "");
            }
        }
        else if (hasComma) {
            normalized = raw.replace(",", ".");
        }
        const n = Number(normalized);
        return isNaN(n) ? null : n;
    }
    isUniqueViolation(err) {
        return (err instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            err.code === "P2002");
    }
    async assertPortfolioInTenant(portfolioId, user) {
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id: portfolioId },
            select: { id: true, institutionId: true, deletedAt: true },
        });
        if (!portfolio || portfolio.deletedAt) {
            throw new common_1.NotFoundException("Portfolio not found");
        }
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
            portfolio.institutionId !== user.institutionId) {
            throw new common_1.ForbiddenException("Portfolio does not belong to your institution");
        }
        return { id: portfolio.id, institutionId: portfolio.institutionId };
    }
};
exports.PortfolioIngestService = PortfolioIngestService;
exports.PortfolioIngestService = PortfolioIngestService = PortfolioIngestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], PortfolioIngestService);
//# sourceMappingURL=portfolio-ingest.service.js.map