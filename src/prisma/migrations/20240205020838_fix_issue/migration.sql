/*
  Warnings:

  - Made the column `cronSchedule` on table `Reminder` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Reminder" ALTER COLUMN "cronSchedule" SET NOT NULL;
