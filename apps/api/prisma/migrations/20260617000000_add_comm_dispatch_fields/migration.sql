-- AddColumn
ALTER TABLE "communications" ADD COLUMN "provider_message_id" TEXT;

-- AddColumn
ALTER TABLE "communications" ADD COLUMN "simulated" BOOLEAN NOT NULL DEFAULT false;