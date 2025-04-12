/*
  Warnings:

  - You are about to drop the column `birht_day` on the `Admin` table. All the data in the column will be lost.
  - Added the required column `birth_day` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "birht_day",
ADD COLUMN     "birth_day" INTEGER NOT NULL;
