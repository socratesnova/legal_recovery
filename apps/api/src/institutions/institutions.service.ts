import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";

@Injectable()
export class InstitutionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.institution.create({ data });
  }

  async findAll() {
    return this.prisma.institution.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const inst = await this.prisma.institution.findUnique({ where: { id } });
    if (!inst || inst.deletedAt)
      throw new NotFoundException("Institution not found");
    return inst;
  }

  async update(id: string, data: any) {
    return this.prisma.institution.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.institution.update({
      where: { id },
      data: { deletedAt: new Date(), status: "SUSPENDED" },
    });
  }
}
