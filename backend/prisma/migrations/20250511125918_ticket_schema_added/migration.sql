-- CreateEnum
CREATE TYPE "Department" AS ENUM ('ISE', 'CSE', 'AIML', 'BT', 'CV', 'ME', 'ETE', 'EIE', 'ECE', 'ASE', 'IDRC', 'LIB', 'CMT', 'MCA', 'ADMIN_BLOCK', 'PHY', 'CHEM', 'MATH');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'CLOSED');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "department" "Department" NOT NULL,
    "location" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coordinatorId" TEXT NOT NULL,
    "technicianId" TEXT,
    "assignedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "remarks" TEXT,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");

-- CreateIndex
CREATE INDEX "Ticket_technicianId_idx" ON "Ticket"("technicianId");

-- CreateIndex
CREATE INDEX "Ticket_coordinatorId_idx" ON "Ticket"("coordinatorId");

-- CreateIndex
CREATE INDEX "Ticket_department_idx" ON "Ticket"("department");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
