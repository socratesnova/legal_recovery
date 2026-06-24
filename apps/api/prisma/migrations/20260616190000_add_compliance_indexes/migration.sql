-- AddIndex
CREATE INDEX "consents_debtor_id_idx" ON "consents"("debtor_id");

-- AddIndex
CREATE INDEX "data_restrictions_entity_id_field_name_idx" ON "data_restrictions"("entity_id", "field_name");

-- AddIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- AddIndex
CREATE INDEX "audit_logs_institution_id_action_idx" ON "audit_logs"("institution_id", "action");