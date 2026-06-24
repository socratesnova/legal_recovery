"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProviderStatus = mapProviderStatus;
exports.shouldTransition = shouldTransition;
const client_1 = require("@prisma/client");
const RANK = {
    PENDING: 0,
    SENT: 1,
    DELIVERED: 2,
    READ: 3,
    FAILED: -1,
    BLOCKED: -2,
};
function mapProviderStatus(rawStatus) {
    const s = rawStatus?.trim().toLowerCase();
    if (!s)
        return null;
    switch (s) {
        case "queued":
        case "accepted":
        case "processed":
        case "sent":
            return client_1.CommStatus.SENT;
        case "delivered":
            return client_1.CommStatus.DELIVERED;
        case "read":
        case "open":
        case "opened":
            return client_1.CommStatus.READ;
        case "failed":
        case "undelivered":
        case "canceled":
        case "cancelled":
        case "bounce":
        case "bounced":
        case "dropped":
        case "error":
        case "spam":
            return client_1.CommStatus.FAILED;
        default:
            return null;
    }
}
function shouldTransition(current, next) {
    if (next === client_1.CommStatus.FAILED) {
        return current === client_1.CommStatus.PENDING || current === client_1.CommStatus.SENT;
    }
    return RANK[next] > RANK[current];
}
//# sourceMappingURL=delivery-status.mapper.js.map