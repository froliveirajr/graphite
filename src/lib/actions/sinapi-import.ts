"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { importSinapi } from "@/lib/sinapi/importer";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function importSinapiAction(formData: FormData) {
  await requireSession();

  const file = formData.get("file");
  const uf = getString(formData, "uf") || "SP";
  const limitValue = getString(formData, "limit");
  const codes = getString(formData, "codes")
    .split(",")
    .map((code) => code.trim())
    .filter(Boolean);

  if (!(file instanceof File) || file.size === 0) {
    redirect("/sinapi-import?error=Selecione%20um%20arquivo%20SINAPI%20em%20ZIP%2C%20XLSX%2C%20XLS%20ou%20CSV");
  }

  const result = await importSinapi({
    prisma,
    uf,
    codes,
    limit: limitValue ? Number(limitValue) : 0,
    files: [
      {
        name: file.name,
        buffer: Buffer.from(await file.arrayBuffer()),
      },
    ],
  });

  revalidatePath("/service-compositions");
  revalidatePath("/materials");
  redirect(
    `/sinapi-import?imported=1&files=${result.filesRead}&rows=${result.compatibleRows}&compositions=${result.importedCompositions}&materials=${result.linkedMaterials}`,
  );
}
