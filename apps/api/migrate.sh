#!/bin/bash
export DATABASE_URL="postgresql://legal_recovery:***@localhost:5432/legal_recovery?schema=public"
echo "y" | npx prisma migrate dev --name init
