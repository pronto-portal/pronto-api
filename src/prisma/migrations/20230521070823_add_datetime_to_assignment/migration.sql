/*
  Warnings:

  - Added the required column `dateTime` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL;
