-- CreateTable
CREATE TABLE "_UserTranslators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserTranslators_AB_unique" ON "_UserTranslators"("A", "B");

-- CreateIndex
CREATE INDEX "_UserTranslators_B_index" ON "_UserTranslators"("B");

-- AddForeignKey
ALTER TABLE "_UserTranslators" ADD CONSTRAINT "_UserTranslators_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserTranslators" ADD CONSTRAINT "_UserTranslators_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
