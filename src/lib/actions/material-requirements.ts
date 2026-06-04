"use server";

export async function syncProjectMaterialRequirements(projectId: string) {
  const { prisma } = await import("@/lib/db/prisma");
  const budgetItems = await prisma.budgetItem.findMany({
    where: {
      projectId,
      compositionId: {
        not: null,
      },
    },
    include: {
      composition: {
        include: {
          materials: {
            include: {
              material: true,
            },
          },
        },
      },
    },
  });

  const totals = new Map<
    string,
    {
      quantity: number;
      unit: string;
      estimatedUnitPrice: number;
    }
  >();

  budgetItems.forEach((item) => {
    const itemQuantity = Number(item.quantity);

    item.composition?.materials.forEach((line) => {
      const quantityPerUnit = Number(line.quantityPerUnit);
      const wasteMultiplier = 1 + Number(line.wastePercent) / 100;
      const quantity = itemQuantity * quantityPerUnit * wasteMultiplier;
      const current = totals.get(line.materialId);

      totals.set(line.materialId, {
        quantity: (current?.quantity ?? 0) + quantity,
        unit: line.unit,
        estimatedUnitPrice: Number(line.material.averagePrice ?? 0),
      });
    });
  });

  await Promise.all(
    Array.from(totals.entries()).map(([materialId, total]) =>
      prisma.projectMaterialRequirement.upsert({
        where: {
          projectId_materialId: {
            projectId,
            materialId,
          },
        },
        create: {
          projectId,
          materialId,
          plannedQuantity: total.quantity,
          unit: total.unit,
          estimatedUnitPrice: total.estimatedUnitPrice || null,
          notes: "Gerado automaticamente pelas composicoes do orcamento.",
        },
        update: {
          plannedQuantity: total.quantity,
          unit: total.unit,
          estimatedUnitPrice: total.estimatedUnitPrice || null,
          notes: "Gerado automaticamente pelas composicoes do orcamento.",
        },
      }),
    ),
  );
}
