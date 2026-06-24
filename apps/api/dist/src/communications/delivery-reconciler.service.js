"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DeliveryReconcilerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryReconcilerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const delivery_status_mapper_1 = require("./delivery-status.mapper");
let DeliveryReconcilerService = DeliveryReconcilerService_1 = class DeliveryReconcilerService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(DeliveryReconcilerService_1.name);
    }
    async reconcile(input) {
        const next = (0, delivery_status_mapper_1.mapProviderStatus)(input.rawStatus);
        if (!next) {
            this.logger.warn(`Unknown delivery status "${input.rawStatus}" from ${input.provider ?? "provider"} for message ${input.providerMessageId}; ignoring.`);
            return null;
        }
        const comm = await this.prisma.communication.findFirst({
            where: { providerMessageId: input.providerMessageId },
            select: { id: true, status: true, blocked: true },
        });
        if (!comm) {
            this.logger.warn(`Delivery callback from ${input.provider ?? "provider"} for unknown providerMessageId ${input.providerMessageId}; ignoring.`);
            return null;
        }
        if (comm.blocked) {
            this.logger.warn(`Delivery callback for blocked communication ${comm.id}; ignoring.`);
            return null;
        }
        const previous = comm.status;
        if (!(0, delivery_status_mapper_1.shouldTransition)(previous, next)) {
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
        this.logger.log(`Communication ${comm.id} delivery status ${previous} -> ${next} (${input.provider ?? "provider"}).`);
        return {
            communicationId: comm.id,
            previousStatus: previous,
            status: next,
            updated: true,
        };
    }
};
exports.DeliveryReconcilerService = DeliveryReconcilerService;
exports.DeliveryReconcilerService = DeliveryReconcilerService = DeliveryReconcilerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeliveryReconcilerService);
//# sourceMappingURL=delivery-reconciler.service.js.map