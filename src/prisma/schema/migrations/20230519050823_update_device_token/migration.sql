/*
  Warnings:

  - The primary key for the `DeviceToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[imeiNo]` on the table `DeviceToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deviceName` to the `DeviceToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imeiNo` to the `DeviceToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "DeviceToken_employeeId_key";

-- AlterTable
ALTER TABLE "DeviceToken" DROP CONSTRAINT "DeviceToken_pkey",
ADD COLUMN     "deviceName" TEXT NOT NULL,
ADD COLUMN     "imeiNo" TEXT NOT NULL,
ADD CONSTRAINT "DeviceToken_pkey" PRIMARY KEY ("imeiNo");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceToken_imeiNo_key" ON "DeviceToken"("imeiNo");
