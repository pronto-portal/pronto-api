-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_assignedToUserId_fkey";

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "nonUserTranslatorId" TEXT,
ALTER COLUMN "assignedToUserId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "NonUserTranslator" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "phone" VARCHAR(30),
    "firstName" VARCHAR(120),
    "lastName" VARCHAR(120),
    "profilePic" VARCHAR(255) DEFAULT '',
    "city" TEXT,
    "state" TEXT,
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "NonUserTranslator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NonUserTranslator_email_key" ON "NonUserTranslator"("email");

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_nonUserTranslatorId_fkey" FOREIGN KEY ("nonUserTranslatorId") REFERENCES "NonUserTranslator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
