"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { projectMaterialRequirementSchema } from "@/lib/validations/graphite";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseRequirement(formData: FormData) {
  return projectMaterialRequirementSchema.safeParse({
    projectId: getString(formData, "projectId"),
    materialId: getString(formData, "materialId"),
    plannedQuantity: getString(formData, "plannedQuantity"),
    unit: getString(formData, "unit"),
    estimatedUnitPrice: getString(formData, "estimatedUnitPrice") || undefined,
    notes: getString(formData, "notes"),
  });
}

export async function createProjectMaterialAction(formData: FormData) {
  await requireSession();
  const parsed = parseRequirement(formData);

  if (!parsed.success) {
    redirect(`/project-materials/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;

  try {
    await prisma.projectMaterialRequirement.create({
      data: {
        projectId: input.projectId,
        materialId: input.materialId,
        plannedQuantity: input.plannedQuantity,
        unit: input.unit,
        estimatedUnitPrice: input.estimatedUnitPrice ?? null,
        notes: input.notes || null,
      },
    });
  } catch {
    redirect("/project-materials/new?error=Este%20material%20ja%20foi%20lancado%20para%20esta%20obra");
  }

  revalidatePath("/project-materials");
  revalidatePath(`/projects/${input.projectId}`);
  redirect("/project-materials?created=1");
}

export async function updateProjectMaterialAction(formData: FormData) {
  await requireSession();
  const id = getString(formData, "id");
  const parsed = parseRequirement(formData);

  if (!id) {
    redirect("/project-materials?error=Quantitativo%20nao%20encontrado");
  }

  if (!parsed.success) {
    redirect(`/project-materials/${id}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;

  try {
    await prisma.projectMaterialRequirement.update({
      where: { id },
      data: {
        projectId: input.projectId,
        materialId: input.materialId,
        plannedQuantity: input.plannedQuantity,
        unit: input.unit,
        estimatedUnitPrice: input.estimatedUnitPrice ?? null,
        notes: input.notes || null,
      },
    });
  } catch {
    redirect(`/project-materials/${id}/edit?error=Nao%20foi%20possivel%20salvar%20o%20quantitativo`);
  }

  revalidatePath("/project-materials");
  revalidatePath(`/projects/${input.projectId}`);
  redirect("/project-materials?updated=1");
}

export async function deleteProjectMaterialAction(formData: FormData) {
  await requireSession();
  const id = getString(formData, "id");

  if (!id) {
    redirect("/project-materials?error=Quantitativo%20nao%20encontrado");
  }

  const { prisma } = await import("@/lib/db/prisma");

  try {
    await prisma.projectMaterialRequirement.delete({ where: { id } });
  } catch {
    redirect("/project-materials?error=Nao%20foi%20possivel%20excluir%20o%20quantitativo");
  }

  revalidatePath("/project-materials");
  redirect("/project-materials?deleted=1");
}
