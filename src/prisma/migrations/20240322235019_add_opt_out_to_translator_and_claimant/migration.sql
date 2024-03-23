-- AlterTable
ALTER TABLE "Claimant" ADD COLUMN     "optedOut" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "NonUserTranslator" ADD COLUMN     "optedOut" BOOLEAN NOT NULL DEFAULT false;
