import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import {
  CreateDisputeDto,
  ResolveDisputeDto,
  UpdateDisputeDto,
} from "./dto/create-dispute.dto";
import {
  AuthenticatedUser,
  UserRole,
} from "../common/decorators/current-user.decorator";
import { DisputeStatus } from "@prisma/client";

@Injectable()
export class DisputesService {
  constructor(private prisma: PrismaService) {}

  async findAll(caseId: string | undefined, user: AuthenticatedUser) {
    const where: {
      caseId?: string;
      case?: { institutionId: string };
    } = {};

    if (caseId) {
      where.caseId = caseId;
    }

    if (user.role !== UserRole.SUPER_ADMIN) {
      if (!user.institutionId) {
        throw new ForbiddenException("User is not assigned to any institution");
      }
      where.case = { institutionId: user.institutionId };
    }

    return this.prisma.dispute.findMany({
      where,
      orderBy: { openedAt: "desc" },
      include: { case: { select: { id: true, caseNumber: true } } },
    });
  }

  async findById(id: string, user: AuthenticatedUser) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id },
      include: {
        case: { select: { id: true, caseNumber: true, institutionId: true } },
      },
    });

    if (!dispute) {
      throw new NotFoundException("Dispute not found");
    }

    this.assertTenant(dispute.case.institutionId, user);
    return dispute;
  }

  async open(data: CreateDisputeDto, user: AuthenticatedUser) {
    const caseRecord = await this.prisma.case.findUnique({
      where: { id: data.caseId },
      select: { id: true, institutionId: true },
    });

    if (!caseRecord) {
      throw new NotFoundException("Case not found");
    }

    this.assertTenant(caseRecord.institutionId, user);

    return this.prisma.dispute.create({
      data: {
        caseId: data.caseId,
        reason: data.reason,
        description: data.description,
        status: DisputeStatus.OPEN,
        openedBy: user.userId,
        openedAt: new Date(),
      },
      include: { case: { select: { id: true, caseNumber: true } } },
    });
  }

  async update(id: string, data: UpdateDisputeDto, user: AuthenticatedUser) {
    await this.findById(id, user);

    const updateData: { description?: string; resolution?: string } = {
      description: data.description,
      resolution: data.resolution,
    };

    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    return this.prisma.dispute.update({
      where: { id },
      data: updateData,
    });
  }

  async escalate(id: string, user: AuthenticatedUser) {
    await this.findById(id, user);
    return this.prisma.dispute.update({
      where: { id },
      data: { status: DisputeStatus.ESCALATED },
    });
  }

  async resolve(id: string, data: ResolveDisputeDto, user: AuthenticatedUser) {
    await this.findById(id, user);
    return this.prisma.dispute.update({
      where: { id },
      data: {
        status: DisputeStatus.RESOLVED,
        resolvedBy: user.userId,
        resolvedAt: new Date(),
        resolution: data.resolution,
      },
    });
  }

  private assertTenant(institutionId: string, user: AuthenticatedUser) {
    if (
      user.role !== UserRole.SUPER_ADMIN &&
      institutionId !== user.institutionId
    ) {
      throw new ForbiddenException(
        "Dispute does not belong to your institution",
      );
    }
  }
}
