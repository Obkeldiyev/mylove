/*
  Warnings:

  - You are about to drop the column `coins` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the `Products` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_adminId_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "coins";

-- DropTable
DROP TABLE "Products";
