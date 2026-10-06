CREATE TYPE "ContactMethod" AS ENUM ('PLATFORM', 'EMAIL', 'WEBSITE', 'WHATSAPP');
CREATE TYPE "DealStatus" AS ENUM ('PENDING', 'ACTIVE', 'PAUSED', 'REJECTED');

CREATE TABLE "Deal" (
  "id" TEXT NOT NULL,
  "ownerId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "offer" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "promoCode" TEXT,
  "redemptionInstructions" TEXT NOT NULL,
  "location" TEXT,
  "startsAt" TIMESTAMP(3),
  "endsAt" TIMESTAMP(3),
  "contactMethods" "ContactMethod"[] NOT NULL DEFAULT ARRAY[]::"ContactMethod"[],
  "contactEmail" TEXT,
  "contactWebsite" TEXT,
  "contactWhatsapp" TEXT,
  "status" "DealStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Deal_status_endsAt_idx" ON "Deal"("status", "endsAt");
CREATE INDEX "Deal_ownerId_createdAt_idx" ON "Deal"("ownerId", "createdAt");
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
