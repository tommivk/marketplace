/*
  Warnings:

  - Added the required column `imageURL` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageURL" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3);
