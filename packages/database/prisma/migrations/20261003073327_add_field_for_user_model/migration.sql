/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "public_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "User_public_id_key" ON "User"("public_id");
