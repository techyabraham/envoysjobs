ALTER TABLE "EnvoyProfile" ADD COLUMN "skills" TEXT;

ALTER TABLE "Gig"
  ADD COLUMN "contactEmail" TEXT,
  ADD COLUMN "contactMethods" "ContactMethod"[] NOT NULL DEFAULT ARRAY[]::"ContactMethod"[],
  ADD COLUMN "contactWebsite" TEXT,
  ADD COLUMN "contactWhatsapp" TEXT;

ALTER TABLE "Job"
  ADD COLUMN "applyUrl" TEXT,
  ADD COLUMN "company" TEXT,
  ADD COLUMN "contactEmail" TEXT,
  ADD COLUMN "contactMethods" "ContactMethod"[] NOT NULL DEFAULT ARRAY[]::"ContactMethod"[],
  ADD COLUMN "contactWebsite" TEXT,
  ADD COLUMN "contactWhatsapp" TEXT,
  ADD COLUMN "source" TEXT,
  ADD COLUMN "sourceId" TEXT,
  ADD COLUMN "sourceUrl" TEXT;

ALTER TABLE "Service"
  ADD COLUMN "contactEmail" TEXT,
  ADD COLUMN "contactMethods" "ContactMethod"[] NOT NULL DEFAULT ARRAY[]::"ContactMethod"[],
  ADD COLUMN "contactWebsite" TEXT,
  ADD COLUMN "contactWhatsapp" TEXT,
  ADD COLUMN "imageUrl" TEXT;

ALTER TABLE "User" ADD COLUMN "imageUrl" TEXT;

ALTER TABLE "Verification"
  ADD COLUMN "documentType" TEXT,
  ADD COLUMN "documentUrl" TEXT,
  ADD COLUMN "updatedAt" TIMESTAMP(3),
  ADD COLUMN "userId" TEXT;
UPDATE "Verification" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;
ALTER TABLE "Verification" ALTER COLUMN "updatedAt" SET NOT NULL;

CREATE TABLE "ServiceInquiry" (
  "id" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "method" "ContactMethod",
  "message" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ServiceInquiry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Job_source_sourceId_key" ON "Job"("source", "sourceId");
CREATE UNIQUE INDEX "Verification_userId_key" ON "Verification"("userId");

ALTER TABLE "Verification" ADD CONSTRAINT "Verification_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ServiceInquiry" ADD CONSTRAINT "ServiceInquiry_serviceId_fkey"
  FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ServiceInquiry" ADD CONSTRAINT "ServiceInquiry_customerId_fkey"
  FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
