"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApprovalStatus, PurchaseStatus, StockMovementType } from "@/generated/prisma/client";
import { requireSession } from "@/lib/auth/session";
import { purchaseRequestSchema } from "@/lib/validations/graphite";

const statusMap: Record<string, PurchaseStatus> = {
  Solicitada: PurchaseStatus.REQUESTED,
  "Em cotacao": PurchaseStatus.QUOTING,
  "Aguardando aprovacao": PurchaseStatus.WAITING_APPROVAL,
  Aprovada: PurchaseStatus.APPROVED,
  Comprada: PurchaseStatus.PURCHASED,
  Recebida: PurchaseStatus.RECEIVED,
  Cancelada: PurchaseStatus.CANCELED,
  Reprovada: PurchaseStatus.REJECTED,
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getList(formData: FormData, key: string) {
  return formData.getAll(key).map((value) => (typeof value === "string" ? value.trim() : ""));
}

function dateFromInput(value: string | undefined) {
  return value ? new Date(`${value}T03:00:00.000Z`) : null;
}

function parsePurchase(formData: FormData) {
  return purchaseRequestSchema.safeParse({
    projectId: getString(formData, "projectId"),
    status: getString(formData, "status") || "Solicitada",
    urgency: getString(formData, "urgency"),
    neededBy: getString(formData, "neededBy"),
    justification: getString(formData, "justification"),
    notes: getString(formData, "notes"),
  });
}

function parseItems(formData: FormData) {
  const materialIds = getList(formData, "materialId");
  const descriptions = getList(formData, "description");
  const quantities = getList(formData, "quantity");
  const units = getList(formData, "unit");
  const estimatedPrices = getList(formData, "estimatedUnitPrice");
  const approvedPrices = getList(formData, "approvedUnitPrice");

  return materialIds
    .map((materialId, index) => ({
      materialId: materialId || null,
      description: descriptions[index] || null,
      quantity: quantities[index] ? Number(quantities[index]) : 0,
      unit: units[index] || "un",
      estimatedUnitPrice: estimatedPrices[index] ? Number(estimatedPrices[index]) : null,
      approvedUnitPrice: approvedPrices[index] ? Number(approvedPrices[index]) : null,
    }))
    .filter((item) => (item.materialId || item.description) && item.quantity > 0);
}

function totals(items: ReturnType<typeof parseItems>) {
  return items.reduce(
    (total, item) => ({
      estimated: total.estimated + item.quantity * (item.estimatedUnitPrice ?? 0),
      approved: total.approved + item.quantity * (item.approvedUnitPrice ?? item.estimatedUnitPrice ?? 0),
    }),
    { estimated: 0, approved: 0 },
  );
}

async function validateMaterialBudget(
  prisma: Awaited<typeof import("@/lib/db/prisma")>["prisma"],
  projectId: string,
  items: ReturnType<typeof parseItems>,
  currentPurchaseId?: string,
) {
  const requestedInForm = new Map<string, number>();

  items.forEach((item) => {
    if (!item.materialId) return;
    requestedInForm.set(item.materialId, (requestedInForm.get(item.materialId) ?? 0) + item.quantity);
  });

  if (requestedInForm.size === 0) {
    return null;
  }

  const materialIds = Array.from(requestedInForm.keys());
  const [requirements, existingItems] = await Promise.all([
    prisma.projectMaterialRequirement.findMany({
      where: {
        projectId,
        materialId: {
          in: materialIds,
        },
      },
      include: {
        material: true,
      },
    }),
    prisma.purchaseRequestItem.findMany({
      where: {
        materialId: {
          in: materialIds,
        },
        purchaseRequest: {
          projectId,
          ...(currentPurchaseId ? { id: { not: currentPurchaseId } } : {}),
        },
      },
      select: {
        materialId: true,
        quantity: true,
      },
    }),
  ]);

  const requirementsByMaterial = new Map(requirements.map((requirement) => [requirement.materialId, requirement]));
  const existingByMaterial = new Map<string, number>();

  existingItems.forEach((item) => {
    if (!item.materialId) return;
    existingByMaterial.set(item.materialId, (existingByMaterial.get(item.materialId) ?? 0) + Number(item.quantity));
  });

  for (const [materialId, quantity] of requestedInForm) {
    const requirement = requirementsByMaterial.get(materialId);

    if (!requirement) {
      return {
        requiresApproval: false,
        message: "Material nao possui quantitativo previsto para esta obra. Lance o material em Quantitativos antes de pedir.",
      };
    }

    const plannedQuantity = Number(requirement.plannedQuantity);
    const alreadyRequested = existingByMaterial.get(materialId) ?? 0;
    const remainingQuantity = plannedQuantity - alreadyRequested;

    if (quantity > remainingQuantity + 0.0001) {
      return {
        requiresApproval: true,
        message: `Pedido excede o saldo de ${requirement.material.name}. Saldo disponivel: ${remainingQuantity.toLocaleString("pt-BR", {
          maximumFractionDigits: 3,
        })} ${requirement.unit}`,
      };
    }
  }

  return null;
}

async function upsertPurchaseApproval(
  prisma: Awaited<typeof import("@/lib/db/prisma")>["prisma"],
  purchaseId: string,
  requestedById: string,
  justification: string,
) {
  const existing = await prisma.approval.findFirst({
    where: {
      approvalType: "PURCHASE_MATERIAL_OVERRUN",
      referenceId: purchaseId,
      status: ApprovalStatus.PENDING,
    },
  });

  if (existing) {
    await prisma.approval.update({
      where: { id: existing.id },
      data: {
        justification,
      },
    });
    return;
  }

  await prisma.approval.create({
    data: {
      approvalType: "PURCHASE_MATERIAL_OVERRUN",
      referenceId: purchaseId,
      requestedById,
      status: ApprovalStatus.PENDING,
      justification,
    },
  });
}

export async function createPurchaseAction(formData: FormData) {
  const session = await requireSession();
  const parsed = parsePurchase(formData);

  if (!parsed.success) {
    redirect(`/purchases/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  const items = parseItems(formData);

  if (items.length === 0) {
    redirect("/purchases/new?error=Informe%20ao%20menos%20um%20item%20do%20pedido");
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;
  const calculated = totals(items);
  const budgetError = await validateMaterialBudget(prisma, input.projectId, items);

  if (budgetError) {
    if (!budgetError.requiresApproval) {
      redirect(`/purchases/new?error=${encodeURIComponent(budgetError.message)}`);
    }

    if (!input.justification) {
      redirect(
        `/purchases/new?error=${encodeURIComponent(`${budgetError.message}. Preencha uma justificativa para enviar ao administrador.`)}`,
      );
    }
  }

  const purchase = await prisma.purchaseRequest.create({
    data: {
      projectId: input.projectId,
      requestedById: session.userId,
      status: budgetError?.requiresApproval ? PurchaseStatus.WAITING_APPROVAL : statusMap[input.status],
      urgency: input.urgency || null,
      neededBy: dateFromInput(input.neededBy),
      justification: input.justification || null,
      notes: input.notes || null,
      estimatedTotal: calculated.estimated,
      approvedTotal: calculated.approved,
      items: {
        create: items,
      },
    },
  });

  if (budgetError?.requiresApproval) {
    await upsertPurchaseApproval(prisma, purchase.id, session.userId, input.justification ?? "");
  }

  revalidatePath("/purchases");
  revalidatePath(`/projects/${input.projectId}`);
  redirect("/purchases?created=1");
}

export async function updatePurchaseAction(formData: FormData) {
  const session = await requireSession();
  const id = getString(formData, "id");
  const parsed = parsePurchase(formData);

  if (!id) {
    redirect("/purchases?error=Pedido%20nao%20encontrado");
  }

  if (!parsed.success) {
    redirect(`/purchases/${id}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  const items = parseItems(formData);

  if (items.length === 0) {
    redirect(`/purchases/${id}/edit?error=Informe%20ao%20menos%20um%20item%20do%20pedido`);
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;
  const calculated = totals(items);
  const budgetError = await validateMaterialBudget(prisma, input.projectId, items, id);

  if (budgetError) {
    if (!budgetError.requiresApproval) {
      redirect(`/purchases/${id}/edit?error=${encodeURIComponent(budgetError.message)}`);
    }

    if (!input.justification) {
      redirect(
        `/purchases/${id}/edit?error=${encodeURIComponent(`${budgetError.message}. Preencha uma justificativa para enviar ao administrador.`)}`,
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.purchaseRequestItem.deleteMany({ where: { purchaseRequestId: id } });
    await tx.purchaseRequest.update({
      where: { id },
      data: {
        projectId: input.projectId,
        status: budgetError?.requiresApproval ? PurchaseStatus.WAITING_APPROVAL : statusMap[input.status],
        urgency: input.urgency || null,
        neededBy: dateFromInput(input.neededBy),
        justification: input.justification || null,
        notes: input.notes || null,
        estimatedTotal: calculated.estimated,
        approvedTotal: calculated.approved,
        items: {
          create: items,
        },
      },
    });
  });

  if (budgetError?.requiresApproval) {
    await upsertPurchaseApproval(prisma, id, session.userId, input.justification ?? "");
  }

  revalidatePath("/purchases");
  revalidatePath(`/projects/${input.projectId}`);
  redirect("/purchases?updated=1");
}

export async function deletePurchaseAction(formData: FormData) {
  await requireSession();
  const id = getString(formData, "id");

  if (!id) {
    redirect("/purchases?error=Pedido%20nao%20encontrado");
  }

  const { prisma } = await import("@/lib/db/prisma");

  try {
    await prisma.purchaseRequest.delete({ where: { id } });
  } catch {
    redirect("/purchases?error=Nao%20foi%20possivel%20excluir%20o%20pedido");
  }

  revalidatePath("/purchases");
  redirect("/purchases?deleted=1");
}

export async function approvePurchaseAction(formData: FormData) {
  const session = await requireSession();
  const id = getString(formData, "id");

  if (!id) {
    redirect("/purchases?error=Pedido%20nao%20encontrado");
  }

  const { prisma } = await import("@/lib/db/prisma");

  await prisma.purchaseRequest.update({
    where: { id },
    data: {
      status: PurchaseStatus.APPROVED,
      approvedById: session.userId,
      approvedAt: new Date(),
    },
  });

  await prisma.approval.updateMany({
    where: {
      approvalType: "PURCHASE_MATERIAL_OVERRUN",
      referenceId: id,
      status: ApprovalStatus.PENDING,
    },
    data: {
      status: ApprovalStatus.APPROVED,
      approvedById: session.userId,
      respondedAt: new Date(),
    },
  });

  revalidatePath("/purchases");
  redirect("/purchases?approved=1");
}

export async function rejectPurchaseAction(formData: FormData) {
  await requireSession();
  const id = getString(formData, "id");

  if (!id) {
    redirect("/purchases?error=Pedido%20nao%20encontrado");
  }

  const { prisma } = await import("@/lib/db/prisma");
  await prisma.purchaseRequest.update({ where: { id }, data: { status: PurchaseStatus.REJECTED } });
  await prisma.approval.updateMany({
    where: {
      approvalType: "PURCHASE_MATERIAL_OVERRUN",
      referenceId: id,
      status: ApprovalStatus.PENDING,
    },
    data: {
      status: ApprovalStatus.REJECTED,
      respondedAt: new Date(),
    },
  });

  revalidatePath("/purchases");
  redirect("/purchases?rejected=1");
}

export async function receivePurchaseAction(formData: FormData) {
  const session = await requireSession();
  const id = getString(formData, "id");

  if (!id) {
    redirect("/purchases?error=Pedido%20nao%20encontrado");
  }

  const { prisma } = await import("@/lib/db/prisma");
  const purchase = await prisma.purchaseRequest.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });

  if (!purchase) {
    redirect("/purchases?error=Pedido%20nao%20encontrado");
  }

  if (purchase.status === PurchaseStatus.WAITING_APPROVAL) {
    redirect("/purchases?error=Pedido%20aguardando%20aprovacao%20do%20administrador");
  }

  const receivableItems = purchase.items.filter((item) => item.materialId);

  if (receivableItems.length === 0) {
    redirect("/purchases?error=Pedido%20sem%20materiais%20vinculados%20para%20entrada%20em%20estoque");
  }

  await prisma.$transaction(async (tx) => {
    await tx.stockMovement.createMany({
      data: receivableItems.map((item) => {
        const unitCost = Number(item.approvedUnitPrice ?? item.estimatedUnitPrice ?? 0);
        const quantity = Number(item.quantity);

        return {
          projectId: purchase.projectId,
          materialId: item.materialId as string,
          movementType: StockMovementType.PURCHASE_ENTRY,
          quantity,
          unit: item.unit,
          unitCost,
          totalCost: quantity * unitCost,
          purchaseRequestId: purchase.id,
          createdById: session.userId,
          notes: "Entrada gerada pelo recebimento do pedido de material.",
        };
      }),
    });
    await tx.purchaseRequest.update({
      where: { id },
      data: {
        status: PurchaseStatus.RECEIVED,
      },
    });
  });

  revalidatePath("/purchases");
  revalidatePath("/stock");
  revalidatePath(`/projects/${purchase.projectId}`);
  redirect("/purchases?received=1");
}
