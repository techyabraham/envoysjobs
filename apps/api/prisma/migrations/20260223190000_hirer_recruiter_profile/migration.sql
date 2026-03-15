ALTER TABLE "HirerProfile"
ADD COLUMN "isRecruiter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "recruiterIndustries" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "recruiterSkills" TEXT[] DEFAULT ARRAY[]::TEXT[];
