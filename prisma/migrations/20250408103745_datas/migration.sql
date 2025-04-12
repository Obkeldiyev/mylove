/*
  Warnings:

  - Added the required column `about` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birht_day` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth_month` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth_year` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "about" TEXT NOT NULL,
ADD COLUMN     "birht_day" INTEGER NOT NULL,
ADD COLUMN     "birth_month" TEXT NOT NULL,
ADD COLUMN     "birth_year" INTEGER NOT NULL;
