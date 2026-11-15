-- AlterTable
ALTER TABLE "User" ADD COLUMN     "destination" TEXT,
ADD COLUMN     "level" TEXT,
ADD COLUMN     "onboardedAt" TIMESTAMP(3),
ADD COLUMN     "tripPurpose" TEXT;
