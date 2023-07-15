-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "claimantSubject" TEXT DEFAULT 'Reminder',
ADD COLUMN     "translatorSubject" TEXT DEFAULT 'Reminder';
