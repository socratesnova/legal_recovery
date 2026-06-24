import { Module } from "@nestjs/common";
import { CommunicationsController } from "./communications.controller";
import { DeliveryWebhookController } from "./delivery-webhook.controller";
import { CommunicationsService } from "./communications.service";
import { DeliveryReconcilerService } from "./delivery-reconciler.service";
import { NotificationDispatcher } from "./notification-dispatcher";

@Module({
  controllers: [CommunicationsController, DeliveryWebhookController],
  providers: [
    CommunicationsService,
    NotificationDispatcher,
    DeliveryReconcilerService,
  ],
  exports: [NotificationDispatcher, DeliveryReconcilerService],
})
export class CommunicationsModule {}
