"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { materialSchema } from "@/lib/validations/graphite";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalNumber(value: number | undefined) {
  return value === undefined || Number.isNaN(value) ? null : value;
}

function parseMaterial(formData: FormData) {
  return materialSchema.safeParse({
    name: getString(formData, "name"),
    category: getString(formData, "category"),
    unit: getString(formData, "unit"),
    brand: getString(formData, "brand"),
    internalCode: getString(formData, "internalCode"),
    averagePrice: getString(formData, "averagePrice") || undefined,
    minimumStock: getString(formData, "minimumStock") || undefined,
    notes: getString(formData, "notes"),
  });
}

export async function createMaterialAction(formData: FormData) {
  await requireSession();

  const parsed = parseMaterial(formData);

  if (!parsed.success) {
    redirect(`/materials/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  if (!process.env.DATABASE_URL) {
    redirect("/materials/new?error=Configure%20DATABASE_URL%20para%20salvar%20no%20Supabase");
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;

  try {
    await prisma.material.create({
      data: {
        name: input.name,
        category: input.category,
        unit: input.unit,
        brand: input.brand || null,
        internalCode: input.internalCode || null,
        averagePrice: optionalNumber(input.averagePrice),
        minimumStock: optionalNumber(input.minimumStock),
        notes: input.notes || null,
      },
    });
  } catch {
    redirect("/materials/new?error=Nao%20foi%20possivel%20salvar.%20Verifique%20se%20o%20codigo%20interno%20ja%20existe");
  }

  revalidatePath("/materials");
  redirect("/materials?created=1");
}

export async function updateMaterialAction(formData: FormData) {
  await requireSession();

  const id = getString(formData, "id");
  const parsed = parseMaterial(formData);

  if (!id) {
    redirect("/materials?error=Material%20nao%20encontrado");
  }

  if (!parsed.success) {
    redirect(`/materials/${id}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  if (!process.env.DATABASE_URL) {
    redirect(`/materials/${id}/edit?error=Configure%20DATABASE_URL%20para%20salvar%20no%20Supabase`);
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;

  try {
    await prisma.material.update({
      where: {
        id,
      },
      data: {
        name: input.name,
        category: input.category,
        unit: input.unit,
        brand: input.brand || null,
        internalCode: input.internalCode || null,
        averagePrice: optionalNumber(input.averagePrice),
        minimumStock: optionalNumber(input.minimumStock),
        notes: input.notes || null,
      },
    });
  } catch {
    redirect(`/materials/${id}/edit?error=Nao%20foi%20possivel%20salvar.%20Verifique%20se%20o%20codigo%20interno%20ja%20existe`);
  }

  revalidatePath("/materials");
  redirect("/materials?updated=1");
}

export async function deleteMaterialAction(formData: FormData) {
  await requireSession();

  const id = getString(formData, "id");

  if (!id) {
    redirect("/materials?error=Material%20nao%20encontrado");
  }

  if (!process.env.DATABASE_URL) {
    redirect("/materials?error=Configure%20DATABASE_URL%20para%20excluir%20no%20Supabase");
  }

  const { prisma } = await import("@/lib/db/prisma");

  try {
    await prisma.material.delete({
      where: {
        id,
      },
    });
  } catch {
    redirect("/materials?error=Este%20material%20tem%20movimentacoes%20ou%20compras%20vinculadas");
  }

  revalidatePath("/materials");
  redirect("/materials?deleted=1");
}
