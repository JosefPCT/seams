/*
  Warnings:

  - You are about to drop the column `lastSeen` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_lastSeen_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastSeen",
ADD COLUMN     "last_seen" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "User_last_seen_idx" ON "User"("last_seen");
