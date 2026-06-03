import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { updateMaterialAction } from "@/lib/actions/materials";
import { getMaterialDetails } from "@/lib/repositories/graphite";

export default async function EditMaterialPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const material = await getMaterialDetails(id);

  if (!material) {
    notFound();
  }

  return (
    <AppShell>
      <PageHeader
        title="Editar material"
        description="Atualize os dados cadastrais do item no catalogo da Graphite."
      />
      <div className="p-5 sm:p-8">
        <form action={updateMaterialAction} className="max-w-4xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <input type="hidden" name="id" value={material.id} />
          {error ? (
            <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-zinc-800">
              Nome do material
              <input name="name" required defaultValue={material.name} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Categoria
              <input name="category" required defaultValue={material.category} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Unidade
              <input name="unit" required defaultValue={material.unit} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Marca
              <input name="brand" defaultValue={material.brand} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Codigo interno
              <input name="internalCode" defaultValue={material.internalCode} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Preco medio
              <input name="averagePrice" type="number" min="0" step="0.01" defaultValue={material.averagePrice || ""} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Estoque minimo
              <input name="minimumStock" type="number" min="0" step="0.001" defaultValue={material.minimum || ""} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Observacoes
              <textarea name="notes" rows={4} defaultValue={material.notes} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Link href="/materials" className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700">
              Cancelar
            </Link>
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">
              Salvar alteracoes
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
