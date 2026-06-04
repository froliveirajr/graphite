"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { serviceCompositionSchema } from "@/lib/validations/graphite";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getList(formData: FormData, key: string) {
  return formData.getAll(key).map((value) => (typeof value === "string" ? value.trim() : ""));
}

function parseComposition(formData: FormData) {
  return serviceCompositionSchema.safeParse({
    projectId: getString(formData, "projectId"),
    code: getString(formData, "code"),
    name: getString(formData, "name"),
    serviceType: getString(formData, "serviceType"),
    unit: getString(formData, "unit"),
    unitPrice: getString(formData, "unitPrice") || undefined,
    notes: getString(formData, "notes"),
  });
}

function parseMaterials(formData: FormData) {
  const materialIds = getList(formData, "materialId");
  const quantities = getList(formData, "quantityPerUnit");
  const units = getList(formData, "materialUnit");
  const wastes = getList(formData, "wastePercent");
  const notes = getList(formData, "materialNotes");

  return materialIds
    .map((materialId, index) => ({
      materialId,
      quantityPerUnit: quantities[index] ? Number(quantities[index]) : 0,
      unit: units[index] || "un",
      wastePercent: wastes[index] ? Number(wastes[index]) : 0,
      notes: notes[index] || null,
    }))
    .filter((item) => item.materialId && item.quantityPerUnit > 0);
}

export async function createServiceCompositionAction(formData: FormData) {
  await requireSession();
  const parsed = parseComposition(formData);

  if (!parsed.success) {
    redirect(`/service-compositions/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  const materials = parseMaterials(formData);

  if (materials.length === 0) {
    redirect("/service-compositions/new?error=Informe%20ao%20menos%20um%20material%20da%20composicao");
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;

  await prisma.serviceComposition.create({
    data: {
      projectId: input.projectId || null,
      code: input.code || null,
      name: input.name,
      serviceType: input.serviceType,
      unit: input.unit,
      unitPrice: input.unitPrice ?? null,
      notes: input.notes || null,
      materials: {
        create: materials,
      },
    },
  });

  revalidatePath("/service-compositions");
  redirect("/service-compositions?created=1");
}

export async function updateServiceCompositionAction(formData: FormData) {
  await requireSession();
  const id = getString(formData, "id");
  const parsed = parseComposition(formData);

  if (!id) {
    redirect("/service-compositions?error=Composicao%20nao%20encontrada");
  }

  if (!parsed.success) {
    redirect(`/service-compositions/${id}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  const materials = parseMaterials(formData);

  if (materials.length === 0) {
    redirect(`/service-compositions/${id}/edit?error=Informe%20ao%20menos%20um%20material%20da%20composicao`);
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.serviceCompositionMaterial.deleteMany({ where: { compositionId: id } });
    await tx.serviceComposition.update({
      where: { id },
      data: {
        projectId: input.projectId || null,
        code: input.code || null,
        name: input.name,
        serviceType: input.serviceType,
        unit: input.unit,
        unitPrice: input.unitPrice ?? null,
        notes: input.notes || null,
        materials: {
          create: materials,
        },
      },
    });
  });

  revalidatePath("/service-compositions");
  revalidatePath("/budget-items");
  redirect("/service-compositions?updated=1");
}

export async function deleteServiceCompositionAction(formData: FormData) {
  await requireSession();
  const id = getString(formData, "id");

  if (!id) {
    redirect("/service-compositions?error=Composicao%20nao%20encontrada");
  }

  const { prisma } = await import("@/lib/db/prisma");

  try {
    await prisma.serviceComposition.delete({ where: { id } });
  } catch {
    redirect("/service-compositions?error=Nao%20foi%20possivel%20excluir%20a%20composicao");
  }

  revalidatePath("/service-compositions");
  redirect("/service-compositions?deleted=1");
}
