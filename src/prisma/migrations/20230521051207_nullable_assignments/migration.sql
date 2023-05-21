/*
  Warnings:

  - You are about to drop the column `assignmentId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `assignmentId` on the `Claimant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[claimantId]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[addressId]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `claimantId` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "Claimant" DROP CONSTRAINT "Claimant_assignmentId_fkey";

-- DropIndex
DROP INDEX "Address_assignmentId_key";

-- DropIndex
DROP INDEX "Claimant_assignmentId_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "assignmentId";

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "addressId" TEXT NOT NULL,
ADD COLUMN     "claimantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Claimant" DROP COLUMN "assignmentId";

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_claimantId_key" ON "Assignment"("claimantId");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_addressId_key" ON "Assignment"("addressId");

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_claimantId_fkey" FOREIGN KEY ("claimantId") REFERENCES "Claimant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
