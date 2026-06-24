import { CommStatus } from "@prisma/client";
import { mapProviderStatus, shouldTransition } from "./delivery-status.mapper";

describe("delivery-status.mapper", () => {
  describe("mapProviderStatus", () => {
    it("maps sent-like statuses to SENT", () => {
      expect(mapProviderStatus("sent")).toBe(CommStatus.SENT);
      expect(mapProviderStatus("queued")).toBe(CommStatus.SENT);
      expect(mapProviderStatus("accepted")).toBe(CommStatus.SENT);
      expect(mapProviderStatus("processed")).toBe(CommStatus.SENT);
    });

    it("maps delivered to DELIVERED", () => {
      expect(mapProviderStatus("delivered")).toBe(CommStatus.DELIVERED);
    });

    it("maps read/open to READ", () => {
      expect(mapProviderStatus("read")).toBe(CommStatus.READ);
      expect(mapProviderStatus("open")).toBe(CommStatus.READ);
      expect(mapProviderStatus("opened")).toBe(CommStatus.READ);
    });

    it("maps failure statuses to FAILED", () => {
      expect(mapProviderStatus("failed")).toBe(CommStatus.FAILED);
      expect(mapProviderStatus("undelivered")).toBe(CommStatus.FAILED);
      expect(mapProviderStatus("bounce")).toBe(CommStatus.FAILED);
      expect(mapProviderStatus("dropped")).toBe(CommStatus.FAILED);
      expect(mapProviderStatus("canceled")).toBe(CommStatus.FAILED);
    });

    it("is case-insensitive and trims whitespace", () => {
      expect(mapProviderStatus("DELIVERED")).toBe(CommStatus.DELIVERED);
      expect(mapProviderStatus("  Read  ")).toBe(CommStatus.READ);
    });

    it("returns null for unknown/empty statuses", () => {
      expect(mapProviderStatus("")).toBeNull();
      expect(mapProviderStatus("   ")).toBeNull();
      expect(mapProviderStatus("totally-unknown")).toBeNull();
    });
  });

  describe("shouldTransition", () => {
    it("progresses forward through the lifecycle", () => {
      expect(shouldTransition(CommStatus.PENDING, CommStatus.SENT)).toBe(true);
      expect(shouldTransition(CommStatus.SENT, CommStatus.DELIVERED)).toBe(
        true,
      );
      expect(shouldTransition(CommStatus.DELIVERED, CommStatus.READ)).toBe(
        true,
      );
      expect(shouldTransition(CommStatus.PENDING, CommStatus.READ)).toBe(true);
    });

    it("never regresses", () => {
      expect(shouldTransition(CommStatus.DELIVERED, CommStatus.SENT)).toBe(
        false,
      );
      expect(shouldTransition(CommStatus.READ, CommStatus.DELIVERED)).toBe(
        false,
      );
      expect(shouldTransition(CommStatus.SENT, CommStatus.PENDING)).toBe(false);
    });

    it("is idempotent on the same status", () => {
      expect(shouldTransition(CommStatus.DELIVERED, CommStatus.DELIVERED)).toBe(
        false,
      );
      expect(shouldTransition(CommStatus.SENT, CommStatus.SENT)).toBe(false);
    });

    it("allows FAILED only before delivery is confirmed", () => {
      expect(shouldTransition(CommStatus.PENDING, CommStatus.FAILED)).toBe(
        true,
      );
      expect(shouldTransition(CommStatus.SENT, CommStatus.FAILED)).toBe(true);
      expect(shouldTransition(CommStatus.DELIVERED, CommStatus.FAILED)).toBe(
        false,
      );
      expect(shouldTransition(CommStatus.READ, CommStatus.FAILED)).toBe(false);
    });
  });
});
