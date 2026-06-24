-- CreateIndex
-- Enforces a global unique constraint on the debtor national id (cedula).
-- Closes the find-or-create race in PortfolioIngestService under concurrent
-- ingests: the loser of the race gets a P2002 and re-uses the existing row.
-- Also removes the schema/migration drift: the old @@index([idNumber]) was
-- declared in the schema but never had a backing migration.
CREATE UNIQUE INDEX "debtors_id_number_key" ON "debtors"("id_number");