"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProjectPriority, ProjectStatus } from "@/generated/prisma/client";
import { projectSchema } from "@/lib/validations/graphite";

const statusMap: Record<string, ProjectStatus> = {
  Orcamento: ProjectStatus.BUDGET,
  Planejamento: ProjectStatus.PLANNING,
  "Em andamento": ProjectStatus.IN_PROGRESS,
  Pausada: ProjectStatus.PAUSED,
  "Aguardando cliente": ProjectStatus.WAITING_CLIENT,
  "Aguardando material": ProjectStatus.WAITING_MATERIAL,
  "Aguardando terceirizado": ProjectStatus.WAITING_CONTRACTOR,
  "Em vistoria": ProjectStatus.INSPECTION,
  Concluida: ProjectStatus.COMPLETED,
  Cancelada: ProjectStatus.CANCELED,
};

const priorityMap: Record<string, ProjectPriority> = {
  Alta: ProjectPriority.HIGH,
  Media: ProjectPriority.MEDIUM,
  Baixa: ProjectPriority.LOW,
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function dateFromInput(value: string) {
  return value ? new Date(`${value}T03:00:00.000Z`) : null;
}

function makeProjectCode() {
  const now = new Date();
  const year = now.getFullYear();
  const stamp = `${now.getMonth() + 1}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
  return `GPH-${year}-${stamp}`;
}

export async function createProjectAction(formData: FormData) {
  const parsed = projectSchema.safeParse({
    code: getString(formData, "code"),
    name: getString(formData, "name"),
    clientId: getString(formData, "clientId"),
    projectType: getString(formData, "projectType"),
    address: getString(formData, "address"),
    plannedBudget: getString(formData, "plannedBudget"),
    plannedStartDate: getString(formData, "plannedStartDate"),
    plannedEndDate: getString(formData, "plannedEndDate"),
    status: getString(formData, "status"),
    priority: getString(formData, "priority") || "Media",
    notes: getString(formData, "notes"),
  });

  if (!parsed.success) {
    redirect(`/projects/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  if (!process.env.DATABASE_URL) {
    redirect("/projects/new?error=Configure%20DATABASE_URL%20para%20salvar%20no%20Supabase");
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;

  const project = await prisma.project.create({
    data: {
      code: input.code || makeProjectCode(),
      name: input.name,
      clientId: input.clientId,
      projectType: input.projectType,
      address: input.address,
      plannedBudget: input.plannedBudget,
      plannedStartDate: dateFromInput(input.plannedStartDate),
      plannedEndDate: dateFromInput(input.plannedEndDate),
      status: statusMap[input.status],
      priority: priorityMap[input.priority],
      notes: input.notes || null,
    },
  });

  revalidatePath("/projects");
  revalidatePath("/");
  redirect(`/projects/${project.id}`);
}
