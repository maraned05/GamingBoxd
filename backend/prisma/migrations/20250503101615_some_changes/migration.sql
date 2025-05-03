/*
  Warnings:

  - You are about to drop the column `added_at` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `media_url` on the `Review` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `date` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "added_at",
DROP COLUMN "media_url",
ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "media" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';
