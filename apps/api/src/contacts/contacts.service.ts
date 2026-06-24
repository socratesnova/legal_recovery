import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { CreateContactDto, UpdateContactDto } from "./dto/create-contact.dto";
import {
  AuthenticatedUser,
  UserRole,
} from "../common/decorators/current-user.decorator";

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async findAll(debtorId: string | undefined, user: AuthenticatedUser) {
    const where: {
      deletedAt: null;
      debtorId?: string;
      debtor?: { cases: { some: { institutionId: string } } };
    } = { deletedAt: null };

    if (debtorId) {
      await this.assertDebtorInTenant(debtorId, user);
      where.debtorId = debtorId;
    } else if (user.role !== UserRole.SUPER_ADMIN) {
      if (!user.institutionId) {
        throw new ForbiddenException("User is not assigned to any institution");
      }
      where.debtor = { cases: { some: { institutionId: user.institutionId } } };
    }

    return this.prisma.contact.findMany({
      where,
      orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
    });
  }

  async findById(id: string, user: AuthenticatedUser) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!contact || contact.deletedAt) {
      throw new NotFoundException("Contact not found");
    }

    await this.assertDebtorInTenant(contact.debtorId, user);
    return contact;
  }

  async create(data: CreateContactDto, user: AuthenticatedUser) {
    await this.assertDebtorInTenant(data.debtorId, user);

    // Only one primary contact per channel per debtor.
    if (data.isPrimary) {
      await this.clearExistingPrimary(data.debtorId, data.channel);
    }

    return this.prisma.contact.create({
      data: {
        debtorId: data.debtorId,
        channel: data.channel,
        value: data.value,
        isPrimary: data.isPrimary ?? false,
        optIn: data.optIn ?? false,
        optInDate: data.optInDate ? new Date(data.optInDate) : undefined,
        dataPassportId: data.dataPassportId,
      },
    });
  }

  async update(id: string, data: UpdateContactDto, user: AuthenticatedUser) {
    const existing = await this.findById(id, user);

    if (data.isPrimary) {
      await this.clearExistingPrimary(existing.debtorId, existing.channel, id);
    }

    const updateData: {
      value?: string;
      isPrimary?: boolean;
      optIn?: boolean;
      optInDate?: Date;
      dataPassportId?: string;
    } = {
      value: data.value,
      isPrimary: data.isPrimary,
      optIn: data.optIn,
      optInDate: data.optInDate ? new Date(data.optInDate) : undefined,
      dataPassportId: data.dataPassportId,
    };

    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    return this.prisma.contact.update({ where: { id }, data: updateData });
  }

  async remove(id: string, user: AuthenticatedUser) {
    await this.findById(id, user);
    return this.prisma.contact.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private async clearExistingPrimary(
    debtorId: string,
    channel: import("@prisma/client").ContactChannel,
    exceptId?: string,
  ) {
    const existing = await this.prisma.contact.findFirst({
      where: { debtorId, channel, isPrimary: true, deletedAt: null },
    });
    if (existing && existing.id !== exceptId) {
      await this.prisma.contact.update({
        where: { id: existing.id },
        data: { isPrimary: false },
      });
    }
  }

  private async assertDebtorInTenant(
    debtorId: string,
    user: AuthenticatedUser,
  ) {
    if (user.role === UserRole.SUPER_ADMIN) return;

    if (!user.institutionId) {
      throw new ForbiddenException("User is not assigned to any institution");
    }

    const tenantCase = await this.prisma.case.findFirst({
      where: { debtorId, institutionId: user.institutionId, deletedAt: null },
      select: { id: true },
    });

    if (!tenantCase) {
      throw new ForbiddenException(
        "Debtor does not belong to your institution",
      );
    }
  }
}
