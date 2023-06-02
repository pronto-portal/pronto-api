-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "claimantMessage" TEXT NOT NULL,
    "translatorMessage" TEXT NOT NULL,
    "isEmail" BOOLEAN NOT NULL DEFAULT true,
    "isSMS" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reminder_assignmentId_key" ON "Reminder"("assignmentId");

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
