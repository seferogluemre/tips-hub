/*
  Warnings:

  - The primary key for the `TipTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[tipId,tagId]` on the table `TipTag` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `TipTag` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "TipTag" DROP CONSTRAINT "TipTag_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "TipTag_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "TipTag_tipId_tagId_key" ON "TipTag"("tipId", "tagId");
