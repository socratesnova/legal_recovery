import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { parse as parseCsvSync } from "csv-parse/sync";
import Excel from "exceljs";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";
import { StorageService } from "../common/services/storage.service";
import {
  AuthenticatedUser,
  UserRole,
} from "../common/decorators/current-user.decorator";

/** Max rows processed per upload. Larger files require the async BullMQ pipeline (TODO). */
const MAX_ROWS = 10000;

export interface IngestRow {
  idNumber: string;
  firstName: string;
  lastName: string;
  caseNumber?: string;
  totalBalance: number;
  productType?: string;
  originalAmount?: number;
  currentBalance?: number;
  interestRate?: number;
}

export interface IngestSummary {
  portfolioId: string;
  rowsProcessed: number;
  casesCreated: number;
  debtorsCreated: number;
  debtorsReused: number;
  skipped: number;
  errors: string[];
  storageKey?: string;
}

// Column header aliases (lowercased, trimmed) mapped to canonical fields.
const HEADER_ALIASES: Record<keyof IngestRow | "ignored", string[]> = {
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

@Injectable()
export class PortfolioIngestService {
  private readonly logger = new Logger(PortfolioIngestService.name);

  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async ingest(
    file: Express.Multer.File,
    portfolioId: string,
    user: AuthenticatedUser,
  ): Promise<IngestSummary> {
    const portfolio = await this.assertPortfolioInTenant(portfolioId, user);

    // Persist the raw upload to object storage for provenance / audit.
    const storageKey = this.storage.buildKey(
      `portfolios/${portfolio.id}`,
      file.originalname,
    );
    await this.storage.put(storageKey, file.buffer, file.mimetype);

    const rows = await this.parse(file.buffer, file.originalname);
    if (rows.length === 0) {
      throw new BadRequestException("No data rows found in the uploaded file");
    }
    if (rows.length > MAX_ROWS) {
      throw new BadRequestException(
        `File has ${rows.length} rows; the synchronous ingest limit is ${MAX_ROWS}. Use the async pipeline for larger files.`,
      );
    }

    const summary: IngestSummary = {
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

  /**
   * Process each parsed row, accumulating counts/errors in the summary. Shared
   * by the synchronous {@link ingest} path and the async BullMQ processor so
   * both produce identical results.
   */
  async processRows(
    rows: IngestRow[],
    portfolio: { id: string; institutionId: string },
    summary: IngestSummary,
  ): Promise<void> {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        await this.ingestRow(row, portfolio, i, summary);
      } catch (err: unknown) {
        summary.errors.push(
          `Row ${i + 2}: ${(err as Error)?.message ?? "unexpected error"}`,
        );
        summary.skipped += 1;
      }
    }
  }

  /**
   * Recompute the portfolio total from its live cases and mark it ACTIVE.
   * Shared by the synchronous {@link ingest} path and the async processor.
   */
  async finalizeIngest(
    portfolio: { id: string; institutionId: string },
    summary: IngestSummary,
    storageKey: string,
  ): Promise<void> {
    // Recompute the portfolio total from its live cases.
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

    this.logger.log(
      `Portfolio ${portfolio.id} ingested: ${summary.casesCreated} cases, ${summary.debtorsCreated} new debtors, ${summary.skipped} skipped, ${summary.errors.length} errors`,
    );
  }

  private async ingestRow(
    row: IngestRow,
    portfolio: { id: string; institutionId: string },
    index: number,
    summary: IngestSummary,
  ): Promise<void> {
    // find-or-create the debtor by national id (unique per person, shared
    // across institutions — access is governed by the tenant-scoped Case, not
    // the Debtor row). The unique constraint on idNumber makes this race-safe:
    // if a concurrent ingest creates the debtor between our findFirst and
    // create, the create throws P2002 and we re-fetch and reuse it.
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
      } catch (err) {
        if (this.isUniqueViolation(err)) {
          debtor = await this.prisma.debtor.findFirst({
            where: { idNumber: row.idNumber },
            select: { id: true },
          });
          if (!debtor) throw err;
          summary.debtorsReused += 1;
        } else {
          throw err;
        }
      }
    } else {
      summary.debtorsReused += 1;
    }

    const caseNumber =
      row.caseNumber?.trim() ||
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

    if (
      row.productType ||
      row.originalAmount !== undefined ||
      row.currentBalance !== undefined
    ) {
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

  /** Parse a CSV or XLSX buffer into normalized ingest rows. */
  async parse(buffer: Buffer, filename: string): Promise<IngestRow[]> {
    const lower = filename.toLowerCase();
    if (lower.endsWith(".xlsx") || lower.endsWith(".xlsm")) {
      return this.parseXlsx(buffer);
    }
    return this.parseCsv(buffer);
  }

  private parseCsv(buffer: Buffer): IngestRow[] {
    let records: Record<string, string>[] = [];
    try {
      records = parseCsvSync(buffer, {
        columns: true,
        delimiter: [",", ";", "\t"],
        trim: true,
        skip_empty_lines: true,
        bom: true,
        relax_column_count: true,
      });
    } catch (err: unknown) {
      throw new BadRequestException(
        `Could not parse CSV: ${(err as Error)?.message ?? err}`,
      );
    }
    return records
      .map((r) => this.normalizeRow(r))
      .filter((row): row is IngestRow => row !== null);
  }

  private async parseXlsx(buffer: Buffer): Promise<IngestRow[]> {
    const workbook = new Excel.Workbook();
    // Cast through the exact parameter type: @types/node 22 widened Buffer to
    // Buffer<ArrayBufferLike>, which is not assignable to exceljs's Buffer param.
    await workbook.xlsx.load(
      buffer as unknown as Parameters<typeof workbook.xlsx.load>[0],
    );
    const ws = workbook.worksheets[0];
    if (!ws) {
      throw new BadRequestException("XLSX workbook has no worksheets");
    }
    const headerValues = (ws.getRow(1).values ?? []) as unknown[];
    const headers = headerValues
      .map((v) => (v === undefined || v === null ? "" : String(v)))
      .map((s) => s.trim().toLowerCase());

    const rows: IngestRow[] = [];
    for (let r = 2; r <= ws.rowCount; r++) {
      const values = (ws.getRow(r).values ?? []) as unknown[];
      const raw: Record<string, string> = {};
      headers.forEach((h, idx) => {
        if (!h) return;
        const v = values[idx];
        raw[h] = v === undefined || v === null ? "" : String(v);
      });
      const row = this.normalizeRow(raw);
      if (row) rows.push(row);
    }
    return rows;
  }

  /** Map a raw header->value record to a canonical IngestRow, or null if invalid. */
  normalizeRow(raw: Record<string, string>): IngestRow | null {
    const mapping: Record<string, string> = {};
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

  private canonicalHeader(header: string): keyof typeof HEADER_ALIASES | null {
    const h = header.trim().toLowerCase();
    for (const key of Object.keys(
      HEADER_ALIASES,
    ) as (keyof typeof HEADER_ALIASES)[]) {
      if (HEADER_ALIASES[key].includes(h)) return key;
    }
    return null;
  }

  /**
   * Parse a numeric string tolerating ES (1.234,56) and EN (1,234.56)
   * thousand separators. Returns null when the value is not a valid number.
   */
  toNumber(value: string): number | null {
    if (!value) return null;
    const raw = value.trim().replace(/[^\d.,-]/g, "");
    if (!raw) return null;
    const hasDot = raw.includes(".");
    const hasComma = raw.includes(",");
    let normalized = raw;
    if (hasDot && hasComma) {
      // The rightmost separator is the decimal mark; drop the other.
      if (raw.lastIndexOf(",") > raw.lastIndexOf(".")) {
        normalized = raw.replace(/\./g, "").replace(",", ".");
      } else {
        normalized = raw.replace(/,/g, "");
      }
    } else if (hasComma) {
      // Comma-only → decimal mark (ES).
      normalized = raw.replace(",", ".");
    }
    const n = Number(normalized);
    return isNaN(n) ? null : n;
  }

  private isUniqueViolation(err: unknown): boolean {
    return (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    );
  }

  /**
   * Assert the portfolio exists, is not soft-deleted, and belongs to the
   * caller's institution (super_admin bypasses). Public so the async producer
   * can reuse the exact same tenant guard before enqueuing a job.
   */
  async assertPortfolioInTenant(portfolioId: string, user: AuthenticatedUser) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
      select: { id: true, institutionId: true, deletedAt: true },
    });

    if (!portfolio || portfolio.deletedAt) {
      throw new NotFoundException("Portfolio not found");
    }
    if (
      user.role !== UserRole.SUPER_ADMIN &&
      portfolio.institutionId !== user.institutionId
    ) {
      throw new ForbiddenException(
        "Portfolio does not belong to your institution",
      );
    }
    return { id: portfolio.id, institutionId: portfolio.institutionId };
  }
}
