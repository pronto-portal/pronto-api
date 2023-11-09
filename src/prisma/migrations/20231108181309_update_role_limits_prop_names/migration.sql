/*
  Warnings:

  - You are about to drop the column `maxReminders` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `maxTranslators` on the `Role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Role" DROP COLUMN "maxReminders",
DROP COLUMN "maxTranslators",
ADD COLUMN     "remindersLimit" INTEGER,
ADD COLUMN     "translatorsLimit" INTEGER;
