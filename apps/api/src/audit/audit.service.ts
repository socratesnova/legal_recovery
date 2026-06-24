import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { QueryAuditDto } from "./dto/query-audit.dto";
import {
  AuthenticatedUser,
  UserRole,
} from "../common/decorators/current-user.decorator";

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryAuditDto, user: AuthenticatedUser) {
    const where: {
      institutionId?: string;
      action?: import("@prisma/client").AuditAction;
      entityType?: string;
      entityId?: string;
      userId?: string;
      createdAt?: { gte?: Date; lte?: Date };
    } = {};

    // Non-super-admins are strictly scoped to their own institution.
    if (user.role !== UserRole.SUPER_ADMIN) {
      if (!user.institutionId) {
        throw new ForbiddenException("User is not assigned to any institution");
      }
      where.institutionId = user.institutionId;
    } else if (query.institutionId) {
      where.institutionId = query.institutionId;
    }

    if (query.action) where.action = query.action;
    if (query.entityType) where.entityType = query.entityType;
    if (query.entityId) where.entityId = query.entityId;
    if (query.userId) where.userId = query.userId;

    if (query.from || query.to) {
      where.createdAt = {};
      if (query.from) where.createdAt.gte = new Date(query.from);
      if (query.to) where.createdAt.lte = new Date(query.to);
    }

    const take = query.take ?? 50;
    const skip = query.skip ?? 0;

    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { items, total, skip, take };
  }

  async findById(id: string, user: AuthenticatedUser) {
    const entry = await this.prisma.auditLog.findUnique({ where: { id } });
    if (!entry) {
      throw new NotFoundException("Audit log entry not found");
    }

    if (
      user.role !== UserRole.SUPER_ADMIN &&
      entry.institutionId !== user.institutionId
    ) {
      throw new ForbiddenException(
        "Audit entry does not belong to your institution",
      );
    }

    return entry;
  }
}
