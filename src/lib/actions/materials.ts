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

export async function createMaterialAction(formData: FormData) {
  await requireSession();

  const parsed = materialSchema.safeParse({
    name: getString(formData, "name"),
    category: getString(formData, "category"),
    unit: getString(formData, "unit"),
    brand: getString(formData, "brand"),
    internalCode: getString(formData, "internalCode"),
    averagePrice: getString(formData, "averagePrice") || undefined,
    minimumStock: getString(formData, "minimumStock") || undefined,
    notes: getString(formData, "notes"),
  });

  if (!parsed.success) {
    redirect(`/materials/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  if (!process.env.DATABASE_URL) {
    redirect("/materials/new?error=Configure%20DATABASE_URL%20para%20salvar%20no%20Supabase");
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;

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

  revalidatePath("/materials");
  redirect("/materials?created=1");
}
