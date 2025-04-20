/*
  Warnings:

  - You are about to drop the column `status` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "seen" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "content" DROP NOT NULL;
