import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { LegalFirewallService } from "../common/services/legal-firewall.service";
import {
  CreateCommunicationDto,
  UpdateCommunicationDto,
} from "./dto/create-communication.dto";
import {
  AuthenticatedUser,
  UserRole,
} from "../common/decorators/current-user.decorator";
import {
  CommChannel,
  CommDirection,
  CommStatus,
  ContactChannel,
} from "@prisma/client";
import {
  NotificationDispatcher,
  DispatchRequest,
} from "./notification-dispatcher";

@Injectable()
export class CommunicationsService {
  constructor(
    private prisma: PrismaService,
    private firewall: LegalFirewallService,
    private dispatcher: NotificationDispatcher,
  ) {}

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

    return this.prisma.communication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { case: { select: { id: true, caseNumber: true } } },
    });
  }

  async findById(id: string, user: AuthenticatedUser) {
    const comm = await this.prisma.communication.findUnique({
      where: { id },
      include: {
        case: { select: { id: true, caseNumber: true, institutionId: true } },
      },
    });

    if (!comm) {
      throw new NotFoundException("Communication not found");
    }

    this.assertTenant(comm.case.institutionId, user);
    return comm;
  }

  /**
   * Attempt to create a communication. The Legal Firewall is evaluated first:
   * if the action is blocked, the communication is STILL persisted (for the
   * audit trail) with status=BLOCKED and the block reasons — but no message
   * is sent. If allowed, it is created with status=PENDING and then dispatched
   * through the channel adapter (email/SMS/WhatsApp, or a manual log), and the
   * final status (SENT/FAILED), the simulated flag and the provider message id
   * are persisted. Dispatch never throws, so the request stays robust.
   */
  async create(
    data: CreateCommunicationDto,
    user: AuthenticatedUser,
    ipAddress?: string,
  ) {
    const caseRecord = await this.prisma.case.findUnique({
      where: { id: data.caseId },
      select: { id: true, institutionId: true, debtorId: true },
    });

    if (!caseRecord) {
      throw new NotFoundException("Case not found");
    }

    this.assertTenant(caseRecord.institutionId, user);

    const firewallResult = await this.firewall.canUseData(user, {
      caseId: data.caseId,
      purpose: "contact",
      channel: data.channel,
    });

    const blocked = !firewallResult.allowed;

    if (blocked) {
      return this.prisma.communication.create({
        data: {
          caseId: data.caseId,
          contactId: data.contactId,
          userId: user.userId,
          channel: data.channel,
          direction: data.direction ?? CommDirection.OUTBOUND,
          contentSummary: data.contentSummary,
          status: CommStatus.BLOCKED,
          blocked: true,
          blockReason: firewallResult.reasons.join(" | "),
          ipAddress,
        },
        include: { case: { select: { id: true, caseNumber: true } } },
      });
    }

    // Firewall allowed: record the attempt as PENDING, then dispatch.
    const communication = await this.prisma.communication.create({
      data: {
        caseId: data.caseId,
        contactId: data.contactId,
        userId: user.userId,
        channel: data.channel,
        direction: data.direction ?? CommDirection.OUTBOUND,
        contentSummary: data.contentSummary,
        status: CommStatus.PENDING,
        blocked: false,
        blockReason: null,
        ipAddress,
      },
    });

    const destination = await this.resolveDestination(
      caseRecord,
      data.channel,
      data.contactId,
    );

    // Provider channels need a destination on file. Manual channels (PHONE,
    // LETTER, ...) are recorded actions and need no destination.
    const needsDestination =
      this.commChannelToContactChannel(data.channel) !== null;
    if (needsDestination && !destination) {
      return this.prisma.communication.update({
        where: { id: communication.id },
        data: {
          status: CommStatus.FAILED,
          simulated: false,
          providerMessageId: null,
        },
        include: { case: { select: { id: true, caseNumber: true } } },
      });
    }

    const dispatchReq: DispatchRequest = {
      channel: data.channel,
      to: destination,
      contentSummary: data.contentSummary,
      caseId: data.caseId,
      contactId: data.contactId,
    };
    const result = await this.dispatcher.dispatch(dispatchReq);

    return this.prisma.communication.update({
      where: { id: communication.id },
      data: {
        status: result.status,
        simulated: result.simulated,
        providerMessageId: result.providerMessageId,
      },
      include: { case: { select: { id: true, caseNumber: true } } },
    });
  }

  async update(
    id: string,
    data: UpdateCommunicationDto,
    user: AuthenticatedUser,
  ) {
    const existing = await this.findById(id, user);

    // A blocked communication cannot transition to a "sent" state without
    // re-running the firewall (the underlying block must be resolved first).
    if (
      existing.blocked &&
      data.status &&
      data.status !== CommStatus.BLOCKED &&
      data.status !== CommStatus.FAILED
    ) {
      throw new ForbiddenException(
        "Cannot mark a firewall-blocked communication as sent. Resolve the block first.",
      );
    }

    const updateData: {
      contentSummary?: string;
      status?: CommStatus;
    } = {
      contentSummary: data.contentSummary,
      status: data.status,
    };

    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    return this.prisma.communication.update({
      where: { id },
      data: updateData,
    });
  }

  private async resolveDestination(
    caseRecord: { debtorId: string },
    channel: CommChannel,
    contactId?: string | null,
  ): Promise<string | null> {
    const contactChannel = this.commChannelToContactChannel(channel);
    if (!contactChannel) return null;

    if (contactId) {
      const contact = await this.prisma.contact.findUnique({
        where: { id: contactId },
        select: {
          value: true,
          channel: true,
          deletedAt: true,
          debtorId: true,
        },
      });
      if (!contact || contact.deletedAt || contact.channel !== contactChannel) {
        return null;
      }
      if (contact.debtorId !== caseRecord.debtorId) return null;
      return contact.value;
    }

    const contact = await this.prisma.contact.findFirst({
      where: {
        debtorId: caseRecord.debtorId,
        channel: contactChannel,
        deletedAt: null,
        optIn: true,
      },
      orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
      select: { value: true },
    });
    return contact?.value ?? null;
  }

  /**
   * Map a communication channel to the contact channel that holds the
   * destination value. Returns null for manual channels that the system
   * records but does not auto-dispatch (PHONE, LETTER, PORTAL, VOICEBOT).
   */
  private commChannelToContactChannel(
    channel: CommChannel,
  ): ContactChannel | null {
    switch (channel) {
      case CommChannel.EMAIL:
        return ContactChannel.EMAIL;
      case CommChannel.SMS:
        return ContactChannel.PHONE;
      case CommChannel.WHATSAPP:
        return ContactChannel.WHATSAPP;
      default:
        return null;
    }
  }

  private assertTenant(institutionId: string, user: AuthenticatedUser) {
    if (
      user.role !== UserRole.SUPER_ADMIN &&
      institutionId !== user.institutionId
    ) {
      throw new ForbiddenException(
        "Communication does not belong to your institution",
      );
    }
  }
}
