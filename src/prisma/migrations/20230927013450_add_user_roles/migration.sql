-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roleName" TEXT;

-- CreateTable
CREATE TABLE "Role" (
    "name" VARCHAR(255) NOT NULL,
    "priceCents" INTEGER NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleName_fkey" FOREIGN KEY ("roleName") REFERENCES "Role"("name") ON DELETE SET NULL ON UPDATE CASCADE;
