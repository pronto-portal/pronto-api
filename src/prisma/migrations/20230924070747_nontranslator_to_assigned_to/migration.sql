/*
  Warnings:

  - You are about to drop the column `nonUserTranslatorId` on the `Assignment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_nonUserTranslatorId_fkey";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "nonUserTranslatorId",
ADD COLUMN     "assignedToId" TEXT;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "NonUserTranslator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
