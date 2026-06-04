-- CreateTable
CREATE TABLE "ServiceMeasurementEmployee" (
    "id" TEXT NOT NULL,
    "serviceMeasurementId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "role" TEXT,
    "hoursWorked" DECIMAL(8,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceMeasurementEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceMeasurementEmployee_serviceMeasurementId_idx" ON "ServiceMeasurementEmployee"("serviceMeasurementId");

-- CreateIndex
CREATE INDEX "ServiceMeasurementEmployee_employeeId_idx" ON "ServiceMeasurementEmployee"("employeeId");

-- AddForeignKey
ALTER TABLE "ServiceMeasurementEmployee" ADD CONSTRAINT "ServiceMeasurementEmployee_serviceMeasurementId_fkey" FOREIGN KEY ("serviceMeasurementId") REFERENCES "ServiceMeasurement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceMeasurementEmployee" ADD CONSTRAINT "ServiceMeasurementEmployee_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
