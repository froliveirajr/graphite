-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PROJECT_MANAGER', 'OFFICE', 'FOREMAN', 'EMPLOYEE', 'CONTRACTOR', 'CLIENT');

-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('BUDGET', 'PLANNING', 'IN_PROGRESS', 'PAUSED', 'WAITING_CLIENT', 'WAITING_MATERIAL', 'WAITING_CONTRACTOR', 'INSPECTION', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ProjectPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'PAUSED', 'BLOCKED', 'WAITING_MATERIAL', 'WAITING_APPROVAL', 'COMPLETED', 'REJECTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('REQUESTED', 'QUOTING', 'WAITING_APPROVAL', 'APPROVED', 'PURCHASED', 'RECEIVED', 'CANCELED', 'REJECTED');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('PURCHASE_ENTRY', 'TRANSFER_ENTRY', 'CONSUMPTION', 'DISPOSAL', 'LOSS', 'RETURN_TO_CENTRAL');

-- CreateEnum
CREATE TYPE "DisposalStatus" AS ENUM ('REQUESTED', 'SCHEDULED', 'REMOVED', 'PROVED', 'CANCELED');

-- CreateEnum
CREATE TYPE "FinancialStatus" AS ENUM ('OPEN', 'PAID', 'OVERDUE', 'CANCELED');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "phone" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "documentType" TEXT,
    "documentNumber" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "address" TEXT,
    "clientType" TEXT NOT NULL,
    "notes" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "managerId" TEXT,
    "technicalResponsibleId" TEXT,
    "plannedStartDate" TIMESTAMP(3),
    "plannedEndDate" TIMESTAMP(3),
    "actualStartDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "plannedBudget" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "actualCost" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "priority" "ProjectPriority" NOT NULL DEFAULT 'MEDIUM',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectArea" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "approximateArea" DECIMAL(10,2),
    "status" TEXT NOT NULL DEFAULT 'PLANNING',
    "responsibleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "areaId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "serviceType" TEXT NOT NULL,
    "assignedToUserId" TEXT,
    "assignedToContractorId" TEXT,
    "plannedStartDate" TIMESTAMP(3),
    "plannedEndDate" TIMESTAMP(3),
    "actualStartDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "ProjectPriority" NOT NULL DEFAULT 'MEDIUM',
    "blockedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskChecklistItem" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "completedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "documentNumber" TEXT,
    "phone" TEXT,
    "jobTitle" TEXT NOT NULL,
    "specialty" TEXT,
    "employmentType" TEXT,
    "dailyRate" DECIMAL(12,2),
    "salary" DECIMAL(12,2),
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contractor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "documentNumber" TEXT,
    "contactName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "specialty" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "rating" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contractor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectContractor" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "serviceDescription" TEXT NOT NULL,
    "contractedValue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "paymentTerms" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectContractor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "documentNumber" TEXT,
    "contactName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "category" TEXT,
    "address" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "brand" TEXT,
    "internalCode" TEXT,
    "preferredSupplierId" TEXT,
    "averagePrice" DECIMAL(12,2),
    "minimumStock" DECIMAL(12,3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseRequest" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'REQUESTED',
    "urgency" TEXT,
    "neededBy" TIMESTAMP(3),
    "justification" TEXT,
    "estimatedTotal" DECIMAL(14,2),
    "approvedTotal" DECIMAL(14,2),
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseRequestItem" (
    "id" TEXT NOT NULL,
    "purchaseRequestId" TEXT NOT NULL,
    "materialId" TEXT,
    "description" TEXT,
    "quantity" DECIMAL(12,3) NOT NULL,
    "unit" TEXT NOT NULL,
    "estimatedUnitPrice" DECIMAL(12,2),
    "approvedUnitPrice" DECIMAL(12,2),
    "supplierId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseRequestItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "movementType" "StockMovementType" NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL,
    "unit" TEXT NOT NULL,
    "unitCost" DECIMAL(12,2),
    "totalCost" DECIMAL(14,2),
    "sourceProjectId" TEXT,
    "destinationProjectId" TEXT,
    "purchaseRequestId" TEXT,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteDisposal" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "wasteType" TEXT NOT NULL,
    "estimatedVolume" DECIMAL(12,3),
    "unit" TEXT,
    "disposalCompanyId" TEXT,
    "scheduledDate" TIMESTAMP(3),
    "removedAt" TIMESTAMP(3),
    "cost" DECIMAL(14,2),
    "status" "DisposalStatus" NOT NULL DEFAULT 'REQUESTED',
    "proofFileId" TEXT,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WasteDisposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyReport" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "teamNotes" TEXT,
    "servicesExecuted" TEXT,
    "materialsReceived" TEXT,
    "materialsUsed" TEXT,
    "occurrences" TEXT,
    "issues" TEXT,
    "pendingItems" TEXT,
    "weatherNotes" TEXT,
    "validatedById" TEXT,
    "validatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "areaId" TEXT,
    "taskId" TEXT,
    "clientId" TEXT,
    "contractorId" TEXT,
    "supplierId" TEXT,
    "fileType" TEXT NOT NULL,
    "category" TEXT,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialEntry" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "entryType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "status" "FinancialStatus" NOT NULL DEFAULT 'OPEN',
    "supplierId" TEXT,
    "contractorId" TEXT,
    "employeeId" TEXT,
    "purchaseRequestId" TEXT,
    "documentFileId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approval" (
    "id" TEXT NOT NULL,
    "approvalType" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "approvedById" TEXT,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "justification" TEXT,
    "responseNotes" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "oldData" JSONB,
    "newData" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "Client_name_idx" ON "Client"("name");

-- CreateIndex
CREATE INDEX "Client_documentNumber_idx" ON "Client"("documentNumber");

-- CreateIndex
CREATE INDEX "Client_status_idx" ON "Client"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Project_code_key" ON "Project"("code");

-- CreateIndex
CREATE INDEX "Project_clientId_idx" ON "Project"("clientId");

-- CreateIndex
CREATE INDEX "Project_managerId_idx" ON "Project"("managerId");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_priority_idx" ON "Project"("priority");

-- CreateIndex
CREATE INDEX "ProjectArea_projectId_idx" ON "ProjectArea"("projectId");

-- CreateIndex
CREATE INDEX "ProjectArea_responsibleId_idx" ON "ProjectArea"("responsibleId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectArea_projectId_name_key" ON "ProjectArea"("projectId", "name");

-- CreateIndex
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");

-- CreateIndex
CREATE INDEX "Task_areaId_idx" ON "Task"("areaId");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE INDEX "Task_plannedEndDate_idx" ON "Task"("plannedEndDate");

-- CreateIndex
CREATE INDEX "Task_assignedToUserId_idx" ON "Task"("assignedToUserId");

-- CreateIndex
CREATE INDEX "Task_assignedToContractorId_idx" ON "Task"("assignedToContractorId");

-- CreateIndex
CREATE INDEX "TaskChecklistItem_taskId_idx" ON "TaskChecklistItem"("taskId");

-- CreateIndex
CREATE INDEX "Employee_name_idx" ON "Employee"("name");

-- CreateIndex
CREATE INDEX "Employee_status_idx" ON "Employee"("status");

-- CreateIndex
CREATE INDEX "Contractor_name_idx" ON "Contractor"("name");

-- CreateIndex
CREATE INDEX "Contractor_specialty_idx" ON "Contractor"("specialty");

-- CreateIndex
CREATE INDEX "Contractor_status_idx" ON "Contractor"("status");

-- CreateIndex
CREATE INDEX "ProjectContractor_projectId_idx" ON "ProjectContractor"("projectId");

-- CreateIndex
CREATE INDEX "ProjectContractor_contractorId_idx" ON "ProjectContractor"("contractorId");

-- CreateIndex
CREATE INDEX "Supplier_name_idx" ON "Supplier"("name");

-- CreateIndex
CREATE INDEX "Supplier_category_idx" ON "Supplier"("category");

-- CreateIndex
CREATE INDEX "Supplier_status_idx" ON "Supplier"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Material_internalCode_key" ON "Material"("internalCode");

-- CreateIndex
CREATE INDEX "Material_name_idx" ON "Material"("name");

-- CreateIndex
CREATE INDEX "Material_category_idx" ON "Material"("category");

-- CreateIndex
CREATE INDEX "Material_preferredSupplierId_idx" ON "Material"("preferredSupplierId");

-- CreateIndex
CREATE INDEX "PurchaseRequest_projectId_idx" ON "PurchaseRequest"("projectId");

-- CreateIndex
CREATE INDEX "PurchaseRequest_requestedById_idx" ON "PurchaseRequest"("requestedById");

-- CreateIndex
CREATE INDEX "PurchaseRequest_approvedById_idx" ON "PurchaseRequest"("approvedById");

-- CreateIndex
CREATE INDEX "PurchaseRequest_status_idx" ON "PurchaseRequest"("status");

-- CreateIndex
CREATE INDEX "PurchaseRequestItem_purchaseRequestId_idx" ON "PurchaseRequestItem"("purchaseRequestId");

-- CreateIndex
CREATE INDEX "PurchaseRequestItem_materialId_idx" ON "PurchaseRequestItem"("materialId");

-- CreateIndex
CREATE INDEX "PurchaseRequestItem_supplierId_idx" ON "PurchaseRequestItem"("supplierId");

-- CreateIndex
CREATE INDEX "StockMovement_projectId_idx" ON "StockMovement"("projectId");

-- CreateIndex
CREATE INDEX "StockMovement_materialId_idx" ON "StockMovement"("materialId");

-- CreateIndex
CREATE INDEX "StockMovement_movementType_idx" ON "StockMovement"("movementType");

-- CreateIndex
CREATE INDEX "StockMovement_createdAt_idx" ON "StockMovement"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WasteDisposal_proofFileId_key" ON "WasteDisposal"("proofFileId");

-- CreateIndex
CREATE INDEX "WasteDisposal_projectId_idx" ON "WasteDisposal"("projectId");

-- CreateIndex
CREATE INDEX "WasteDisposal_status_idx" ON "WasteDisposal"("status");

-- CreateIndex
CREATE INDEX "WasteDisposal_scheduledDate_idx" ON "WasteDisposal"("scheduledDate");

-- CreateIndex
CREATE INDEX "DailyReport_projectId_idx" ON "DailyReport"("projectId");

-- CreateIndex
CREATE INDEX "DailyReport_createdById_idx" ON "DailyReport"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "DailyReport_projectId_reportDate_key" ON "DailyReport"("projectId", "reportDate");

-- CreateIndex
CREATE INDEX "File_projectId_idx" ON "File"("projectId");

-- CreateIndex
CREATE INDEX "File_areaId_idx" ON "File"("areaId");

-- CreateIndex
CREATE INDEX "File_taskId_idx" ON "File"("taskId");

-- CreateIndex
CREATE INDEX "File_clientId_idx" ON "File"("clientId");

-- CreateIndex
CREATE INDEX "File_fileType_idx" ON "File"("fileType");

-- CreateIndex
CREATE INDEX "FinancialEntry_projectId_idx" ON "FinancialEntry"("projectId");

-- CreateIndex
CREATE INDEX "FinancialEntry_category_idx" ON "FinancialEntry"("category");

-- CreateIndex
CREATE INDEX "FinancialEntry_status_idx" ON "FinancialEntry"("status");

-- CreateIndex
CREATE INDEX "FinancialEntry_dueDate_idx" ON "FinancialEntry"("dueDate");

-- CreateIndex
CREATE INDEX "Approval_approvalType_referenceId_idx" ON "Approval"("approvalType", "referenceId");

-- CreateIndex
CREATE INDEX "Approval_requestedById_idx" ON "Approval"("requestedById");

-- CreateIndex
CREATE INDEX "Approval_approvedById_idx" ON "Approval"("approvedById");

-- CreateIndex
CREATE INDEX "Approval_status_idx" ON "Approval"("status");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_technicalResponsibleId_fkey" FOREIGN KEY ("technicalResponsibleId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectArea" ADD CONSTRAINT "ProjectArea_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectArea" ADD CONSTRAINT "ProjectArea_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "ProjectArea"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedToContractorId_fkey" FOREIGN KEY ("assignedToContractorId") REFERENCES "Contractor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskChecklistItem" ADD CONSTRAINT "TaskChecklistItem_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskChecklistItem" ADD CONSTRAINT "TaskChecklistItem_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectContractor" ADD CONSTRAINT "ProjectContractor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectContractor" ADD CONSTRAINT "ProjectContractor_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_preferredSupplierId_fkey" FOREIGN KEY ("preferredSupplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequest" ADD CONSTRAINT "PurchaseRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequest" ADD CONSTRAINT "PurchaseRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequest" ADD CONSTRAINT "PurchaseRequest_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequestItem" ADD CONSTRAINT "PurchaseRequestItem_purchaseRequestId_fkey" FOREIGN KEY ("purchaseRequestId") REFERENCES "PurchaseRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequestItem" ADD CONSTRAINT "PurchaseRequestItem_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequestItem" ADD CONSTRAINT "PurchaseRequestItem_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_sourceProjectId_fkey" FOREIGN KEY ("sourceProjectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_destinationProjectId_fkey" FOREIGN KEY ("destinationProjectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_purchaseRequestId_fkey" FOREIGN KEY ("purchaseRequestId") REFERENCES "PurchaseRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteDisposal" ADD CONSTRAINT "WasteDisposal_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteDisposal" ADD CONSTRAINT "WasteDisposal_proofFileId_fkey" FOREIGN KEY ("proofFileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteDisposal" ADD CONSTRAINT "WasteDisposal_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyReport" ADD CONSTRAINT "DailyReport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyReport" ADD CONSTRAINT "DailyReport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyReport" ADD CONSTRAINT "DailyReport_validatedById_fkey" FOREIGN KEY ("validatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "ProjectArea"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialEntry" ADD CONSTRAINT "FinancialEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialEntry" ADD CONSTRAINT "FinancialEntry_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialEntry" ADD CONSTRAINT "FinancialEntry_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialEntry" ADD CONSTRAINT "FinancialEntry_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialEntry" ADD CONSTRAINT "FinancialEntry_purchaseRequestId_fkey" FOREIGN KEY ("purchaseRequestId") REFERENCES "PurchaseRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialEntry" ADD CONSTRAINT "FinancialEntry_documentFileId_fkey" FOREIGN KEY ("documentFileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialEntry" ADD CONSTRAINT "FinancialEntry_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
