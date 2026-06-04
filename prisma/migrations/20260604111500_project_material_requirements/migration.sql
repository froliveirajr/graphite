-- CreateTable
CREATE TABLE "ProjectMaterialRequirement" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "plannedQuantity" DECIMAL(12,3) NOT NULL,
    "unit" TEXT NOT NULL,
    "estimatedUnitPrice" DECIMAL(12,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectMaterialRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMaterialRequirement_projectId_materialId_key" ON "ProjectMaterialRequirement"("projectId", "materialId");

-- CreateIndex
CREATE INDEX "ProjectMaterialRequirement_projectId_idx" ON "ProjectMaterialRequirement"("projectId");

-- CreateIndex
CREATE INDEX "ProjectMaterialRequirement_materialId_idx" ON "ProjectMaterialRequirement"("materialId");

-- AddForeignKey
ALTER TABLE "ProjectMaterialRequirement" ADD CONSTRAINT "ProjectMaterialRequirement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMaterialRequirement" ADD CONSTRAINT "ProjectMaterialRequirement_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
