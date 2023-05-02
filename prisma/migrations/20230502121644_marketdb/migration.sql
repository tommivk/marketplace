/*
  Warnings:

  - Added the required column `price` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Made the column `updatedAt` on table `Item` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "price" INTEGER NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;
