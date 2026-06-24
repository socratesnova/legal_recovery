import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { UpdatePortfolioDto } from "./dto/update-portfolio.dto";
import {
  AuthenticatedUser,
  UserRole,
} from "../common/decorators/current-user.decorator";

@Injectable()
export class PortfoliosService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: AuthenticatedUser) {
    const where = { deletedAt: null } as {
      deletedAt: null;
      institutionId?: string;
    };

    if (user.role !== UserRole.SUPER_ADMIN) {
      if (!user.institutionId) {
        throw new ForbiddenException("User is not assigned to any institution");
      }
      where.institutionId = user.institutionId;
    }

    return this.prisma.portfolio.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        institution: { select: { id: true, name: true } },
        rules: true,
        _count: {
          select: { cases: true },
        },
      },
    });
  }

  async findById(id: string, user: AuthenticatedUser) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
      include: {
        institution: true,
        rules: true,
        cases: {
          where: { deletedAt: null },
          include: {
            debtor: true,
            products: true,
          },
        },
      },
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

    return portfolio;
  }

  async create(data: CreatePortfolioDto, user: AuthenticatedUser) {
    const institutionId =
      user.role === UserRole.SUPER_ADMIN
        ? data.institutionId
        : user.institutionId;

    if (!institutionId) {
      throw new ForbiddenException(
        "Institution is required to create a portfolio",
      );
    }

    return this.prisma.portfolio.create({
      data: {
        name: data.name,
        institutionId,
        type: data.type,
        totalAmount: data.totalAmount,
        currency: data.currency || "DOP",
        fileSource: data.fileSource,
        uploadDate: data.uploadDate ? new Date(data.uploadDate) : new Date(),
        status: data.status || "ACTIVE",
      },
      include: {
        institution: { select: { id: true, name: true } },
        rules: true,
      },
    });
  }

  async update(id: string, data: UpdatePortfolioDto, user: AuthenticatedUser) {
    await this.findById(id, user); // ensure exists and belongs to tenant

    const updateData: {
      name?: string;
      type?: import("@prisma/client").PortfolioType;
      totalAmount?: number;
      currency?: string;
      fileSource?: string;
      uploadDate?: Date;
      status?: import("@prisma/client").PortfolioStatus;
      institutionId?: string;
    } = {
      name: data.name,
      type: data.type,
      totalAmount: data.totalAmount,
      currency: data.currency,
      fileSource: data.fileSource,
      uploadDate: data.uploadDate ? new Date(data.uploadDate) : undefined,
      status: data.status,
    };

    if (user.role === UserRole.SUPER_ADMIN && data.institutionId) {
      updateData.institutionId = data.institutionId;
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    return this.prisma.portfolio.update({
      where: { id },
      data: updateData,
      include: {
        institution: { select: { id: true, name: true } },
        rules: true,
      },
    });
  }

  async remove(id: string, user: AuthenticatedUser) {
    await this.findById(id, user); // ensure exists and belongs to tenant

    return this.prisma.portfolio.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
