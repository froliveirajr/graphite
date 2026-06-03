"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProjectPriority, TaskStatus } from "@/generated/prisma/client";
import { requireSession } from "@/lib/auth/session";
import { taskSchema } from "@/lib/validations/graphite";

const statusMap: Record<string, TaskStatus> = {
  "A fazer": TaskStatus.TODO,
  "Em andamento": TaskStatus.IN_PROGRESS,
  Pausada: TaskStatus.PAUSED,
  Bloqueada: TaskStatus.BLOCKED,
  "Aguardando material": TaskStatus.WAITING_MATERIAL,
  "Aguardando aprovacao": TaskStatus.WAITING_APPROVAL,
  Concluida: TaskStatus.COMPLETED,
  Reprovada: TaskStatus.REJECTED,
  Cancelada: TaskStatus.CANCELED,
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

function dateFromInput(value: string | undefined) {
  return value ? new Date(`${value}T03:00:00.000Z`) : null;
}

function parseTask(formData: FormData) {
  return taskSchema.safeParse({
    projectId: getString(formData, "projectId"),
    areaId: getString(formData, "areaId"),
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    serviceType: getString(formData, "serviceType"),
    plannedStartDate: getString(formData, "plannedStartDate"),
    plannedEndDate: getString(formData, "plannedEndDate"),
    status: getString(formData, "status") || "A fazer",
    priority: getString(formData, "priority") || "Media",
  });
}

export async function createTaskAction(formData: FormData) {
  await requireSession();

  const parsed = parseTask(formData);

  if (!parsed.success) {
    redirect(`/tasks/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  if (!process.env.DATABASE_URL) {
    redirect("/tasks/new?error=Configure%20DATABASE_URL%20para%20salvar%20no%20Supabase");
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;

  await prisma.task.create({
    data: {
      projectId: input.projectId,
      areaId: input.areaId || null,
      title: input.title,
      description: input.description || null,
      serviceType: input.serviceType,
      plannedStartDate: dateFromInput(input.plannedStartDate),
      plannedEndDate: dateFromInput(input.plannedEndDate),
      status: statusMap[input.status],
      priority: priorityMap[input.priority],
    },
  });

  revalidatePath("/tasks");
  revalidatePath(`/projects/${input.projectId}`);
  redirect("/tasks?created=1");
}

export async function updateTaskAction(formData: FormData) {
  await requireSession();

  const id = getString(formData, "id");
  const parsed = parseTask(formData);

  if (!id) {
    redirect("/tasks?error=Tarefa%20nao%20encontrada");
  }

  if (!parsed.success) {
    redirect(`/tasks/${id}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  if (!process.env.DATABASE_URL) {
    redirect(`/tasks/${id}/edit?error=Configure%20DATABASE_URL%20para%20salvar%20no%20Supabase`);
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;

  await prisma.task.update({
    where: {
      id,
    },
    data: {
      projectId: input.projectId,
      areaId: input.areaId || null,
      title: input.title,
      description: input.description || null,
      serviceType: input.serviceType,
      plannedStartDate: dateFromInput(input.plannedStartDate),
      plannedEndDate: dateFromInput(input.plannedEndDate),
      status: statusMap[input.status],
      priority: priorityMap[input.priority],
    },
  });

  revalidatePath("/tasks");
  revalidatePath(`/projects/${input.projectId}`);
  redirect("/tasks?updated=1");
}

export async function deleteTaskAction(formData: FormData) {
  await requireSession();

  const id = getString(formData, "id");

  if (!id) {
    redirect("/tasks?error=Tarefa%20nao%20encontrada");
  }

  if (!process.env.DATABASE_URL) {
    redirect("/tasks?error=Configure%20DATABASE_URL%20para%20excluir%20no%20Supabase");
  }

  const { prisma } = await import("@/lib/db/prisma");

  try {
    await prisma.task.delete({
      where: {
        id,
      },
    });
  } catch {
    redirect("/tasks?error=Nao%20foi%20possivel%20excluir%20a%20tarefa");
  }

  revalidatePath("/tasks");
  redirect("/tasks?deleted=1");
}
