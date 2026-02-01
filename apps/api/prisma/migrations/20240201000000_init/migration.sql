-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ENVOY', 'HIRER', 'ADMIN');
CREATE TYPE "HirerType" AS ENUM ('INDIVIDUAL', 'BUSINESS');
CREATE TYPE "JobLocationType" AS ENUM ('ONSITE', 'REMOTE', 'HYBRID');
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'IN_REVIEW', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED');
CREATE TYPE "StewardStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "phone" TEXT,
  "role" "Role" NOT NULL,
  "stewardStatus" "StewardStatus" DEFAULT 'PENDING',
  "stewardDepartment" TEXT,
  "stewardMatricNumber" TEXT,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);

CREATE TABLE "EnvoyProfile" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT UNIQUE NOT NULL,
  "bio" TEXT,
  "location" TEXT,
  "availability" TEXT,
  "portfolioLinks" TEXT,
  "rating" DOUBLE PRECISION DEFAULT 0,
  "verified" BOOLEAN DEFAULT false,
  CONSTRAINT "EnvoyProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id")
);

CREATE TABLE "HirerProfile" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT UNIQUE NOT NULL,
  "type" "HirerType" DEFAULT 'INDIVIDUAL',
  "businessName" TEXT,
  "rating" DOUBLE PRECISION DEFAULT 0,
  CONSTRAINT "HirerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id")
);

CREATE TABLE "Skill" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT UNIQUE NOT NULL
);

CREATE TABLE "UserSkill" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "skillId" TEXT NOT NULL,
  CONSTRAINT "UserSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id"),
  CONSTRAINT "UserSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id"),
  CONSTRAINT "UserSkill_unique" UNIQUE ("userId", "skillId")
);

CREATE TABLE "JobCategory" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT UNIQUE NOT NULL
);

CREATE TABLE "Job" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "categoryId" TEXT,
  "locationType" "JobLocationType" NOT NULL,
  "location" TEXT,
  "salaryMin" INTEGER,
  "salaryMax" INTEGER,
  "urgency" TEXT,
  "status" "JobStatus" DEFAULT 'DRAFT',
  "hirerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now(),
  CONSTRAINT "Job_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "JobCategory"("id"),
  CONSTRAINT "Job_hirerId_fkey" FOREIGN KEY ("hirerId") REFERENCES "User"("id")
);

CREATE TABLE "Application" (
  "id" TEXT PRIMARY KEY,
  "jobId" TEXT NOT NULL,
  "envoyId" TEXT NOT NULL,
  "status" "ApplicationStatus" DEFAULT 'APPLIED',
  "createdAt" TIMESTAMP DEFAULT now(),
  CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id"),
  CONSTRAINT "Application_envoyId_fkey" FOREIGN KEY ("envoyId") REFERENCES "User"("id")
);

CREATE TABLE "Conversation" (
  "id" TEXT PRIMARY KEY,
  "jobId" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now(),
  CONSTRAINT "Conversation_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id")
);

CREATE TABLE "ConversationParticipant" (
  "id" TEXT PRIMARY KEY,
  "conversationId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id"),
  CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id"),
  CONSTRAINT "ConversationParticipant_unique" UNIQUE ("conversationId", "userId")
);

CREATE TABLE "Message" (
  "id" TEXT PRIMARY KEY,
  "conversationId" TEXT NOT NULL,
  "senderId" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now(),
  CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id"),
  CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id")
);

CREATE TABLE "Attachment" (
  "id" TEXT PRIMARY KEY,
  "messageId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  CONSTRAINT "Attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id")
);

CREATE TABLE "AutoMessageTemplate" (
  "id" TEXT PRIMARY KEY,
  "key" TEXT UNIQUE NOT NULL,
  "text" TEXT NOT NULL,
  "audience" TEXT NOT NULL,
  "quickReplies" TEXT[] NOT NULL,
  "triggerRules" JSONB NOT NULL
);

CREATE TABLE "Verification" (
  "id" TEXT PRIMARY KEY,
  "phone" TEXT UNIQUE NOT NULL,
  "status" "VerificationStatus" DEFAULT 'PENDING',
  "otpCode" TEXT
);

CREATE TABLE "Review" (
  "id" TEXT PRIMARY KEY,
  "jobId" TEXT NOT NULL,
  "reviewerId" TEXT NOT NULL,
  "revieweeId" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "text" TEXT,
  "createdAt" TIMESTAMP DEFAULT now()
);

CREATE TABLE "Notification" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "read" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT now(),
  CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id")
);

CREATE TABLE "Report" (
  "id" TEXT PRIMARY KEY,
  "reporterId" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now(),
  CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id")
);

CREATE TABLE "AdminAuditLog" (
  "id" TEXT PRIMARY KEY,
  "adminId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now(),
  CONSTRAINT "AdminAuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id")
);

CREATE TABLE "RefreshToken" (
  "id" TEXT PRIMARY KEY,
  "token" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now(),
  CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id")
);
