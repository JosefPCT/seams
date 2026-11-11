/*
  Warnings:

  - You are about to drop the column `last_seen` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_last_seen_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "last_seen";
