import { Injectable, Logger } from "@nestjs/common";
import { CommStatus } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";
import { mapProviderStatus, shouldTransition } from "./delivery-status.mapper";

export interface ReconcileInput {
  /** The provider's message id we persisted as `providerMessageId`. */
  providerMessageId: string;
  /** Raw status string from the provider (e.g. Twilio MessageStatus). */
  rawStatus: string;
  /** Provider name, for logging/traceability only. */
  provider?: string;
}

export interface ReconcileResult {
  communicationId: string;
  previousStatus: CommStatus;
  status: CommStatus;
  /** Whether the communication row was actually updated. */
  updated: boolean;
}

/**
 * Reconciles inbound delivery callbacks (DELIVERED/READ/FAILED) against the
 * persisted Communication record. Idempotent: duplicate or out-of-order events
 * are ignored via a monotonic state guard ({@link shouldTransition}), so
 * provider retries never regress a communication's status. Webhook controllers
 * delegate here.
 */
@Injectable()
export class DeliveryReconcilerService {
  private readonly logger = new Logger(DeliveryReconcilerService.name);

  constructor(private prisma: PrismaService) {}

  async reconcile(input: ReconcileInput): Promise<ReconcileResult | null> {
    const next = mapProviderStatus(input.rawStatus);
    if (!next) {
      this.logger.warn(
        `Unknown delivery status "${input.rawStatus}" from ${input.provider ?? "provider"} for message ${input.providerMessageId}; ignoring.`,
      );
      return null;
    }

    const comm = await this.prisma.communication.findFirst({
      where: { providerMessageId: input.providerMessageId },
      select: { id: true, status: true, blocked: true },
    });
    if (!comm) {
      this.logger.warn(
        `Delivery callback from ${input.provider ?? "provider"} for unknown providerMessageId ${input.providerMessageId}; ignoring.`,
      );
      return null;
    }
    if (comm.blocked) {
      // A firewall-blocked communication must not transition via a delivery
      // callback — its block must be resolved through the normal flow.
      this.logger.warn(
        `Delivery callback for blocked communication ${comm.id}; ignoring.`,
      );
      return null;
    }

    const previous = comm.status;
    if (!shouldTransition(previous, next)) {
      // Monotonic guard: ignore regressions and duplicates (provider retries).
      return {
        communicationId: comm.id,
        previousStatus: previous,
        status: previous,
        updated: false,
      };
    }

    await this.prisma.communication.update({
      where: { id: comm.id },
      data: { status: next },
    });

    this.logger.log(
      `Communication ${comm.id} delivery status ${previous} -> ${next} (${input.provider ?? "provider"}).`,
    );
    return {
      communicationId: comm.id,
      previousStatus: previous,
      status: next,
      updated: true,
    };
  }
}
