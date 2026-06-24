"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const delivery_status_mapper_1 = require("./delivery-status.mapper");
describe("delivery-status.mapper", () => {
    describe("mapProviderStatus", () => {
        it("maps sent-like statuses to SENT", () => {
            expect((0, delivery_status_mapper_1.mapProviderStatus)("sent")).toBe(client_1.CommStatus.SENT);
            expect((0, delivery_status_mapper_1.mapProviderStatus)("queued")).toBe(client_1.CommStatus.SENT);
            expect((0, delivery_status_mapper_1.mapProviderStatus)("accepted")).toBe(client_1.CommStatus.SENT);
            expect((0, delivery_status_mapper_1.mapProviderStatus)("processed")).toBe(client_1.CommStatus.SENT);
        });
        it("maps delivered to DELIVERED", () => {
            expect((0, delivery_status_mapper_1.mapProviderStatus)("delivered")).toBe(client_1.CommStatus.DELIVERED);
        });
        it("maps read/open to READ", () => {
            expect((0, delivery_status_mapper_1.mapProviderStatus)("read")).toBe(client_1.CommStatus.READ);
            expect((0, delivery_status_mapper_1.mapProviderStatus)("open")).toBe(client_1.CommStatus.READ);
            expect((0, delivery_status_mapper_1.mapProviderStatus)("opened")).toBe(client_1.CommStatus.READ);
        });
        it("maps failure statuses to FAILED", () => {
            expect((0, delivery_status_mapper_1.mapProviderStatus)("failed")).toBe(client_1.CommStatus.FAILED);
            expect((0, delivery_status_mapper_1.mapProviderStatus)("undelivered")).toBe(client_1.CommStatus.FAILED);
            expect((0, delivery_status_mapper_1.mapProviderStatus)("bounce")).toBe(client_1.CommStatus.FAILED);
            expect((0, delivery_status_mapper_1.mapProviderStatus)("dropped")).toBe(client_1.CommStatus.FAILED);
            expect((0, delivery_status_mapper_1.mapProviderStatus)("canceled")).toBe(client_1.CommStatus.FAILED);
        });
        it("is case-insensitive and trims whitespace", () => {
            expect((0, delivery_status_mapper_1.mapProviderStatus)("DELIVERED")).toBe(client_1.CommStatus.DELIVERED);
            expect((0, delivery_status_mapper_1.mapProviderStatus)("  Read  ")).toBe(client_1.CommStatus.READ);
        });
        it("returns null for unknown/empty statuses", () => {
            expect((0, delivery_status_mapper_1.mapProviderStatus)("")).toBeNull();
            expect((0, delivery_status_mapper_1.mapProviderStatus)("   ")).toBeNull();
            expect((0, delivery_status_mapper_1.mapProviderStatus)("totally-unknown")).toBeNull();
        });
    });
    describe("shouldTransition", () => {
        it("progresses forward through the lifecycle", () => {
            expect((0, delivery_status_mapper_1.shouldTransition)(client_1.CommStatus.PENDING, client_1.CommStatus.SENT)).toBe(true);
            expect((0, delivery_status_mapper_1.shouldTransition)(client_1.CommStatus.SENT, client_1.CommStatus.DELIVERED)).toBe(true);
            expect((0, delivery_status_mapper_1.shouldTransition)(client_1.CommStatus.DELIVERED, client_1.CommStatus.READ)).toBe(true);
            expect((0, delivery_status_mapper_1.shouldTransition)(client_1.CommStatus.PENDING, client_1.CommStatus.READ)).toBe(true);
        });
        it("never regresses", () => {
            expect((0, delivery_status_mapper_1.shouldTransition)(client_1.CommStatus.DELIVERED, client_1.CommStatus.SENT)).toBe(false);
            expect((0, delivery_status_mapper_1.shouldTransition)(client_1.CommStatus.READ, client_1.CommStatus.DELIVERED)).toBe(false);
            expect((0, delivery_status_mapper_1.shouldTransition)(client_1.CommStatus.SENT, client_1.CommStatus.PENDING)).toBe(false);
        });
        it("is idempotent on the same status", () => {
            expect((0, delivery_status_mapper_1.shouldTransition)(client_1.CommStatus.DELIVERED, client_1.CommStatus.DELIVERED)).toBe(false);
            expect((0, delivery_status_mapper_1.shouldTransition)(client_1.CommStatus.SENT, client_1.CommStatus.SENT)).toBe(false);
        });
        it("allows FAILED only before delivery is confirmed", () => {
            expect((0, delivery_status_mapper_1.shouldTransition)(client_1.CommStatus.PENDING, client_1.CommStatus.FAILED)).toBe(true);
            expect((0, delivery_status_mapper_1.shouldTransition)(client_1.CommStatus.SENT, client_1.CommStatus.FAILED)).toBe(true);
            expect((0, delivery_status_mapper_1.shouldTransition)(client_1.CommStatus.DELIVERED, client_1.CommStatus.FAILED)).toBe(false);
            expect((0, delivery_status_mapper_1.shouldTransition)(client_1.CommStatus.READ, client_1.CommStatus.FAILED)).toBe(false);
        });
    });
});
//# sourceMappingURL=delivery-status.mapper.spec.js.map