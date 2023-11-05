/*
  Warnings:

  - A unique constraint covering the columns `[stripePriceId]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Role_stripePriceId_key" ON "Role"("stripePriceId");
