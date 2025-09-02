/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `PasswordResetToken` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `PasswordResetToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."PasswordResetToken" DROP COLUMN "updatedAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
