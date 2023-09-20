/*
  Warnings:

  - Added the required column `createdById` to the `NonUserTranslator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NonUserTranslator" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "NonUserTranslator" ADD CONSTRAINT "NonUserTranslator_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
