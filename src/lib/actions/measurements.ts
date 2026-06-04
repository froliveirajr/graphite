"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MeasurementStatus } from "@/generated/prisma/client";
import { requireSession } from "@/lib/auth/session";
import { serviceMeasurementSchema } from "@/lib/validations/graphite";

const statusMap: Record<string, MeasurementStatus> = {
  Rascunho: MeasurementStatus.DRAFT,
  Enviada: MeasurementStatus.SUBMITTED,
  Aprovada: MeasurementStatus.APPROVED,
  Rejeitada: MeasurementStatus.REJECTED,
  Faturada: MeasurementStatus.INVOICED,
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

function parseMeasurement(formData: FormData) {
  return serviceMeasurementSchema.safeParse({
    projectId: getString(formData, "projectId"),
    budgetItemId: getString(formData, "budgetItemId"),
    measuredAt: getString(formData, "measuredAt"),
    periodStartDate: getString(formData, "periodStartDate"),
    periodEndDate: getString(formData, "periodEndDate"),
    quantityMeasured: getString(formData, "quantityMeasured"),
    amountMeasured: getString(formData, "amountMeasured"),
    physicalProgress: getString(formData, "physicalProgress") || undefined,
    status: getString(formData, "status") || "Rascunho",
    notes: getString(formData, "notes"),
  });
}

function parseEmployees(formData: FormData) {
  const employeeIds = getList(formData, "employeeId");
  const roles = getList(formData, "employeeRole");
  const hours = getList(formData, "employeeHours");
  const notes = getList(formData, "employeeNotes");

  return employeeIds
    .map((employeeId, index) => ({
      employeeId,
      role: roles[index] || null,
      hoursWorked: hours[index] ? Number(hours[index]) : null,
      notes: notes[index] || null,
    }))
    .filter((item) => item.employeeId);
}

async function validateBudgetSaldo(
  prisma: Awaited<typeof import("@/lib/db/prisma")>["prisma"],
  budgetItemId: string,
  projectId: string,
  quantityMeasured: number,
  currentMeasurementId?: string,
) {
  const budgetItem = await prisma.budgetItem.findUnique({
    where: { id: budgetItemId },
    include: {
      measurements: {
        where: currentMeasurementId ? { id: { not: currentMeasurementId } } : undefined,
        select: {
          quantityMeasured: true,
        },
      },
    },
  });

  if (!budgetItem) {
    return "Item de orcamento nao encontrado";
  }

  if (budgetItem.projectId !== projectId) {
    return "O item de orcamento selecionado nao pertence a obra informada";
  }

  const measuredQuantity = budgetItem.measurements.reduce((total, measurement) => {
    return total + Number(measurement.quantityMeasured);
  }, 0);
  const budgetQuantity = Number(budgetItem.quantity);
  const remainingQuantity = budgetQuantity - measuredQuantity;

  if (quantityMeasured > remainingQuantity + 0.0001) {
    return `Quantidade medida excede o saldo do item. Saldo disponivel: ${remainingQuantity.toLocaleString("pt-BR", {
      maximumFractionDigits: 3,
    })} ${budgetItem.unit}`;
  }

  return null;
}

export async function createMeasurementAction(formData: FormData) {
  const session = await requireSession();
  const parsed = parseMeasurement(formData);

  if (!parsed.success) {
    redirect(`/measurements/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;
  const employees = parseEmployees(formData);
  const saldoError = await validateBudgetSaldo(prisma, input.budgetItemId, input.projectId, input.quantityMeasured);

  if (saldoError) {
    redirect(`/measurements/new?error=${encodeURIComponent(saldoError)}`);
  }

  await prisma.serviceMeasurement.create({
    data: {
      projectId: input.projectId,
      budgetItemId: input.budgetItemId,
      measuredAt: dateFromInput(input.measuredAt) ?? new Date(),
      periodStartDate: dateFromInput(input.periodStartDate),
      periodEndDate: dateFromInput(input.periodEndDate),
      quantityMeasured: input.quantityMeasured,
      amountMeasured: input.amountMeasured,
      physicalProgress: input.physicalProgress ?? 0,
      status: statusMap[input.status],
      notes: input.notes || null,
      createdById: session.userId,
      employees: {
        create: employees,
      },
    },
  });

  revalidatePath("/measurements");
  revalidatePath(`/projects/${input.projectId}`);
  redirect("/measurements?created=1");
}

export async function updateMeasurementAction(formData: FormData) {
  await requireSession();
  const id = getString(formData, "id");
  const parsed = parseMeasurement(formData);

  if (!id) {
    redirect("/measurements?error=Medicao%20nao%20encontrada");
  }

  if (!parsed.success) {
    redirect(`/measurements/${id}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;
  const employees = parseEmployees(formData);
  const saldoError = await validateBudgetSaldo(prisma, input.budgetItemId, input.projectId, input.quantityMeasured, id);

  if (saldoError) {
    redirect(`/measurements/${id}/edit?error=${encodeURIComponent(saldoError)}`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.serviceMeasurementEmployee.deleteMany({ where: { serviceMeasurementId: id } });
    await tx.serviceMeasurement.update({
      where: { id },
      data: {
        projectId: input.projectId,
        budgetItemId: input.budgetItemId,
        measuredAt: dateFromInput(input.measuredAt) ?? new Date(),
        periodStartDate: dateFromInput(input.periodStartDate),
        periodEndDate: dateFromInput(input.periodEndDate),
        quantityMeasured: input.quantityMeasured,
        amountMeasured: input.amountMeasured,
        physicalProgress: input.physicalProgress ?? 0,
        status: statusMap[input.status],
        notes: input.notes || null,
        employees: {
          create: employees,
        },
      },
    });
  });

  revalidatePath("/measurements");
  revalidatePath(`/projects/${input.projectId}`);
  redirect("/measurements?updated=1");
}

export async function deleteMeasurementAction(formData: FormData) {
  await requireSession();
  const id = getString(formData, "id");

  if (!id) {
    redirect("/measurements?error=Medicao%20nao%20encontrada");
  }

  const { prisma } = await import("@/lib/db/prisma");

  try {
    await prisma.serviceMeasurement.delete({ where: { id } });
  } catch {
    redirect("/measurements?error=Nao%20foi%20possivel%20excluir%20a%20medicao");
  }

  revalidatePath("/measurements");
  redirect("/measurements?deleted=1");
}
