/*
  Warnings:

  - The primary key for the `Package` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerKg` on the `Package` table. All the data in the column will be lost.
  - Added the required column `label` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceType` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('REGULER', 'EXPRESS');

-- DropIndex
DROP INDEX "Package_name_key";

-- AlterTable
ALTER TABLE "Package" DROP CONSTRAINT "Package_pkey",
DROP COLUMN "description",
DROP COLUMN "duration",
DROP COLUMN "name",
DROP COLUMN "pricePerKg",
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "serviceType" "ServiceType" NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Package_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Package_id_seq";
