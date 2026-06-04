-- AlterTable
ALTER TABLE "BudgetItem" ADD COLUMN "compositionId" TEXT;

-- CreateTable
CREATE TABLE "ServiceComposition" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "unitPrice" DECIMAL(14,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceComposition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCompositionMaterial" (
    "id" TEXT NOT NULL,
    "compositionId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "quantityPerUnit" DECIMAL(12,4) NOT NULL,
    "unit" TEXT NOT NULL,
    "wastePercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceCompositionMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BudgetItem_compositionId_idx" ON "BudgetItem"("compositionId");

-- CreateIndex
CREATE INDEX "ServiceComposition_projectId_idx" ON "ServiceComposition"("projectId");

-- CreateIndex
CREATE INDEX "ServiceComposition_name_idx" ON "ServiceComposition"("name");

-- CreateIndex
CREATE INDEX "ServiceComposition_serviceType_idx" ON "ServiceComposition"("serviceType");

-- CreateIndex
CREATE INDEX "ServiceCompositionMaterial_compositionId_idx" ON "ServiceCompositionMaterial"("compositionId");

-- CreateIndex
CREATE INDEX "ServiceCompositionMaterial_materialId_idx" ON "ServiceCompositionMaterial"("materialId");

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_compositionId_fkey" FOREIGN KEY ("compositionId") REFERENCES "ServiceComposition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceComposition" ADD CONSTRAINT "ServiceComposition_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCompositionMaterial" ADD CONSTRAINT "ServiceCompositionMaterial_compositionId_fkey" FOREIGN KEY ("compositionId") REFERENCES "ServiceComposition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCompositionMaterial" ADD CONSTRAINT "ServiceCompositionMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
