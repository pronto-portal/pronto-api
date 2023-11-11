-- AlterTable
ALTER TABLE "User" ADD COLUMN     "autoRenewSubscription" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "subscriptionEndDate" TIMESTAMP(3);
