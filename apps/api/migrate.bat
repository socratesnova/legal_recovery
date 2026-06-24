@echo off
set DATABASE_URL=postgresql://lrdev:***@localhost:5432/legal_recovery?schema=public
npx prisma migrate dev --name init
