-- CreateEnum
CREATE TYPE "ThemeMode" AS ENUM ('light', 'dark');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "theme" "ThemeMode" NOT NULL DEFAULT 'dark';
