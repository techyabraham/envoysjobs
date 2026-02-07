/*
  Warnings:

  - Made the column `createdAt` on table `AdminAuditLog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Conversation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating` on table `EnvoyProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `verified` on table `EnvoyProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `HirerProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating` on table `HirerProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Job` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Job` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Job` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `read` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `RefreshToken` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Verification` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AdminAuditLog" DROP CONSTRAINT "AdminAuditLog_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_envoyId_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_jobId_fkey";

-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_messageId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_jobId_fkey";

-- DropForeignKey
ALTER TABLE "ConversationParticipant" DROP CONSTRAINT "ConversationParticipant_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "ConversationParticipant" DROP CONSTRAINT "ConversationParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "EnvoyProfile" DROP CONSTRAINT "EnvoyProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "HirerProfile" DROP CONSTRAINT "HirerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_hirerId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_reporterId_fkey";

-- DropForeignKey
ALTER TABLE "UserSkill" DROP CONSTRAINT "UserSkill_skillId_fkey";

-- DropForeignKey
ALTER TABLE "UserSkill" DROP CONSTRAINT "UserSkill_userId_fkey";

-- AlterTable
ALTER TABLE "AdminAuditLog" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "EnvoyProfile" ALTER COLUMN "rating" SET NOT NULL,
ALTER COLUMN "verified" SET NOT NULL;

-- AlterTable
ALTER TABLE "HirerProfile" ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "rating" SET NOT NULL;

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "read" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "RefreshToken" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Verification" ALTER COLUMN "status" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "EnvoyProfile" ADD CONSTRAINT "EnvoyProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HirerProfile" ADD CONSTRAINT "HirerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "JobCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_hirerId_fkey" FOREIGN KEY ("hirerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_envoyId_fkey" FOREIGN KEY ("envoyId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAuditLog" ADD CONSTRAINT "AdminAuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "ConversationParticipant_unique" RENAME TO "ConversationParticipant_conversationId_userId_key";

-- RenameIndex
ALTER INDEX "UserSkill_unique" RENAME TO "UserSkill_userId_skillId_key";
