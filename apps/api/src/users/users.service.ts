import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../common/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  AuthenticatedUser,
  UserRole,
} from "../common/decorators/current-user.decorator";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string, actor: AuthenticatedUser) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");

    if (
      actor.role !== UserRole.SUPER_ADMIN &&
      user.institutionId !== actor.institutionId
    ) {
      throw new ForbiddenException("User does not belong to your institution");
    }

    return user;
  }

  async create(data: CreateUserDto, actor: AuthenticatedUser) {
    if (
      actor.role !== UserRole.SUPER_ADMIN &&
      data.institutionId &&
      data.institutionId !== actor.institutionId
    ) {
      throw new ForbiddenException(
        "Cannot assign user to a different institution",
      );
    }

    const institutionId =
      actor.role === UserRole.SUPER_ADMIN
        ? data.institutionId
        : actor.institutionId;

    const createData: {
      email: string;
      name: string;
      role: import("@prisma/client").UserRole;
      passwordHash?: string;
      institutionId?: string;
      status?: import("@prisma/client").EntityStatus;
      mfaEnabled?: boolean;
    } = {
      email: data.email,
      name: data.name,
      role: data.role,
      institutionId,
      status: data.status,
      mfaEnabled: data.mfaEnabled,
    };

    if (data.password) {
      createData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.create({ data: createData });
  }

  async findAll(institutionId: string | undefined, actor: AuthenticatedUser) {
    const where: { institutionId?: string; deletedAt?: null } = {};

    if (actor.role !== UserRole.SUPER_ADMIN) {
      if (!actor.institutionId) {
        throw new ForbiddenException("User is not assigned to any institution");
      }
      where.institutionId = actor.institutionId;
    } else if (institutionId) {
      where.institutionId = institutionId;
    }

    return this.prisma.user.findMany({ where, orderBy: { createdAt: "desc" } });
  }

  async update(id: string, data: UpdateUserDto, actor: AuthenticatedUser) {
    await this.findById(id, actor);

    if (
      actor.role !== UserRole.SUPER_ADMIN &&
      data.institutionId &&
      data.institutionId !== actor.institutionId
    ) {
      throw new ForbiddenException(
        "Cannot move user to a different institution",
      );
    }

    const updateData: {
      email?: string;
      name?: string;
      role?: import("@prisma/client").UserRole;
      passwordHash?: string;
      institutionId?: string | null;
      status?: import("@prisma/client").EntityStatus;
      mfaEnabled?: boolean;
    } = {
      email: data.email,
      name: data.name,
      role: data.role,
      status: data.status,
      mfaEnabled: data.mfaEnabled,
    };

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    if (data.institutionId !== undefined) {
      updateData.institutionId = data.institutionId;
    }

    // Non-super-admins cannot change their own or others' role to SUPER_ADMIN.
    if (
      (data.role as string) === UserRole.SUPER_ADMIN &&
      actor.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        "Only super administrators can assign the super_admin role",
      );
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    return this.prisma.user.update({ where: { id }, data: updateData });
  }

  async remove(id: string, actor: AuthenticatedUser) {
    const existing = await this.findById(id, actor);

    if (
      (existing.role as string) === "super_admin" ||
      (existing.role as string) === "SUPER_ADMIN"
    ) {
      throw new BadRequestException("Cannot delete a super administrator");
    }

    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), status: "SUSPENDED" },
    });
  }
}
