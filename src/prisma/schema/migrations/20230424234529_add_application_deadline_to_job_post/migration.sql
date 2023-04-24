/*
  Warnings:

  - Added the required column `applicationDeadline` to the `JobPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobPost" ADD COLUMN     "applicationDeadline" TIMESTAMP(3) NOT NULL;
