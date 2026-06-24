import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { isAgreementActiveForPayment } from "../rules/rule-evaluation";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import {
  AuthenticatedUser,
  UserRole,
} from "../common/decorators/current-user.decorator";

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(caseId: string | undefined, user: AuthenticatedUser) {
    const where: {
      deletedAt: null;
      caseId?: string;
      institutionId?: string;
    } = { deletedAt: null };

    if (caseId) where.caseId = caseId;

    if (user.role !== UserRole.SUPER_ADMIN) {
      if (!user.institutionId) {
        throw new ForbiddenException("User is not assigned to any institution");
      }
      where.institutionId = user.institutionId;
    }

    return this.prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        case: { select: { id: true, caseNumber: true } },
        institution: { select: { id: true, name: true } },
        agreement: { select: { id: true, type: true } },
      },
    });
  }

  async findById(id: string, user: AuthenticatedUser) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        case: { select: { id: true, caseNumber: true } },
        institution: { select: { id: true, name: true } },
        agreement: { select: { id: true, type: true } },
      },
    });

    if (!payment || payment.deletedAt) {
      throw new NotFoundException("Payment not found");
    }

    if (
      user.role !== UserRole.SUPER_ADMIN &&
      payment.institutionId !== user.institutionId
    ) {
      throw new ForbiddenException(
        "Payment does not belong to your institution",
      );
    }

    return payment;
  }

  async create(data: CreatePaymentDto, user: AuthenticatedUser) {
    const institutionId =
      user.role === UserRole.SUPER_ADMIN
        ? data.institutionId
        : user.institutionId;

    if (!institutionId) {
      throw new ForbiddenException(
        "Institution is required to create a payment",
      );
    }

    const caseRecord = await this.prisma.case.findUnique({
      where: { id: data.caseId },
      select: { id: true, institutionId: true },
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

    if (data.agreementId) {
      const agreement = await this.prisma.agreement.findUnique({
        where: { id: data.agreementId },
        select: { id: true, institutionId: true, status: true },
      });

      if (!agreement) {
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

      // Payments are only accepted against approved/active/completed agreements.
      if (!isAgreementActiveForPayment(agreement.status)) {
        throw new ConflictException(
          `Cannot register a payment against an agreement with status ${agreement.status}; it must be approved, active, or completed first.`,
        );
      }
    }

    return this.prisma.payment.create({
      data: {
        caseId: data.caseId,
        institutionId,
        agreementId: data.agreementId,
        amount: data.amount,
        method: data.method,
        reference: data.reference,
        receiptPath: data.receiptPath,
        status: data.status || "PENDING",
      },
      include: {
        case: { select: { id: true, caseNumber: true } },
        institution: { select: { id: true, name: true } },
        agreement: { select: { id: true, type: true } },
      },
    });
  }

  async update(id: string, data: UpdatePaymentDto, user: AuthenticatedUser) {
    await this.findById(id, user); // ensure exists and belongs to tenant

    const updateData: {
      amount?: number;
      method?: import("@prisma/client").PaymentMethod;
      reference?: string;
      receiptPath?: string;
      status?: import("@prisma/client").PaymentStatus;
      agreementId?: string | null;
      caseId?: string;
      institutionId?: string;
    } = {
      amount: data.amount,
      method: data.method,
      reference: data.reference,
      receiptPath: data.receiptPath,
      status: data.status,
      agreementId: data.agreementId,
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

    if (data.agreementId) {
      const agreement = await this.prisma.agreement.findUnique({
        where: { id: data.agreementId },
        select: { id: true, institutionId: true, status: true },
      });

      if (!agreement) {
        throw new NotFoundException("Target agreement not found");
      }

      if (
        user.role !== UserRole.SUPER_ADMIN &&
        agreement.institutionId !== user.institutionId
      ) {
        throw new ForbiddenException(
          "Target agreement does not belong to your institution",
        );
      }

      if (!isAgreementActiveForPayment(agreement.status)) {
        throw new ConflictException(
          `Cannot attach a payment to an agreement with status ${agreement.status}; it must be approved, active, or completed first.`,
        );
      }
    }

    if (user.role === UserRole.SUPER_ADMIN && data.institutionId) {
      updateData.institutionId = data.institutionId;
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    return this.prisma.payment.update({
      where: { id },
      data: updateData,
      include: {
        case: { select: { id: true, caseNumber: true } },
        institution: { select: { id: true, name: true } },
        agreement: { select: { id: true, type: true } },
      },
    });
  }

  async reconcile(id: string, user: AuthenticatedUser) {
    await this.findById(id, user); // ensure exists and belongs to tenant

    return this.prisma.payment.update({
      where: { id },
      data: {
        status: "RECONCILED",
        reconciledBy: user.userId,
        reconciledAt: new Date(),
      },
      include: {
        case: { select: { id: true, caseNumber: true } },
        institution: { select: { id: true, name: true } },
      },
    });
  }

  async remove(id: string, user: AuthenticatedUser) {
    await this.findById(id, user); // ensure exists and belongs to tenant

    return this.prisma.payment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
