"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PurchaseStatus, StockMovementType } from "@/generated/prisma/client";
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

  await prisma.purchaseRequest.create({
    data: {
      projectId: input.projectId,
      requestedById: session.userId,
      status: statusMap[input.status],
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

  revalidatePath("/purchases");
  revalidatePath(`/projects/${input.projectId}`);
  redirect("/purchases?created=1");
}

export async function updatePurchaseAction(formData: FormData) {
  await requireSession();
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

  await prisma.$transaction(async (tx) => {
    await tx.purchaseRequestItem.deleteMany({ where: { purchaseRequestId: id } });
    await tx.purchaseRequest.update({
      where: { id },
      data: {
        projectId: input.projectId,
        status: statusMap[input.status],
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
