import { CommStatus } from "@prisma/client";

/**
 * Ordered progression of delivery states. Higher means further along the
 * delivery lifecycle. FAILED and BLOCKED are terminal/negative and handled
 * specially in {@link shouldTransition}.
 */
const RANK: Record<CommStatus, number> = {
  PENDING: 0,
  SENT: 1,
  DELIVERED: 2,
  READ: 3,
  FAILED: -1,
  BLOCKED: -2,
};

/**
 * Map a provider's raw delivery status string to our CommStatus. Covers
 * Twilio MessageStatus (queued/sent/delivered/read/undelivered/failed/canceled)
 * and common email event names (SendGrid/SES: processed/delivered/open/bounce/
 * dropped/spam). Returns null for unrecognized statuses so the caller can
 * ignore them without persisting a wrong state.
 */
export function mapProviderStatus(rawStatus: string): CommStatus | null {
  const s = rawStatus?.trim().toLowerCase();
  if (!s) return null;
  switch (s) {
    case "queued":
    case "accepted":
    case "processed":
    case "sent":
      return CommStatus.SENT;
    case "delivered":
      return CommStatus.DELIVERED;
    case "read":
    case "open":
    case "opened":
      return CommStatus.READ;
    case "failed":
    case "undelivered":
    case "canceled":
    case "cancelled":
    case "bounce":
    case "bounced":
    case "dropped":
    case "error":
    case "spam":
      return CommStatus.FAILED;
    default:
      return null;
  }
}

/**
 * Decide whether moving a communication from `current` to `next` is a valid
 * monotonic progression. Delivery states never regress (a stale "sent" arriving
 * after "delivered" is ignored), and FAILED only applies to messages that have
 * not yet been confirmed delivered/read (a later "undelivered" after "delivered"
 * is ignored — providers sometimes replay old events). This makes the
 * reconciler idempotent under provider retries.
 */
export function shouldTransition(
  current: CommStatus,
  next: CommStatus,
): boolean {
  if (next === CommStatus.FAILED) {
    return current === CommStatus.PENDING || current === CommStatus.SENT;
  }
  return RANK[next] > RANK[current];
}
