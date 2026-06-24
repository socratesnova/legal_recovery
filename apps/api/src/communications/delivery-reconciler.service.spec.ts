import { CommStatus } from "@prisma/client";
import { DeliveryReconcilerService } from "./delivery-reconciler.service";
import { PrismaService } from "../common/prisma.service";

type CommRow = { id: string; status: CommStatus; blocked: boolean };

function makePrismaMock(findFirstResult: CommRow | null): PrismaService {
  return {
    communication: {
      findFirst: jest.fn().mockResolvedValue(findFirstResult),
      update: jest.fn().mockResolvedValue({}),
    },
  } as unknown as PrismaService;
}

describe("DeliveryReconcilerService", () => {
  it("returns null for an unrecognized status and skips the db lookup", async () => {
    const prisma = makePrismaMock(null);
    const svc = new DeliveryReconcilerService(prisma);
    const result = await svc.reconcile({
      providerMessageId: "SM1",
      rawStatus: "wat",
      provider: "twilio",
    });
    expect(result).toBeNull();
    expect(prisma.communication.findFirst).not.toHaveBeenCalled();
  });

  it("returns null when no communication matches the providerMessageId", async () => {
    const prisma = makePrismaMock(null);
    const svc = new DeliveryReconcilerService(prisma);
    const result = await svc.reconcile({
      providerMessageId: "SM-unknown",
      rawStatus: "delivered",
    });
    expect(result).toBeNull();
    expect(prisma.communication.update).not.toHaveBeenCalled();
  });

  it("ignores delivery callbacks for firewall-blocked communications", async () => {
    const prisma = makePrismaMock({
      id: "c1",
      status: CommStatus.BLOCKED,
      blocked: true,
    });
    const svc = new DeliveryReconcilerService(prisma);
    const result = await svc.reconcile({
      providerMessageId: "SM1",
      rawStatus: "delivered",
    });
    expect(result).toBeNull();
    expect(prisma.communication.update).not.toHaveBeenCalled();
  });

  it("progresses PENDING -> DELIVERED and updates the row", async () => {
    const prisma = makePrismaMock({
      id: "c1",
      status: CommStatus.PENDING,
      blocked: false,
    });
    const svc = new DeliveryReconcilerService(prisma);
    const result = await svc.reconcile({
      providerMessageId: "SM1",
      rawStatus: "delivered",
    });
    expect(result).toEqual({
      communicationId: "c1",
      previousStatus: CommStatus.PENDING,
      status: CommStatus.DELIVERED,
      updated: true,
    });
    expect(prisma.communication.update).toHaveBeenCalledWith({
      where: { id: "c1" },
      data: { status: CommStatus.DELIVERED },
    });
  });

  it("skips SENT -> READ in one step", async () => {
    const prisma = makePrismaMock({
      id: "c1",
      status: CommStatus.SENT,
      blocked: false,
    });
    const svc = new DeliveryReconcilerService(prisma);
    const result = await svc.reconcile({
      providerMessageId: "SM1",
      rawStatus: "read",
    });
    expect(result?.updated).toBe(true);
    expect(result?.status).toBe(CommStatus.READ);
  });

  it("allows SENT -> FAILED", async () => {
    const prisma = makePrismaMock({
      id: "c1",
      status: CommStatus.SENT,
      blocked: false,
    });
    const svc = new DeliveryReconcilerService(prisma);
    const result = await svc.reconcile({
      providerMessageId: "SM1",
      rawStatus: "undelivered",
    });
    expect(result?.updated).toBe(true);
    expect(result?.status).toBe(CommStatus.FAILED);
  });

  it("ignores FAILED after DELIVERED (no regression to failed)", async () => {
    const prisma = makePrismaMock({
      id: "c1",
      status: CommStatus.DELIVERED,
      blocked: false,
    });
    const svc = new DeliveryReconcilerService(prisma);
    const result = await svc.reconcile({
      providerMessageId: "SM1",
      rawStatus: "failed",
    });
    expect(result?.updated).toBe(false);
    expect(result?.status).toBe(CommStatus.DELIVERED);
    expect(prisma.communication.update).not.toHaveBeenCalled();
  });

  it("is idempotent on duplicate DELIVERED events", async () => {
    const prisma = makePrismaMock({
      id: "c1",
      status: CommStatus.DELIVERED,
      blocked: false,
    });
    const svc = new DeliveryReconcilerService(prisma);
    const result = await svc.reconcile({
      providerMessageId: "SM1",
      rawStatus: "delivered",
    });
    expect(result?.updated).toBe(false);
    expect(prisma.communication.update).not.toHaveBeenCalled();
  });

  it("ignores a stale SENT arriving after DELIVERED", async () => {
    const prisma = makePrismaMock({
      id: "c1",
      status: CommStatus.DELIVERED,
      blocked: false,
    });
    const svc = new DeliveryReconcilerService(prisma);
    const result = await svc.reconcile({
      providerMessageId: "SM1",
      rawStatus: "sent",
    });
    expect(result?.updated).toBe(false);
    expect(prisma.communication.update).not.toHaveBeenCalled();
  });
});
