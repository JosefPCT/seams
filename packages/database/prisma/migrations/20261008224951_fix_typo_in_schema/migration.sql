/*
  Warnings:

  - You are about to drop the column `grouo_id` on the `Message` table. All the data in the column will be lost.
  - Added the required column `group_id` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_grouo_id_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "grouo_id",
ADD COLUMN     "group_id" INTEGER NOT NULL,
ALTER COLUMN "edited_at" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "ChatGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
