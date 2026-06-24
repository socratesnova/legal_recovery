import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { CreateCaseDto } from "./dto/create-case.dto";
import { UpdateCaseDto } from "./dto/update-case.dto";
import { CaseFilterDto } from "./dto/filter-case.dto";
import {
  AuthenticatedUser,
  UserRole,
} from "../common/decorators/current-user.decorator";

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: CaseFilterDto, user: AuthenticatedUser) {
    const where = { deletedAt: null } as {
      deletedAt: null;
      institutionId?: string;
      portfolioId?: string;
      status?: import("@prisma/client").CaseStatus;
      debtorId?: string;
      OR?: unknown[];
    };

    if (user.role !== UserRole.SUPER_ADMIN) {
      if (!user.institutionId) {
        throw new ForbiddenException("User is not assigned to any institution");
      }
      where.institutionId = user.institutionId;
    } else if (filter.institutionId) {
      where.institutionId = filter.institutionId;
    }

    if (filter.portfolioId) {
      where.portfolioId = filter.portfolioId;
    }
    if (filter.status) {
      where.status = filter.status;
    }
    if (filter.debtorId) {
      where.debtorId = filter.debtorId;
    }
    if (filter.search) {
      where.OR = [
        { caseNumber: { contains: filter.search, mode: "insensitive" } },
        {
          debtor: {
            OR: [
              { firstName: { contains: filter.search, mode: "insensitive" } },
              { lastName: { contains: filter.search, mode: "insensitive" } },
              { idNumber: { contains: filter.search, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    return this.prisma.case.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        debtor: true,
        institution: { select: { id: true, name: true } },
        portfolio: { select: { id: true, name: true } },
        products: true,
        _count: {
          select: {
            documents: true,
            communications: true,
            agreements: true,
            payments: true,
            disputes: true,
          },
        },
      },
    });
  }

  async findById(id: string, user: AuthenticatedUser) {
    const caseData = await this.prisma.case.findUnique({
      where: { id },
      include: {
        debtor: { include: { contacts: true } },
        institution: true,
        portfolio: { include: { rules: true } },
        products: true,
        documents: { where: { deletedAt: null } },
        communications: { orderBy: { createdAt: "desc" } },
        agreements: { include: { promises: true } },
        payments: true,
        disputes: true,
        dataPassports: true,
      },
    });

    if (!caseData || caseData.deletedAt) {
      throw new NotFoundException("Case not found");
    }

    if (
      user.role !== UserRole.SUPER_ADMIN &&
      caseData.institutionId !== user.institutionId
    ) {
      throw new ForbiddenException("Case does not belong to your institution");
    }

    return caseData;
  }

  async create(data: CreateCaseDto, user: AuthenticatedUser) {
    const institutionId =
      user.role === UserRole.SUPER_ADMIN
        ? data.institutionId
        : user.institutionId;

    if (!institutionId) {
      throw new ForbiddenException("Institution is required to create a case");
    }

    let debtorId = data.debtorId;

    // Create debtor inline if not provided
    if (!debtorId && data.debtor) {
      const existing = await this.prisma.debtor.findFirst({
        where: { idNumber: data.debtor.idNumber },
      });

      if (existing) {
        debtorId = existing.id;
      } else {
        const newDebtor = await this.prisma.debtor.create({
          data: {
            firstName: data.debtor.firstName,
            lastName: data.debtor.lastName,
            idNumber: data.debtor.idNumber,
            idType: data.debtor.idType || "cedula",
          },
        });
        debtorId = newDebtor.id;
      }
    }

    if (!debtorId) {
      throw new BadRequestException(
        "Either debtorId or debtor data is required",
      );
    }

    const caseData = await this.prisma.case.create({
      data: {
        caseNumber: data.caseNumber,
        institutionId,
        portfolioId: data.portfolioId,
        debtorId,
        totalBalance: data.totalBalance,
        status: data.status || "ACTIVE",
        scoreDocumental: data.scoreDocumental,
        scoreRecoverability: data.scoreRecoverability,
        scoreContactability: data.scoreContactability,
        scoreRisk: data.scoreRisk,
        nextAction: data.nextAction,
        nextActionDate: data.nextActionDate
          ? new Date(data.nextActionDate)
          : undefined,
        products: data.products
          ? {
              create: data.products.map((p) => ({
                productType: p.productType,
                originalAmount: p.originalAmount,
                currentBalance: p.currentBalance,
                interestRate: p.interestRate,
              })),
            }
          : undefined,
      },
      include: {
        debtor: true,
        products: true,
        institution: { select: { id: true, name: true } },
        portfolio: { select: { id: true, name: true } },
      },
    });

    return caseData;
  }

  async update(id: string, data: UpdateCaseDto, user: AuthenticatedUser) {
    await this.findById(id, user); // ensure exists and belongs to tenant

    const updateData: {
      caseNumber?: string;
      totalBalance?: number;
      status?: import("@prisma/client").CaseStatus;
      scoreDocumental?: number;
      scoreRecoverability?: number;
      scoreContactability?: number;
      scoreRisk?: number;
      nextAction?: string;
      nextActionDate?: Date;
      institutionId?: string;
      portfolioId?: string;
      debtorId?: string;
    } = {
      caseNumber: data.caseNumber,
      totalBalance: data.totalBalance,
      status: data.status,
      scoreDocumental: data.scoreDocumental,
      scoreRecoverability: data.scoreRecoverability,
      scoreContactability: data.scoreContactability,
      scoreRisk: data.scoreRisk,
      nextAction: data.nextAction,
      nextActionDate: data.nextActionDate
        ? new Date(data.nextActionDate)
        : undefined,
    };

    if (user.role === UserRole.SUPER_ADMIN) {
      if (data.institutionId) updateData.institutionId = data.institutionId;
    }
    if (data.portfolioId) updateData.portfolioId = data.portfolioId;
    if (data.debtorId) updateData.debtorId = data.debtorId;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    return this.prisma.case.update({
      where: { id },
      data: updateData,
      include: {
        debtor: true,
        products: true,
        institution: { select: { id: true, name: true } },
        portfolio: { select: { id: true, name: true } },
      },
    });
  }

  async remove(id: string, user: AuthenticatedUser) {
    await this.findById(id, user);

    return this.prisma.case.update({
      where: { id },
      data: { deletedAt: new Date(), status: "CLOSED" },
    });
  }
}
