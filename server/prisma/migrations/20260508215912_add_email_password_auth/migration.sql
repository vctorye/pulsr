/*
  Warnings:

  - You are about to drop the column `googleId` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_googleId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "googleId",
ADD COLUMN     "benchPR" DOUBLE PRECISION,
ADD COLUMN     "deadliftPR" DOUBLE PRECISION,
ADD COLUMN     "fiveKPR" TEXT,
ADD COLUMN     "halfMarathonPR" TEXT,
ADD COLUMN     "marathonPR" TEXT,
ADD COLUMN     "milePR" TEXT,
ADD COLUMN     "onboarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "squatPR" DOUBLE PRECISION,
ADD COLUMN     "tenKPR" TEXT,
ADD COLUMN     "weeklyGoal" DOUBLE PRECISION,
ADD COLUMN     "weightGoal" DOUBLE PRECISION;
