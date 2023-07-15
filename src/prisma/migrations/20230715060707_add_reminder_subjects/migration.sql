/*
  Warnings:

  - Made the column `claimantSubject` on table `Reminder` required. This step will fail if there are existing NULL values in that column.
  - Made the column `translatorSubject` on table `Reminder` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Reminder" ALTER COLUMN "claimantSubject" SET NOT NULL,
ALTER COLUMN "claimantSubject" DROP DEFAULT,
ALTER COLUMN "translatorSubject" SET NOT NULL,
ALTER COLUMN "translatorSubject" DROP DEFAULT;
