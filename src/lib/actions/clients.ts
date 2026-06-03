"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clientSchema } from "@/lib/validations/graphite";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createClientAction(formData: FormData) {
  const parsed = clientSchema.safeParse({
    name: getString(formData, "name"),
    documentType: getString(formData, "documentType") || undefined,
    documentNumber: getString(formData, "documentNumber"),
    phone: getString(formData, "phone"),
    whatsapp: getString(formData, "whatsapp"),
    email: getString(formData, "email"),
    address: getString(formData, "address"),
    clientType: getString(formData, "clientType"),
    notes: getString(formData, "notes"),
  });

  if (!parsed.success) {
    redirect(`/clients/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados invalidos")}`);
  }

  if (!process.env.DATABASE_URL) {
    redirect("/clients/new?error=Configure%20DATABASE_URL%20para%20salvar%20no%20Supabase");
  }

  const { prisma } = await import("@/lib/db/prisma");
  const input = parsed.data;

  await prisma.client.create({
    data: {
      name: input.name,
      documentType: input.documentType,
      documentNumber: input.documentNumber,
      phone: input.phone,
      whatsapp: input.whatsapp || input.phone,
      email: input.email || null,
      address: input.address || null,
      clientType: input.clientType,
      notes: input.notes || null,
    },
  });

  revalidatePath("/clients");
  revalidatePath("/projects/new");
  redirect("/clients?created=1");
}
