/*
  Warnings:

  - The primary key for the `Folder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `parentId` on the `Folder` table. All the data in the column will be lost.
  - The primary key for the `_FileToFolder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[path]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_parentId_fkey";

-- DropForeignKey
ALTER TABLE "_FileToFolder" DROP CONSTRAINT "_FileToFolder_B_fkey";

-- AlterTable
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_pkey",
DROP COLUMN "parentId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Folder_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Folder_id_seq";

-- AlterTable
ALTER TABLE "_FileToFolder" DROP CONSTRAINT "_FileToFolder_AB_pkey",
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_FileToFolder_AB_pkey" PRIMARY KEY ("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_path_key" ON "Folder"("path");

-- AddForeignKey
ALTER TABLE "_FileToFolder" ADD CONSTRAINT "_FileToFolder_B_fkey" FOREIGN KEY ("B") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
