-- CreateEnum
CREATE TYPE "BudgetItemStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "MeasurementStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'INVOICED');

-- CreateTable
CREATE TABLE "BudgetItem" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "taskId" TEXT,
    "code" TEXT,
    "phase" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL,
    "unitPrice" DECIMAL(14,2) NOT NULL,
    "totalPrice" DECIMAL(14,2) NOT NULL,
    "physicalWeight" DECIMAL(7,4) NOT NULL DEFAULT 0,
    "plannedStartDate" TIMESTAMP(3),
    "plannedEndDate" TIMESTAMP(3),
    "actualStartDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "physicalProgress" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "status" "BudgetItemStatus" NOT NULL DEFAULT 'PLANNED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BudgetItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceMeasurement" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "budgetItemId" TEXT NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "periodStartDate" TIMESTAMP(3),
    "periodEndDate" TIMESTAMP(3),
    "quantityMeasured" DECIMAL(12,3) NOT NULL,
    "amountMeasured" DECIMAL(14,2) NOT NULL,
    "physicalProgress" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "status" "MeasurementStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BudgetItem_projectId_idx" ON "BudgetItem"("projectId");

-- CreateIndex
CREATE INDEX "BudgetItem_taskId_idx" ON "BudgetItem"("taskId");

-- CreateIndex
CREATE INDEX "BudgetItem_phase_idx" ON "BudgetItem"("phase");

-- CreateIndex
CREATE INDEX "BudgetItem_status_idx" ON "BudgetItem"("status");

-- CreateIndex
CREATE INDEX "BudgetItem_plannedStartDate_idx" ON "BudgetItem"("plannedStartDate");

-- CreateIndex
CREATE INDEX "ServiceMeasurement_projectId_idx" ON "ServiceMeasurement"("projectId");

-- CreateIndex
CREATE INDEX "ServiceMeasurement_budgetItemId_idx" ON "ServiceMeasurement"("budgetItemId");

-- CreateIndex
CREATE INDEX "ServiceMeasurement_status_idx" ON "ServiceMeasurement"("status");

-- CreateIndex
CREATE INDEX "ServiceMeasurement_measuredAt_idx" ON "ServiceMeasurement"("measuredAt");

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceMeasurement" ADD CONSTRAINT "ServiceMeasurement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceMeasurement" ADD CONSTRAINT "ServiceMeasurement_budgetItemId_fkey" FOREIGN KEY ("budgetItemId") REFERENCES "BudgetItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceMeasurement" ADD CONSTRAINT "ServiceMeasurement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
