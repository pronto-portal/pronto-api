-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_claimantId_fkey";

-- AlterTable
ALTER TABLE "Assignment" ALTER COLUMN "addressId" DROP NOT NULL,
ALTER COLUMN "claimantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_claimantId_fkey" FOREIGN KEY ("claimantId") REFERENCES "Claimant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
