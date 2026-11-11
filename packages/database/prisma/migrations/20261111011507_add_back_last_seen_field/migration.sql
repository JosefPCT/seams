-- AlterTable
ALTER TABLE "User" ADD COLUMN     "last_seen" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "User_last_seen_idx" ON "User"("last_seen");
