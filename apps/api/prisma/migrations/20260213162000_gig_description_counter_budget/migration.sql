-- Add description to gigs and counter budget to gig applications
ALTER TABLE "Gig" ADD COLUMN IF NOT EXISTS "description" TEXT;
UPDATE "Gig" SET "description" = COALESCE("description", 'Gig opportunity') WHERE "description" IS NULL;
ALTER TABLE "Gig" ALTER COLUMN "description" SET NOT NULL;

ALTER TABLE "GigApplication" ADD COLUMN IF NOT EXISTS "counterBudget" TEXT;
