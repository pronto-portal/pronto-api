-- AlterTable
ALTER TABLE "Claimant" ADD COLUMN     "languages" TEXT[] DEFAULT ARRAY[]::TEXT[];
