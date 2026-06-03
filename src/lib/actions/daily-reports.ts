"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { dailyReportSchema } from "@/lib/validations/graphite";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function dateFromInput(value: string) {
  return new Date(`${value}T03:00:00.000Z`);
}

function parseDailyReport(formData: FormData) {
  return dailyReportSchema.safeParse({
    projectId: getString(formData, "projectId"),
    reportDate: getString(formData, "reportDate"),
    teamNotes: getString(formData, "teamNotes"),
    servicesExecuted: getString(formData, "servicesExecuted"),
    materialsReceived: getString(formData, "materialsReceived"),
    materialsUsed: getString(formData, "materialsUsed"),
    occurrences: getString(formData, "occurrences"),
    issues: getString(formData, "issues"),
    pendingItems: getString(formData, "pendingItems"),
    weatherNotes: getString(formData, "weatherNotes"),
  });
}

export async function createDailyReportAction(formData: FormData) {
  const session = await requireSession();
  const parsed = parseDailyReport(formData);

  if (!parsed.success) {
    redirect(`/daily-reports/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  if (!process.env.DATABASE_URL) {
    redirect("/daily-reports/new?error=Configure%20DATABASE_URL%20para%20salvar%20no%20Supabase");
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;

  try {
    await prisma.dailyReport.create({
      data: {
        projectId: input.projectId,
        reportDate: dateFromInput(input.reportDate),
        createdById: session.userId,
        teamNotes: input.teamNotes || null,
        servicesExecuted: input.servicesExecuted || null,
        materialsReceived: input.materialsReceived || null,
        materialsUsed: input.materialsUsed || null,
        occurrences: input.occurrences || null,
        issues: input.issues || null,
        pendingItems: input.pendingItems || null,
        weatherNotes: input.weatherNotes || null,
      },
    });
  } catch {
    redirect("/daily-reports/new?error=Ja%20existe%20diario%20para%20esta%20obra%20nesta%20data");
  }

  revalidatePath("/daily-reports");
  revalidatePath(`/projects/${input.projectId}`);
  redirect("/daily-reports?created=1");
}

export async function updateDailyReportAction(formData: FormData) {
  await requireSession();

  const id = getString(formData, "id");
  const parsed = parseDailyReport(formData);

  if (!id) {
    redirect("/daily-reports?error=Diario%20nao%20encontrado");
  }

  if (!parsed.success) {
    redirect(`/daily-reports/${id}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  if (!process.env.DATABASE_URL) {
    redirect(`/daily-reports/${id}/edit?error=Configure%20DATABASE_URL%20para%20salvar%20no%20Supabase`);
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;

  try {
    await prisma.dailyReport.update({
      where: {
        id,
      },
      data: {
        projectId: input.projectId,
        reportDate: dateFromInput(input.reportDate),
        teamNotes: input.teamNotes || null,
        servicesExecuted: input.servicesExecuted || null,
        materialsReceived: input.materialsReceived || null,
        materialsUsed: input.materialsUsed || null,
        occurrences: input.occurrences || null,
        issues: input.issues || null,
        pendingItems: input.pendingItems || null,
        weatherNotes: input.weatherNotes || null,
      },
    });
  } catch {
    redirect(`/daily-reports/${id}/edit?error=Ja%20existe%20diario%20para%20esta%20obra%20nesta%20data`);
  }

  revalidatePath("/daily-reports");
  revalidatePath(`/projects/${input.projectId}`);
  redirect("/daily-reports?updated=1");
}

export async function deleteDailyReportAction(formData: FormData) {
  await requireSession();

  const id = getString(formData, "id");

  if (!id) {
    redirect("/daily-reports?error=Diario%20nao%20encontrado");
  }

  if (!process.env.DATABASE_URL) {
    redirect("/daily-reports?error=Configure%20DATABASE_URL%20para%20excluir%20no%20Supabase");
  }

  const { prisma } = await import("@/lib/db/prisma");

  try {
    await prisma.dailyReport.delete({
      where: {
        id,
      },
    });
  } catch {
    redirect("/daily-reports?error=Nao%20foi%20possivel%20excluir%20o%20diario");
  }

  revalidatePath("/daily-reports");
  redirect("/daily-reports?deleted=1");
}
