/*
  Warnings:

  - You are about to drop the column `claimantSubject` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `isEmail` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `isSMS` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `translatorSubject` on the `Reminder` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Reminder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "claimantSubject",
DROP COLUMN "isEmail",
DROP COLUMN "isSMS",
DROP COLUMN "translatorSubject",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
