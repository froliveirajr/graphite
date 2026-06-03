-- CreateEnum
CREATE TYPE "AllocationStatus" AS ENUM ('PLANNED', 'ACTIVE', 'PAUSED', 'FINISHED', 'CANCELED');

-- CreateEnum
CREATE TYPE "DailyAttendanceStatus" AS ENUM ('PRESENT', 'PARTIAL', 'ABSENT', 'TRANSFERRED');

-- CreateTable
CREATE TABLE "ProjectEmployeeAllocation" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "serviceDescription" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "dailyRate" DECIMAL(12,2),
    "status" "AllocationStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectEmployeeAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyReportAttendance" (
    "id" TEXT NOT NULL,
    "dailyReportId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "allocationId" TEXT,
    "status" "DailyAttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "hoursWorked" DECIMAL(5,2),
    "transferredToProjectId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyReportAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectEmployeeAllocation_projectId_idx" ON "ProjectEmployeeAllocation"("projectId");

-- CreateIndex
CREATE INDEX "ProjectEmployeeAllocation_employeeId_idx" ON "ProjectEmployeeAllocation"("employeeId");

-- CreateIndex
CREATE INDEX "ProjectEmployeeAllocation_status_idx" ON "ProjectEmployeeAllocation"("status");

-- CreateIndex
CREATE INDEX "ProjectEmployeeAllocation_startDate_idx" ON "ProjectEmployeeAllocation"("startDate");

-- CreateIndex
CREATE INDEX "DailyReportAttendance_dailyReportId_idx" ON "DailyReportAttendance"("dailyReportId");

-- CreateIndex
CREATE INDEX "DailyReportAttendance_employeeId_idx" ON "DailyReportAttendance"("employeeId");

-- CreateIndex
CREATE INDEX "DailyReportAttendance_allocationId_idx" ON "DailyReportAttendance"("allocationId");

-- CreateIndex
CREATE INDEX "DailyReportAttendance_transferredToProjectId_idx" ON "DailyReportAttendance"("transferredToProjectId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyReportAttendance_dailyReportId_employeeId_key" ON "DailyReportAttendance"("dailyReportId", "employeeId");

-- AddForeignKey
ALTER TABLE "ProjectEmployeeAllocation" ADD CONSTRAINT "ProjectEmployeeAllocation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectEmployeeAllocation" ADD CONSTRAINT "ProjectEmployeeAllocation_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyReportAttendance" ADD CONSTRAINT "DailyReportAttendance_dailyReportId_fkey" FOREIGN KEY ("dailyReportId") REFERENCES "DailyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyReportAttendance" ADD CONSTRAINT "DailyReportAttendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyReportAttendance" ADD CONSTRAINT "DailyReportAttendance_allocationId_fkey" FOREIGN KEY ("allocationId") REFERENCES "ProjectEmployeeAllocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyReportAttendance" ADD CONSTRAINT "DailyReportAttendance_transferredToProjectId_fkey" FOREIGN KEY ("transferredToProjectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
