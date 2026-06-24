import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { PortfolioRulesService } from "../rules/portfolio-rules.service";
import { validateAgreementAgainstRules } from "../rules/rule-evaluation";
import { CreateAgreementDto } from "./dto/create-agreement.dto";
import { UpdateAgreementDto } from "./dto/update-agreement.dto";
import {
  AuthenticatedUser,
  UserRole,
} from "../common/decorators/current-user.decorator";

@Injectable()
export class AgreementsService {
  constructor(
    private prisma: PrismaService,
    private rulesService: PortfolioRulesService,
  ) {}

  async findAll(caseId: string | undefined, user: AuthenticatedUser) {
    const where = { deletedAt: null } as {
      deletedAt: null;
      caseId?: string;
      institutionId?: string;
    };

    if (caseId) {
      where.caseId = caseId;
    }

    if (user.role !== UserRole.SUPER_ADMIN) {
      if (!user.institutionId) {
        throw new ForbiddenException("User is not assigned to any institution");
      }
      where.institutionId = user.institutionId;
    }

    return this.prisma.agreement.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        case: { select: { id: true, caseNumber: true } },
        institution: { select: { id: true, name: true } },
        payments: true,
        promises: true,
      },
    });
  }

  async findById(id: string, user: AuthenticatedUser) {
    const agreement = await this.prisma.agreement.findUnique({
      where: { id },
      include: {
        case: { select: { id: true, caseNumber: true } },
        institution: { select: { id: true, name: true } },
        payments: true,
        promises: true,
      },
    });

    if (!agreement || agreement.deletedAt) {
      throw new NotFoundException("Agreement not found");
    }

    if (
      user.role !== UserRole.SUPER_ADMIN &&
      agreement.institutionId !== user.institutionId
    ) {
      throw new ForbiddenException(
        "Agreement does not belong to your institution",
      );
    }

    return agreement;
  }

  async create(data: CreateAgreementDto, user: AuthenticatedUser) {
    const institutionId =
      user.role === UserRole.SUPER_ADMIN
        ? data.institutionId
        : user.institutionId;

    if (!institutionId) {
      throw new ForbiddenException(
        "Institution is required to create an agreement",
      );
    }

    // Validate the case belongs to the user's institution before creating an agreement.
    const caseRecord = await this.prisma.case.findUnique({
      where: { id: data.caseId },
      select: { id: true, institutionId: true, portfolioId: true },
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

    // Apply institution/portfolio rules: validate discount + installments and
    // decide whether the agreement may be auto-approved (business rule #8:
    // spending is governed by configured caps, not equal across cases).
    const rules = await this.rulesService.getEffectiveRules(
      institutionId,
      caseRecord.portfolioId,
    );
    const validation = validateAgreementAgainstRules(
      {
        type: data.type,
        amount: data.amount,
        discountPercentage: data.discountPercentage,
        installments: data.installments,
      },
      rules,
    );
    if (!validation.ok) {
      throw new BadRequestException({
        message: "Agreement violates institution rules",
        violations: validation.violations,
      });
    }

    // Status routing: an explicit status wins; otherwise auto-approve when
    // within the configured auto caps, else require manual approval.
    let status: import("@prisma/client").AgreementStatus | undefined =
      data.status;
    let approvedBy: string | undefined;
    let approvedAt: Date | undefined;
    if (!status) {
      if (validation.autoApproved) {
        status = "APPROVED";
        approvedBy = user.userId;
        approvedAt = new Date();
      } else {
        status = "PENDING_APPROVAL";
      }
    }

    return this.prisma.agreement.create({
      data: {
        caseId: data.caseId,
        institutionId,
        type: data.type,
        amount: data.amount,
        discountPercentage: data.discountPercentage,
        installments: data.installments,
        status,
        approvedBy: approvedBy ?? null,
        approvedAt: approvedAt ?? null,
        createdBy: user.userId,
      },
      include: {
        case: { select: { id: true, caseNumber: true } },
        institution: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, data: UpdateAgreementDto, user: AuthenticatedUser) {
    await this.findById(id, user); // ensure exists and belongs to tenant

    const updateData: {
      type?: import("@prisma/client").AgreementType;
      amount?: number;
      discountPercentage?: number;
      installments?: number;
      status?: import("@prisma/client").AgreementStatus;
      caseId?: string;
      institutionId?: string;
    } = {
      type: data.type,
      amount: data.amount,
      discountPercentage: data.discountPercentage,
      installments: data.installments,
      status: data.status,
    };

    if (data.caseId) {
      const caseRecord = await this.prisma.case.findUnique({
        where: { id: data.caseId },
        select: { id: true, institutionId: true },
      });

      if (!caseRecord) {
        throw new NotFoundException("Target case not found");
      }

      if (
        user.role !== UserRole.SUPER_ADMIN &&
        caseRecord.institutionId !== user.institutionId
      ) {
        throw new ForbiddenException(
          "Target case does not belong to your institution",
        );
      }

      updateData.caseId = data.caseId;
    }

    if (user.role === UserRole.SUPER_ADMIN && data.institutionId) {
      updateData.institutionId = data.institutionId;
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    return this.prisma.agreement.update({
      where: { id },
      data: updateData,
      include: {
        case: { select: { id: true, caseNumber: true } },
        institution: { select: { id: true, name: true } },
      },
    });
  }

  async approve(id: string, user: AuthenticatedUser) {
    await this.findById(id, user); // ensure exists and belongs to tenant

    return this.prisma.agreement.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedBy: user.userId,
        approvedAt: new Date(),
      },
      include: {
        case: { select: { id: true, caseNumber: true } },
        institution: { select: { id: true, name: true } },
      },
    });
  }

  async remove(id: string, user: AuthenticatedUser) {
    await this.findById(id, user); // ensure exists and belongs to tenant

    return this.prisma.agreement.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
