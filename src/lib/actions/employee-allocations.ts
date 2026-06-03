"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AllocationStatus } from "@/generated/prisma/client";
import { requireSession } from "@/lib/auth/session";
import { employeeAllocationSchema } from "@/lib/validations/graphite";

const statusMap: Record<string, AllocationStatus> = {
  Planejada: AllocationStatus.PLANNED,
  Ativa: AllocationStatus.ACTIVE,
  Pausada: AllocationStatus.PAUSED,
  Finalizada: AllocationStatus.FINISHED,
  Cancelada: AllocationStatus.CANCELED,
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function dateFromInput(value: string | undefined) {
  return value ? new Date(`${value}T03:00:00.000Z`) : null;
}

function parseAllocation(formData: FormData) {
  return employeeAllocationSchema.safeParse({
    projectId: getString(formData, "projectId"),
    employeeId: getString(formData, "employeeId"),
    role: getString(formData, "role"),
    serviceDescription: getString(formData, "serviceDescription"),
    startDate: getString(formData, "startDate"),
    endDate: getString(formData, "endDate"),
    dailyRate: getString(formData, "dailyRate") || undefined,
    status: getString(formData, "status") || "Ativa",
    notes: getString(formData, "notes"),
  });
}

export async function createEmployeeAllocationAction(formData: FormData) {
  await requireSession();

  const parsed = parseAllocation(formData);

  if (!parsed.success) {
    redirect(`/employee-allocations/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  if (!process.env.DATABASE_URL) {
    redirect("/employee-allocations/new?error=Configure%20DATABASE_URL%20para%20salvar%20no%20Supabase");
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;

  await prisma.projectEmployeeAllocation.create({
    data: {
      projectId: input.projectId,
      employeeId: input.employeeId,
      role: input.role,
      serviceDescription: input.serviceDescription || null,
      startDate: dateFromInput(input.startDate) ?? new Date(),
      endDate: dateFromInput(input.endDate),
      dailyRate: input.dailyRate || null,
      status: statusMap[input.status],
      notes: input.notes || null,
    },
  });

  revalidatePath("/employee-allocations");
  revalidatePath(`/projects/${input.projectId}`);
  redirect("/employee-allocations?created=1");
}

export async function updateEmployeeAllocationAction(formData: FormData) {
  await requireSession();

  const id = getString(formData, "id");
  const parsed = parseAllocation(formData);

  if (!id) {
    redirect("/employee-allocations?error=Locacao%20nao%20encontrada");
  }

  if (!parsed.success) {
    redirect(`/employee-allocations/${id}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  if (!process.env.DATABASE_URL) {
    redirect(`/employee-allocations/${id}/edit?error=Configure%20DATABASE_URL%20para%20salvar%20no%20Supabase`);
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;

  await prisma.projectEmployeeAllocation.update({
    where: {
      id,
    },
    data: {
      projectId: input.projectId,
      employeeId: input.employeeId,
      role: input.role,
      serviceDescription: input.serviceDescription || null,
      startDate: dateFromInput(input.startDate) ?? new Date(),
      endDate: dateFromInput(input.endDate),
      dailyRate: input.dailyRate || null,
      status: statusMap[input.status],
      notes: input.notes || null,
    },
  });

  revalidatePath("/employee-allocations");
  revalidatePath(`/projects/${input.projectId}`);
  redirect("/employee-allocations?updated=1");
}

export async function deleteEmployeeAllocationAction(formData: FormData) {
  await requireSession();

  const id = getString(formData, "id");

  if (!id) {
    redirect("/employee-allocations?error=Locacao%20nao%20encontrada");
  }

  if (!process.env.DATABASE_URL) {
    redirect("/employee-allocations?error=Configure%20DATABASE_URL%20para%20excluir%20no%20Supabase");
  }

  const { prisma } = await import("@/lib/db/prisma");

  try {
    await prisma.projectEmployeeAllocation.delete({
      where: {
        id,
      },
    });
  } catch {
    redirect("/employee-allocations?error=Nao%20foi%20possivel%20excluir%20a%20locacao");
  }

  revalidatePath("/employee-allocations");
  redirect("/employee-allocations?deleted=1");
}
