"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BudgetItemStatus } from "@/generated/prisma/client";
import { requireSession } from "@/lib/auth/session";
import { syncProjectMaterialRequirements } from "@/lib/actions/material-requirements";
import { budgetItemSchema } from "@/lib/validations/graphite";

const statusMap: Record<string, BudgetItemStatus> = {
  Planejado: BudgetItemStatus.PLANNED,
  "Em andamento": BudgetItemStatus.IN_PROGRESS,
  Concluido: BudgetItemStatus.COMPLETED,
  Cancelado: BudgetItemStatus.CANCELED,
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function dateFromInput(value: string | undefined) {
  return value ? new Date(`${value}T03:00:00.000Z`) : null;
}

function parseBudgetItem(formData: FormData) {
  return budgetItemSchema.safeParse({
    projectId: getString(formData, "projectId"),
    taskId: getString(formData, "taskId"),
    compositionId: getString(formData, "compositionId"),
    code: getString(formData, "code"),
    phase: getString(formData, "phase"),
    description: getString(formData, "description"),
    unit: getString(formData, "unit"),
    quantity: getString(formData, "quantity"),
    unitPrice: getString(formData, "unitPrice"),
    physicalWeight: getString(formData, "physicalWeight") || undefined,
    plannedStartDate: getString(formData, "plannedStartDate"),
    plannedEndDate: getString(formData, "plannedEndDate"),
    physicalProgress: getString(formData, "physicalProgress") || undefined,
    status: getString(formData, "status") || "Planejado",
    notes: getString(formData, "notes"),
  });
}

export async function createBudgetItemAction(formData: FormData) {
  await requireSession();

  const parsed = parseBudgetItem(formData);

  if (!parsed.success) {
    redirect(`/budget-items/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  if (!process.env.DATABASE_URL) {
    redirect("/budget-items/new?error=Configure%20DATABASE_URL%20para%20salvar%20no%20Supabase");
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;
  const totalPrice = input.quantity * input.unitPrice;

  await prisma.budgetItem.create({
    data: {
      projectId: input.projectId,
      taskId: input.taskId || null,
      compositionId: input.compositionId || null,
      code: input.code || null,
      phase: input.phase,
      description: input.description,
      unit: input.unit,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      totalPrice,
      physicalWeight: input.physicalWeight ?? 0,
      plannedStartDate: dateFromInput(input.plannedStartDate),
      plannedEndDate: dateFromInput(input.plannedEndDate),
      physicalProgress: input.physicalProgress ?? 0,
      status: statusMap[input.status],
      notes: input.notes || null,
    },
  });
  await syncProjectMaterialRequirements(input.projectId);

  revalidatePath("/budget-items");
  revalidatePath(`/projects/${input.projectId}`);
  redirect("/budget-items?created=1");
}

export async function updateBudgetItemAction(formData: FormData) {
  await requireSession();

  const id = getString(formData, "id");
  const parsed = parseBudgetItem(formData);

  if (!id) {
    redirect("/budget-items?error=Item%20nao%20encontrado");
  }

  if (!parsed.success) {
    redirect(`/budget-items/${id}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;
  const totalPrice = input.quantity * input.unitPrice;

  await prisma.budgetItem.update({
    where: { id },
    data: {
      projectId: input.projectId,
      taskId: input.taskId || null,
      compositionId: input.compositionId || null,
      code: input.code || null,
      phase: input.phase,
      description: input.description,
      unit: input.unit,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      totalPrice,
      physicalWeight: input.physicalWeight ?? 0,
      plannedStartDate: dateFromInput(input.plannedStartDate),
      plannedEndDate: dateFromInput(input.plannedEndDate),
      physicalProgress: input.physicalProgress ?? 0,
      status: statusMap[input.status],
      notes: input.notes || null,
    },
  });
  await syncProjectMaterialRequirements(input.projectId);

  revalidatePath("/budget-items");
  revalidatePath(`/projects/${input.projectId}`);
  redirect("/budget-items?updated=1");
}

export async function deleteBudgetItemAction(formData: FormData) {
  await requireSession();

  const id = getString(formData, "id");

  if (!id) {
    redirect("/budget-items?error=Item%20nao%20encontrado");
  }

  const { prisma } = await import("@/lib/db/prisma");
  const item = await prisma.budgetItem.findUnique({
    where: { id },
    select: {
      projectId: true,
    },
  });

  try {
    await prisma.budgetItem.delete({ where: { id } });
  } catch {
    redirect("/budget-items?error=Nao%20foi%20possivel%20excluir%20o%20item");
  }

  if (item) {
    await syncProjectMaterialRequirements(item.projectId);
    revalidatePath(`/projects/${item.projectId}`);
  }

  revalidatePath("/budget-items");
  redirect("/budget-items?deleted=1");
}
