-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'LOW';
