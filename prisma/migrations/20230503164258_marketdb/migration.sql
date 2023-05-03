/*
  Warnings:

  - You are about to drop the column `imageURL` on the `Item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imageId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "imageURL",
ADD COLUMN     "imageId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "imageURL" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_imageId_key" ON "Item"("imageId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
