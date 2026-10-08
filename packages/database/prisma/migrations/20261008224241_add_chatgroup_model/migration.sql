/*
  Warnings:

  - Added the required column `grouo_id` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "grouo_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ChatGroup" (
    "id" SERIAL NOT NULL,
    "public_id" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'New Chat',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "ChatGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatGroup_public_id_key" ON "ChatGroup"("public_id");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_grouo_id_fkey" FOREIGN KEY ("grouo_id") REFERENCES "ChatGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
